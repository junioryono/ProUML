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

func (u *Users_SDK) Get(projectId, idToken string) (*models.ProjectUserRolesResponse, *types.WrappedError) {
	var response = &models.ProjectUserRolesResponse{
		Users:                  []models.ProjectUsersRolesHiddenContent{},
		AllowEditorPermissions: false,
	}

	// Get the user id from the id token
	userId, err := u.auth.Client.GetUserId(idToken)
	if err != nil {
		return nil, err
	}

	var project models.ProjectModel
	if err := u.getDb().
		Preload("UserRoles", func(db *gorm.DB) *gorm.DB {
			return db.Preload("User")
		}).
		Select("project_models.id, project_models.public, project_models.allow_editor_permissions").
		Where("id = ?", projectId).
		First(&project).Error; err != nil {
		return nil, types.Wrap(err, types.ErrProjectNotFound)
	}

	// If the user is not the owner, editor, or viewer, and the project is not public, return an error
	// Set response.AllowEditorPermissions = project.AllowEditorPermissions if the logged in user is the owner,
	// or if the logged in user is an editor and the project allows editor permissions
	var userHasAccess = false
	if project.Public {
		userHasAccess = true
	}

	for _, projectUser := range project.UserRoles {
		if projectUser.UserID == userId {
			userHasAccess = true
		}

		response.Users = append(response.Users, models.ProjectUsersRolesHiddenContent{
			UserId:   projectUser.UserID,
			Email:    projectUser.User.Email,
			Owner:    projectUser.Owner,
			FullName: projectUser.User.FullName,
			Picture:  projectUser.User.Picture,
		})
	}

	if !userHasAccess {
		return nil, types.Wrap(errors.New("user does not have access to the project"), types.ErrUserNoAccess)
	}

	// Order by name
	sort.Slice(response.Users, func(i, j int) bool {
		return response.Users[i].FullName < response.Users[j].FullName
	})

	return response, nil
}

func (u *Users_SDK) Add(projectId, idToken, newUserEmail string) *types.WrappedError {
	// Get the user id from the id token
	userId, err := u.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	var project models.ProjectModel
	if err := u.getDb().
		Preload("UserRoles").
		Select("project_models.id, project_models.allow_editor_permissions").
		Where("id = ?", projectId).
		First(&project).Error; err != nil {
		return types.Wrap(err, types.ErrProjectNotFound)
	}

	// Check if the user has access to the project and if they have the correct permissions
	var userHasCorrectPermissions = false
	for _, projectUser := range project.UserRoles {
		if projectUser.UserID == userId {
			if projectUser.Owner {
				userHasCorrectPermissions = true
			}

			break
		}

		// If the user already has access to the project, return an error
		if projectUser.UserID == newUserEmail {
			return types.Wrap(errors.New("user already has access to the project"), types.ErrUserAlreadyAccess)
		}
	}

	if !userHasCorrectPermissions {
		return types.Wrap(errors.New("user does not have the correct permissions to add a user to the project"), types.ErrUserNoAccess)
	}

	// Add the user to the project if the new user has an account
	// If the new user does not have an account, send an email to the new user
	var newUser models.UserModel
	if err := u.getDb().Where("email = ?", newUserEmail).First(&newUser).Error; err == nil {
		// Add the user to the project
		if err := u.getDb().Create(&models.ProjectUserRoleModel{
			ProjectID: projectId,
			UserID:    newUser.ID,
		}).Error; err != nil {
			return types.Wrap(err, types.ErrInternalServerError)
		}
	} else if errors.Is(err, gorm.ErrRecordNotFound) {
		// Send an email to the new user
		// if err := u.Email.SendAddUserToProjectEmail(newUserEmail, projectId); err != nil {
		// 	return types.Wrap(err, types.ErrInternalServerError)
		// }
	} else {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (u *Users_SDK) Remove(projectId, idToken, removerUserId string) *types.WrappedError {
	// Get the user id from the id token
	userId, err := u.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Remove removerUserId from the project if userId is the owner or editor and removerUserId is not the owner
	var project models.ProjectModel
	if err := u.getDb().
		Preload("UserRoles").
		Select("project_models.id, project_models.allow_editor_permissions").
		Where("id = ?", projectId).
		First(&project).Error; err != nil {
		return types.Wrap(err, types.ErrProjectNotFound)
	}

	// Check if the user has access to the project and if they have the correct permissions
	var userHasCorrectPermissions = false
	if userId == removerUserId {
		userHasCorrectPermissions = true
	} else {
		for _, projectUser := range project.UserRoles {
			if projectUser.UserID == userId {
				if projectUser.Owner {
					userHasCorrectPermissions = true
				}

				break
			}
		}
	}

	if !userHasCorrectPermissions {
		return types.Wrap(errors.New("user does not have the correct permissions to remove a user from the project"), types.ErrUserNoAccess)
	}

	// Check if the user to remove is the owner
	var userToRemove models.ProjectUserRoleModel
	for _, projectUser := range project.UserRoles {
		if projectUser.UserID == removerUserId {
			userToRemove = projectUser
			break
		}
	}

	// Remove the user
	if err := u.getDb().Delete(&userToRemove).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}
