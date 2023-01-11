package users

import (
	"errors"

	"github.com/junioryono/ProUML/backend/sdk/postgres/auth"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/types"
	"gorm.io/gorm"
)

type Users_SDK struct {
	Auth *auth.Auth_SDK
	db   *gorm.DB
}

func Init(Auth *auth.Auth_SDK, db *gorm.DB) *Users_SDK {
	return &Users_SDK{
		Auth: Auth,
		db:   db,
	}
}

func (u *Users_SDK) Get(diagramId, idToken string) ([]models.DiagramUsersRolesHiddenContent, *types.WrappedError) {
	// Get the user id from the id token
	userId, err := u.Auth.Client.GetUserId(idToken)
	if err != nil {
		return nil, err
	}

	tx := u.db.Begin()

	var diagram models.DiagramModel
	if err := tx.Where("id = ?", diagramId).First(&diagram).Error; err != nil {
		tx.Rollback()
		return nil, types.Wrap(err, types.ErrDiagramNotFound)
	}

	// Get all users with access to the diagram if public or userId is the owner, editor or viewer
	var allUserDiagrams []models.DiagramUserRoleModel
	if diagram.Public {
		if err := tx.Where("diagram_id = ?", diagramId).Find(&allUserDiagrams).Error; err != nil {
			tx.Rollback()
			return nil, types.Wrap(err, types.ErrInternalServerError)
		}
	} else {
		var loggedInUserDiagram models.DiagramUserRoleModel
		if err := tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&loggedInUserDiagram).Error; err != nil {
			tx.Rollback()
			return nil, types.Wrap(err, types.ErrInternalServerError)
		}

		if loggedInUserDiagram.Role != "owner" && loggedInUserDiagram.Role != "editor" && loggedInUserDiagram.Role != "viewer" {
			tx.Rollback()
			return nil, types.Wrap(errors.New("user does not have access to the diagram"), types.ErrUserNoAccess)
		}

		if err := tx.Where("diagram_id = ?", diagramId).Find(&allUserDiagrams).Error; err != nil {
			tx.Rollback()
			return nil, types.Wrap(err, types.ErrInternalServerError)
		}
	}

	// Get users from association
	for i := range allUserDiagrams {
		if err := tx.Model(&allUserDiagrams[i]).Association("User").Find(&allUserDiagrams[i].User); err != nil {
			tx.Rollback()
			return nil, types.Wrap(err, types.ErrInternalServerError)
		}
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	var response []models.DiagramUsersRolesHiddenContent
	for _, userDiagram := range allUserDiagrams {
		response = append(response, models.DiagramUsersRolesHiddenContent{
			UserId:   userDiagram.User.ID,
			Email:    userDiagram.User.Email,
			Role:     userDiagram.Role,
			FullName: userDiagram.User.FullName,
			Picture:  userDiagram.User.Picture,
		})
	}

	return response, nil
}

func (u *Users_SDK) Add(diagramId, idToken, newUserId, newUserRole string) *types.WrappedError {
	// Get the user id from the id token
	userId, err := u.Auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Check if newUserRole is valid
	if newUserRole != "editor" && newUserRole != "viewer" {
		return types.Wrap(errors.New("invalid role"), types.ErrInvalidRole)
	}

	tx := u.db.Begin()

	// Add a newUserId to the diagram if userId is the owner or editor
	// Use Join to make sure that the userId has access to the diagram
	if err := tx.Joins("JOIN user_models ON user_models.id = diagram_user_role_models.user_id").
		Where("user_models.id = ? AND diagram_user_role_models.diagram_id = ?", userId, diagramId).
		First(&models.DiagramUserRoleModel{}).Error; err != nil {
		tx.Rollback()
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return types.Wrap(errors.New("user does not have access to the diagram"), types.ErrUserNoAccess)
		}

		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Use Join to make sure that the newUserId does not already have access to the diagram
	if err := tx.Joins("JOIN user_models ON user_models.id = diagram_user_role_models.user_id").
		Where("user_models.id = ? AND diagram_user_role_models.diagram_id = ?", newUserId, diagramId).
		First(&models.DiagramUserRoleModel{}).Error; err != nil {
		tx.Rollback()
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return types.Wrap(err, types.ErrUserAlreadyAccess)
		}

		return types.Wrap(err, types.ErrInternalServerError)
	}

	newUserDiagram := models.DiagramUserRoleModel{
		UserID:    newUserId,
		DiagramID: diagramId,
		Role:      newUserRole,
	}

	if err := tx.Create(&newUserDiagram).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (u *Users_SDK) Update(diagramId, idToken, updateUserId, updateUserRole string) *types.WrappedError {
	// Get the user id from the id token
	userId, err := u.Auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	if updateUserRole != "editor" && updateUserRole != "viewer" {
		return types.Wrap(errors.New("invalid role"), types.ErrInvalidRole)
	}

	tx := u.db.Begin()

	var loggedInUserDiagram models.DiagramUserRoleModel
	if err := tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&loggedInUserDiagram).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if loggedInUserDiagram.Role != "owner" && loggedInUserDiagram.Role != "editor" {
		tx.Rollback()
		return types.Wrap(errors.New("not owner or editor"), types.ErrNotOwnerOrEditor)
	}

	var updateUserDiagram models.DiagramUserRoleModel
	if err := tx.Where("user_id = ? AND diagram_id = ?", updateUserId, diagramId).First(&updateUserDiagram).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if loggedInUserDiagram.Role == "editor" && updateUserRole == "viewer" {
		tx.Rollback()
		return types.Wrap(errors.New("cannot change as editor"), types.ErrCannotChangeAsEditor)
	}

	if updateUserDiagram.Role == "owner" {
		tx.Rollback()
		return types.Wrap(errors.New("user is owner"), types.ErrUserIsOwner)
	}

	if updateUserDiagram.Role == updateUserRole {
		tx.Rollback()
		return types.Wrap(errors.New("user already has this role"), types.ErrUserSameRole)
	}

	updateUserDiagram.Role = updateUserRole

	if err := tx.Save(&updateUserDiagram).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (u *Users_SDK) Remove(diagramId, idToken, removerUserId string) *types.WrappedError {
	// Get the user id from the id token
	userId, err := u.Auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	tx := u.db.Begin()

	// Remove removerUserId from the diagram if userId is the owner or editor and removerUserId is not the owner
	var loggedInUserDiagram models.DiagramUserRoleModel
	if err := tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&loggedInUserDiagram).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if loggedInUserDiagram.Role != "owner" && loggedInUserDiagram.Role != "editor" {
		tx.Rollback()
		return types.Wrap(errors.New("user does not have access to the diagram"), types.ErrUserNoAccess)
	}

	var deleteUserDiagram models.DiagramUserRoleModel
	if err := tx.Where("user_id = ? AND diagram_id = ?", removerUserId, diagramId).First(&deleteUserDiagram).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if deleteUserDiagram.Role == "owner" {
		tx.Rollback()
		return types.Wrap(errors.New("user is owner"), types.ErrUserIsOwner)
	}

	if deleteUserDiagram.Role == "editor" && loggedInUserDiagram.Role == "editor" {
		tx.Rollback()
		return types.Wrap(errors.New("cannot change as editor"), types.ErrCannotChangeAsEditor)
	}

	if err := tx.Delete(&deleteUserDiagram).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}
