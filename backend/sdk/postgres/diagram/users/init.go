package users

import (
	"errors"
	"sort"

	"github.com/junioryono/ProUML/backend/sdk/postgres/auth"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/types"
	"gorm.io/gorm"
)

type Users_SDK struct {
	Auth  *auth.Auth_SDK
	getDb func() *gorm.DB
}

func Init(Auth *auth.Auth_SDK, getDb func() *gorm.DB) *Users_SDK {
	return &Users_SDK{
		Auth:  Auth,
		getDb: getDb,
	}
}

func (u *Users_SDK) Get(diagramId, idToken string) (*models.DiagramUserRolesResponse, *types.WrappedError) {
	var response = &models.DiagramUserRolesResponse{
		Users:                  []models.DiagramUsersRolesHiddenContent{},
		AllowEditorPermissions: false,
	}

	// Get the user id from the id token
	userId, err := u.Auth.Client.GetUserId(idToken)
	if err != nil {
		return nil, err
	}

	var diagram models.DiagramModel
	if err := u.getDb().Where("id = ?", diagramId).First(&diagram).Error; err != nil {
		return nil, types.Wrap(err, types.ErrDiagramNotFound)
	}

	// Get all users with access to the diagram

	var diagramUsers []models.DiagramUserRoleModel
	if err := u.getDb().Preload("User").Where("diagram_id = ?", diagramId).Find(&diagramUsers).Error; err != nil {
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	// If the user is not the owner, editor, or viewer, and the diagram is not public, return an error
	// Set response.AllowEditorPermissions = diagram.AllowEditorPermissions if the logged in user is the owner,
	// or if the logged in user is an editor and the diagram allows editor permissions
	var userHasAccess = false
	if diagram.Public {
		userHasAccess = true
	}

	for _, diagramUser := range diagramUsers {
		if diagramUser.UserID == userId {
			if diagramUser.Role == "owner" || diagramUser.Role == "editor" || diagramUser.Role == "viewer" {
				userHasAccess = true
			}

			if diagramUser.Role == "owner" || (diagram.AllowEditorPermissions && diagramUser.Role == "editor") {
				response.AllowEditorPermissions = true
			}

			if diagramUser.Role == "owner" {
				response.EditorPermissionsEnabled = &diagram.AllowEditorPermissions
			}
		}

		response.Users = append(response.Users, models.DiagramUsersRolesHiddenContent{
			UserId:   diagramUser.UserID,
			Email:    diagramUser.User.Email,
			Role:     diagramUser.Role,
			FullName: diagramUser.User.FullName,
			Picture:  diagramUser.User.Picture,
		})
	}

	if !userHasAccess {
		return nil, types.Wrap(errors.New("user does not have access to the diagram"), types.ErrUserNoAccess)
	}

	// Order the users by Role
	// Add the owner first, then the editors, then the viewers
	// If people have the same role, order by name
	sort.Slice(response.Users, func(i, j int) bool {
		if response.Users[i].Role == response.Users[j].Role {
			return response.Users[i].FullName < response.Users[j].FullName
		}

		if response.Users[i].Role == "owner" {
			return true
		}

		if response.Users[j].Role == "owner" {
			return false
		}

		if response.Users[i].Role == "editor" {
			return true
		}

		if response.Users[j].Role == "editor" {
			return false
		}

		return true
	})

	return response, nil
}

func (u *Users_SDK) Add(diagramId, idToken, newUserEmail, newUserRole string) *types.WrappedError {
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
	if err := u.getDb().Joins("JOIN user_models ON user_models.id = diagram_user_role_models.user_id").
		Where("user_models.id = ? AND diagram_user_role_models.diagram_id = ?", userId, diagramId).
		First(&models.DiagramUserRoleModel{}).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return types.Wrap(errors.New("user does not have access to the diagram"), types.ErrUserNoAccess)
		}

		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Get the newUserId from the newUserEmail using pluck
	var newUserId string
	if err := u.getDb().Model(&models.UserModel{}).Where("email = ?", newUserEmail).Pluck("id", &newUserId).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Use Join to make sure that the newUserId does not already have access to the diagram
	if err := u.getDb().Joins("JOIN user_models ON user_models.id = diagram_user_role_models.user_id").
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

	if err := u.getDb().Create(&newUserDiagram).Error; err != nil {
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
	if err := u.getDb().Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&loggedInUserDiagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if loggedInUserDiagram.Role != "owner" && loggedInUserDiagram.Role != "editor" {
		return types.Wrap(errors.New("not owner or editor"), types.ErrNotOwnerOrEditor)
	}

	var allowEditorPermissions bool
	if err := u.getDb().Model(&models.DiagramModel{}).Where("id = ?", diagramId).Pluck("allow_editor_permissions", &allowEditorPermissions).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if !allowEditorPermissions && loggedInUserDiagram.Role == "editor" {
		return types.Wrap(errors.New("cannot change to editor"), types.ErrCannotChangeAsEditor)
	}

	var updateUserDiagram models.DiagramUserRoleModel
	if err := u.getDb().Where("user_id = ? AND diagram_id = ?", updateUserId, diagramId).First(&updateUserDiagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if updateUserDiagram.Role == "owner" {
		return types.Wrap(errors.New("user is owner"), types.ErrUserIsOwner)
	}

	if updateUserDiagram.Role == updateUserRole {
		return types.Wrap(errors.New("user already has this role"), types.ErrUserSameRole)
	}

	updateUserDiagram.Role = updateUserRole

	if err := u.getDb().Save(&updateUserDiagram).Error; err != nil {
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
	if err := u.getDb().Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&loggedInUserDiagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if loggedInUserDiagram.Role != "owner" && loggedInUserDiagram.Role != "editor" {
		return types.Wrap(errors.New("user does not have access to the diagram"), types.ErrUserNoAccess)
	}

	var deleteUserDiagram models.DiagramUserRoleModel
	if err := u.getDb().Where("user_id = ? AND diagram_id = ?", removerUserId, diagramId).First(&deleteUserDiagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if deleteUserDiagram.Role == "owner" {
		return types.Wrap(errors.New("user is owner"), types.ErrUserIsOwner)
	}

	if deleteUserDiagram.Role == "editor" && loggedInUserDiagram.Role == "editor" {
		return types.Wrap(errors.New("cannot change as editor"), types.ErrCannotChangeAsEditor)
	}

	if err := u.getDb().Delete(&deleteUserDiagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}
