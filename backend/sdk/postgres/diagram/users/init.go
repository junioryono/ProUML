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

	var diagram models.DiagramModel
	if err := u.db.Where("id = ?", diagramId).First(&diagram).Error; err != nil {
		return nil, types.Wrap(err, types.ErrDiagramNotFound)
	}

	// Get all users with access to the diagram if public or userId is the owner, editor or viewer
	var allUserDiagrams []models.DiagramUserRoleModel
	if diagram.Public {
		if err := u.db.Preload("User").Where("diagram_id = ?", diagramId).Find(&allUserDiagrams).Error; err != nil {
			return nil, types.Wrap(err, types.ErrInternalServerError)
		}
	} else {
		var loggedInUserDiagram models.DiagramUserRoleModel
		if err := u.db.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&loggedInUserDiagram).Error; err != nil {
			return nil, types.Wrap(err, types.ErrInternalServerError)
		}

		if loggedInUserDiagram.Role != "owner" && loggedInUserDiagram.Role != "editor" && loggedInUserDiagram.Role != "viewer" {
			return nil, types.Wrap(errors.New("user does not have access to the diagram"), types.ErrUserNoAccess)
		}

		if err := u.db.Preload("User").Where("diagram_id = ?", diagramId).Find(&allUserDiagrams).Error; err != nil {
			return nil, types.Wrap(err, types.ErrInternalServerError)
		}
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

	// Add a newUserId to the diagram if userId is the owner or editor
	// Use Join to make sure that the userId has access to the diagram
	if err := u.db.Joins("JOIN user_models ON user_models.id = diagram_user_role_models.user_id").
		Where("user_models.id = ? AND diagram_user_role_models.diagram_id = ?", userId, diagramId).
		First(&models.DiagramUserRoleModel{}).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return types.Wrap(errors.New("user does not have access to the diagram"), types.ErrUserNoAccess)
		}

		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Use Join to make sure that the newUserId does not already have access to the diagram
	if err := u.db.Joins("JOIN user_models ON user_models.id = diagram_user_role_models.user_id").
		Where("user_models.id = ? AND diagram_user_role_models.diagram_id = ?", newUserId, diagramId).
		First(&models.DiagramUserRoleModel{}).Error; err == nil {
		return types.Wrap(errors.New("user already has access to the diagram"), types.ErrUserAlreadyAccess)
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	newUserDiagram := models.DiagramUserRoleModel{
		UserID:    newUserId,
		DiagramID: diagramId,
		Role:      newUserRole,
	}

	if err := u.db.Create(&newUserDiagram).Error; err != nil {
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

	var loggedInUserDiagram models.DiagramUserRoleModel
	if err := u.db.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&loggedInUserDiagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if loggedInUserDiagram.Role != "owner" && loggedInUserDiagram.Role != "editor" {
		return types.Wrap(errors.New("not owner or editor"), types.ErrNotOwnerOrEditor)
	}

	var updateUserDiagram models.DiagramUserRoleModel
	if err := u.db.Where("user_id = ? AND diagram_id = ?", updateUserId, diagramId).First(&updateUserDiagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if loggedInUserDiagram.Role == "editor" && updateUserRole == "viewer" {
		return types.Wrap(errors.New("cannot change as editor"), types.ErrCannotChangeAsEditor)
	}

	if updateUserDiagram.Role == "owner" {
		return types.Wrap(errors.New("user is owner"), types.ErrUserIsOwner)
	}

	if updateUserDiagram.Role == updateUserRole {
		return types.Wrap(errors.New("user already has this role"), types.ErrUserSameRole)
	}

	updateUserDiagram.Role = updateUserRole

	if err := u.db.Save(&updateUserDiagram).Error; err != nil {
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

	// Remove removerUserId from the diagram if userId is the owner or editor and removerUserId is not the owner
	var loggedInUserDiagram models.DiagramUserRoleModel
	if err := u.db.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&loggedInUserDiagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if loggedInUserDiagram.Role != "owner" && loggedInUserDiagram.Role != "editor" {
		return types.Wrap(errors.New("user does not have access to the diagram"), types.ErrUserNoAccess)
	}

	var deleteUserDiagram models.DiagramUserRoleModel
	if err := u.db.Where("user_id = ? AND diagram_id = ?", removerUserId, diagramId).First(&deleteUserDiagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if deleteUserDiagram.Role == "owner" {
		return types.Wrap(errors.New("user is owner"), types.ErrUserIsOwner)
	}

	if deleteUserDiagram.Role == "editor" && loggedInUserDiagram.Role == "editor" {
		return types.Wrap(errors.New("cannot change as editor"), types.ErrCannotChangeAsEditor)
	}

	if err := u.db.Delete(&deleteUserDiagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}
