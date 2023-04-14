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
	auth  *auth.Auth_SDK
	getDb func() *gorm.DB
}

func Init(auth *auth.Auth_SDK, getDb func() *gorm.DB) *Users_SDK {
	return &Users_SDK{
		auth:  auth,
		getDb: getDb,
	}
}

func (u *Users_SDK) Get(diagramId, idToken string) (*models.DiagramUserRolesResponse, *types.WrappedError) {
	var response = &models.DiagramUserRolesResponse{
		Users:                  []models.DiagramUsersRolesHiddenContent{},
		AllowEditorPermissions: false,
	}

	// Get the user id from the id token
	userId, err := u.auth.Client.GetUserId(idToken)
	if err != nil {
		return nil, err
	}

	var diagram models.DiagramModel
	if err := u.getDb().
		Preload("UserRoles", func(db *gorm.DB) *gorm.DB {
			return db.Preload("User")
		}).
		Select("diagram_models.id, diagram_models.public, diagram_models.allow_editor_permissions").
		Where("id = ?", diagramId).
		First(&diagram).Error; err != nil {
		return nil, types.Wrap(err, types.ErrDiagramNotFound)
	}

	// If the user is not the owner, editor, or viewer, and the diagram is not public, return an error
	// Set response.AllowEditorPermissions = diagram.AllowEditorPermissions if the logged in user is the owner,
	// or if the logged in user is an editor and the diagram allows editor permissions
	var userHasAccess = false
	if diagram.Public {
		userHasAccess = true
	}

	for _, diagramUser := range diagram.UserRoles {
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
	userId, err := u.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Check if newUserRole is valid
	if newUserRole != "editor" && newUserRole != "viewer" {
		return types.Wrap(errors.New("invalid role"), types.ErrInvalidRole)
	}

	var diagram models.DiagramModel
	if err := u.getDb().
		Preload("UserRoles").
		Select("diagram_models.id, diagram_models.allow_editor_permissions").
		Where("id = ?", diagramId).
		First(&diagram).Error; err != nil {
		return types.Wrap(err, types.ErrDiagramNotFound)
	}

	// Check if the user has access to the diagram and if they have the correct permissions
	var userHasCorrectPermissions = false
	for _, diagramUser := range diagram.UserRoles {
		if diagramUser.UserID == userId {
			if diagramUser.Role == "owner" || (diagram.AllowEditorPermissions && diagramUser.Role == "editor") {
				userHasCorrectPermissions = true
			}

			break
		}

		// If the user already has access to the diagram, return an error
		if diagramUser.UserID == newUserEmail {
			return types.Wrap(errors.New("user already has access to the diagram"), types.ErrUserAlreadyAccess)
		}
	}

	if !userHasCorrectPermissions {
		return types.Wrap(errors.New("user does not have the correct permissions to add a user to the diagram"), types.ErrUserNoAccess)
	}

	// Add the user to the diagram if the new user has an account
	// If the new user does not have an account, send an email to the new user
	var newUser models.UserModel
	if err := u.getDb().Where("email = ?", newUserEmail).First(&newUser).Error; err == nil {
		// Add the user to the diagram
		if err := u.getDb().Create(&models.DiagramUserRoleModel{
			DiagramID: diagramId,
			UserID:    newUser.ID,
			Role:      newUserRole,
		}).Error; err != nil {
			return types.Wrap(err, types.ErrInternalServerError)
		}
	} else if errors.Is(err, gorm.ErrRecordNotFound) {
		// Send an email to the new user
		// if err := u.Email.SendAddUserToDiagramEmail(newUserEmail, diagramId); err != nil {
		// 	return types.Wrap(err, types.ErrInternalServerError)
		// }
	} else {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (u *Users_SDK) Update(diagramId, idToken, updateUserId, updateUserRole string) *types.WrappedError {
	// Get the user id from the id token
	userId, err := u.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	if updateUserRole != "editor" && updateUserRole != "viewer" {
		return types.Wrap(errors.New("invalid role"), types.ErrInvalidRole)
	}

	var diagram models.DiagramModel
	if err := u.getDb().
		Preload("UserRoles").
		Select("diagram_models.id, diagram_models.allow_editor_permissions").
		Where("id = ?", diagramId).
		First(&diagram).Error; err != nil {
		return types.Wrap(err, types.ErrDiagramNotFound)
	}

	// Check if the user has access to the diagram and if they have the correct permissions
	var userHasCorrectPermissions = false
	for _, diagramUser := range diagram.UserRoles {
		if diagramUser.UserID == userId {
			if diagramUser.Role == "owner" || (diagram.AllowEditorPermissions && diagramUser.Role == "editor") {
				userHasCorrectPermissions = true
			}

			break
		}
	}

	if !userHasCorrectPermissions {
		return types.Wrap(errors.New("user does not have the correct permissions to update a user on the diagram"), types.ErrUserNoAccess)
	}

	var userToUpdate models.DiagramUserRoleModel
	for _, diagramUser := range diagram.UserRoles {
		if diagramUser.UserID == updateUserId {
			userToUpdate = diagramUser
			break
		}
	}

	// Check if the user to update is the owner
	if userToUpdate.Role == "owner" {
		return types.Wrap(errors.New("cannot change the owner"), types.ErrUserIsOwner)
	}

	// Check if the user to update is an editor and if the diagram allows editor permissions
	if !diagram.AllowEditorPermissions && userToUpdate.Role == "editor" {
		return types.Wrap(errors.New("cannot change the editor"), types.ErrCannotChangeAsEditor)
	}

	// Update the user
	if err := u.getDb().Model(&models.DiagramUserRoleModel{}).Where("user_id = ? AND diagram_id = ?", updateUserId, diagramId).Update("role", updateUserRole).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (u *Users_SDK) Remove(diagramId, idToken, removerUserId string) *types.WrappedError {
	// Get the user id from the id token
	userId, err := u.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Remove removerUserId from the diagram if userId is the owner or editor and removerUserId is not the owner
	var diagram models.DiagramModel
	if err := u.getDb().
		Preload("UserRoles").
		Select("diagram_models.id, diagram_models.allow_editor_permissions").
		Where("id = ?", diagramId).
		First(&diagram).Error; err != nil {
		return types.Wrap(err, types.ErrDiagramNotFound)
	}

	// Check if the user has access to the diagram and if they have the correct permissions
	var userHasCorrectPermissions = false
	if userId == removerUserId {
		userHasCorrectPermissions = true
	} else {
		for _, diagramUser := range diagram.UserRoles {
			if diagramUser.UserID == userId {
				if diagramUser.Role == "owner" || (diagram.AllowEditorPermissions && diagramUser.Role == "editor") {
					userHasCorrectPermissions = true
				}

				break
			}
		}
	}

	if !userHasCorrectPermissions {
		return types.Wrap(errors.New("user does not have the correct permissions to remove a user from the diagram"), types.ErrUserNoAccess)
	}

	// Check if the user to remove is the owner
	var userToRemove models.DiagramUserRoleModel
	for _, diagramUser := range diagram.UserRoles {
		if diagramUser.UserID == removerUserId {
			userToRemove = diagramUser
			break
		}
	}

	if userToRemove.Role == "owner" {
		return types.Wrap(errors.New("cannot remove the owner"), types.ErrUserIsOwner)
	}

	// Check if the user to remove is an editor and if the diagram allows editor permissions
	if userId != removerUserId && !diagram.AllowEditorPermissions && userToRemove.Role == "editor" {
		return types.Wrap(errors.New("cannot remove the editor"), types.ErrCannotChangeAsEditor)
	}

	// Remove the user
	if err := u.getDb().Delete(&userToRemove).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}
