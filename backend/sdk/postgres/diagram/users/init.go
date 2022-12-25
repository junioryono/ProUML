package users

import (
	"errors"

	"github.com/junioryono/ProUML/backend/sdk/postgres/auth"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
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

func (u *Users_SDK) Get(diagramId, idToken string) ([]models.DiagramUsersRolesHiddenContent, error) {
	// Get the user id from the id token
	userId, err := u.Auth.GetUserIdFromToken(idToken)
	if err != nil {
		return nil, err
	}

	var response []models.DiagramUsersRolesHiddenContent

	// Get all users with access to the diagram if public or userId is the owner, editor or viewer
	var allUserDiagrams []models.DiagramUserRoleModel

	err = u.db.Transaction(func(tx *gorm.DB) error {
		var diagram models.DiagramModel

		err := tx.Where("id = ?", diagramId).First(&diagram).Error
		if err != nil {
			return err
		}

		if diagram.Public {
			err = tx.Where("diagram_id = ?", diagramId).Find(&allUserDiagrams).Error
			if err != nil {
				return err
			}
		} else {
			var loggedInUserDiagram models.DiagramUserRoleModel

			err = tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&loggedInUserDiagram).Error
			if err != nil {
				return err
			}

			if loggedInUserDiagram.Role != "owner" && loggedInUserDiagram.Role != "editor" && loggedInUserDiagram.Role != "viewer" {
				return errors.New("user is not the owner, editor or viewer of the diagram")
			}

			err = tx.Where("diagram_id = ?", diagramId).Find(&allUserDiagrams).Error
			if err != nil {
				return err
			}
		}

		// Get users from association
		for i := range allUserDiagrams {
			err = tx.Model(&allUserDiagrams[i]).Association("User").Find(&allUserDiagrams[i].User)
			if err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	for _, userDiagram := range allUserDiagrams {
		response = append(response, models.DiagramUsersRolesHiddenContent{
			UserId:    userDiagram.User.ID,
			Email:     userDiagram.User.Email,
			Role:      userDiagram.Role,
			FirstName: userDiagram.User.FirstName,
			LastName:  userDiagram.User.LastName,
			Picture:   userDiagram.User.Picture,
		})
	}

	return response, nil
}

func (u *Users_SDK) Add(diagramId, idToken, newUserId, newUserRole string) error {
	// Get the user id from the id token
	userId, err := u.Auth.GetUserIdFromToken(idToken)
	if err != nil {
		return err
	}

	// Check if newUserRole is valid
	if newUserRole != "editor" && newUserRole != "viewer" {
		return errors.New("invalid role")
	}

	// Add a newUserId to the diagram if userId is the owner or editor
	err = u.db.Transaction(func(tx *gorm.DB) error {
		// Use Join to make sure that the userId has access to the diagram
		err := tx.Joins("JOIN user_models ON user_models.id = diagram_user_role_models.user_id").
			Where("user_models.id = ? AND diagram_user_role_models.diagram_id = ?", userId, diagramId).
			First(&models.DiagramUserRoleModel{}).Error

		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("user does not have access to the diagram")
		}

		// Use Join to make sure that the newUserId does not already have access to the diagram
		err = tx.Joins("JOIN user_models ON user_models.id = diagram_user_role_models.user_id").
			Where("user_models.id = ? AND diagram_user_role_models.diagram_id = ?", newUserId, diagramId).
			First(&models.DiagramUserRoleModel{}).Error

		// If the error is not "record not found", return the error
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("user already has access to the diagram")
		}

		newUserDiagram := models.DiagramUserRoleModel{
			UserID:    newUserId,
			DiagramID: diagramId,
			Role:      newUserRole,
		}

		return tx.Create(&newUserDiagram).Error
	})

	return err
}

func (u *Users_SDK) Update(diagramId, idToken, updateUserId, updateUserRole string) error {
	// Get the user id from the id token
	userId, err := u.Auth.GetUserIdFromToken(idToken)
	if err != nil {
		return err
	}

	if updateUserRole != "editor" && updateUserRole != "viewer" {
		return errors.New("invalid role")
	}

	err = u.db.Transaction(func(tx *gorm.DB) error {
		var loggedInUserDiagram models.DiagramUserRoleModel

		err := tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&loggedInUserDiagram).Error
		if err != nil {
			return err
		}

		if loggedInUserDiagram.Role != "owner" && loggedInUserDiagram.Role != "editor" {
			return errors.New("user is not the owner or editor of the diagram")
		}

		var updateUserDiagram models.DiagramUserRoleModel

		err = tx.Where("user_id = ? AND diagram_id = ?", updateUserId, diagramId).First(&updateUserDiagram).Error
		if err != nil {
			return err
		}

		if loggedInUserDiagram.Role == "editor" && updateUserRole == "viewer" {
			return errors.New("cannot change role from editor to viewer as an editor")
		}

		if updateUserDiagram.Role == "owner" {
			return errors.New("user is the owner of the diagram")
		}

		if updateUserDiagram.Role == updateUserRole {
			return errors.New("user already has the role")
		}

		updateUserDiagram.Role = updateUserRole

		return tx.Save(&updateUserDiagram).Error
	})

	return err
}

func (u *Users_SDK) Remove(diagramId, idToken, removerUserId string) error {
	// Get the user id from the id token
	userId, err := u.Auth.GetUserIdFromToken(idToken)
	if err != nil {
		return err
	}

	// Remove removerUserId from the diagram if userId is the owner or editor and removerUserId is not the owner
	err = u.db.Transaction(func(tx *gorm.DB) error {
		var loggedInUserDiagram models.DiagramUserRoleModel

		err := tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&loggedInUserDiagram).Error
		if err != nil {
			return err
		}

		if loggedInUserDiagram.Role != "owner" && loggedInUserDiagram.Role != "editor" {
			return errors.New("user is not the owner or editor of the diagram")
		}

		var deleteUserDiagram models.DiagramUserRoleModel

		err = tx.Where("user_id = ? AND diagram_id = ?", removerUserId, diagramId).First(&deleteUserDiagram).Error
		if err != nil {
			return err
		}

		if deleteUserDiagram.Role == "owner" {
			return errors.New("user is the owner of the diagram")
		}

		if deleteUserDiagram.Role == "editor" && loggedInUserDiagram.Role == "editor" {
			return errors.New("cannot remove an editor as an editor")
		}

		return tx.Delete(&deleteUserDiagram).Error
	})

	return err
}
