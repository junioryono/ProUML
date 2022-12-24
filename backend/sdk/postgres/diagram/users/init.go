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

func (u *Users_SDK) AddToDiagram(diagramId, idToken, newUserEmail, role string) error {
	// Get the user id from the id token
	userId, err := u.Auth.GetUserIdFromToken(idToken)
	if err != nil {
		return err
	}

	// Check if the role is valid
	if role != "editor" && role != "viewer" {
		return errors.New("invalid role")
	}

	// Add a newUserId to the diagram if userId is the owner or editor
	err = u.db.Transaction(func(tx *gorm.DB) error {
		var newUserId string
		err := tx.Where("email = ?", newUserEmail).First(&models.UserModel{}).Pluck("id", &newUserId).Error
		if err != nil {
			// If the error is not "record not found", return the error
			if !errors.Is(err, gorm.ErrRecordNotFound) {
				return errors.New("invalid user")
			}

			return err
		}

		var userDiagram models.DiagramUserRoleModel

		err = tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error
		if err != nil {
			return err
		}

		if userDiagram.Role != "owner" && userDiagram.Role != "editor" {
			return errors.New("user is not the owner or editor of the diagram")
		}

		var newUserDiagram models.DiagramUserRoleModel

		err = tx.Where("user_id = ? AND diagram_id = ?", newUserId, diagramId).First(&newUserDiagram).Error
		if err != nil {
			return err
		}

		if newUserDiagram.Role != "" {
			return errors.New("user already has access to the diagram")
		}

		newUserDiagram = models.DiagramUserRoleModel{
			UserID:    newUserId,
			DiagramID: diagramId,
			Role:      role,
		}

		return tx.Create(&newUserDiagram).Error
	})

	return err
}

func (u *Users_SDK) RemoveFromDiagram(diagramId, idToken, removerUserId string) error {
	// Get the user id from the id token
	userId, err := u.Auth.GetUserIdFromToken(idToken)
	if err != nil {
		return err
	}

	// Remove removerUserId from the diagram if userId is the owner or editor and removerUserId is not the owner
	err = u.db.Transaction(func(tx *gorm.DB) error {
		var userDiagram models.DiagramUserRoleModel

		err := tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error
		if err != nil {
			return err
		}

		if userDiagram.Role != "owner" && userDiagram.Role != "editor" {
			return errors.New("user is not the owner or editor of the diagram")
		}

		var removerUserDiagram models.DiagramUserRoleModel

		err = tx.Where("user_id = ? AND diagram_id = ?", removerUserId, diagramId).First(&removerUserDiagram).Error
		if err != nil {
			return err
		}

		if removerUserDiagram.Role == "owner" {
			return errors.New("user is the owner of the diagram")
		}

		return tx.Delete(&removerUserDiagram).Error
	})

	return err
}

func (u *Users_SDK) UpdateAccessRole(diagramId, idToken, updateUserId, role string) error {
	// Get the user id from the id token
	userId, err := u.Auth.GetUserIdFromToken(idToken)
	if err != nil {
		return err
	}

	// Update the role of updateUserId to the diagram if:
	// updateUserId is not the owner
	// userId is the owner
	// userId is the editor and the new role is editor or viewer

	if role != "editor" && role != "viewer" {
		return errors.New("invalid role")
	}

	err = u.db.Transaction(func(tx *gorm.DB) error {
		var userDiagram models.DiagramUserRoleModel

		err := tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error
		if err != nil {
			return err
		}

		if userDiagram.Role != "owner" && userDiagram.Role != "editor" {
			return errors.New("user is not the owner or editor of the diagram")
		}

		var updateUserDiagram models.DiagramUserRoleModel

		err = tx.Where("user_id = ? AND diagram_id = ?", updateUserId, diagramId).First(&updateUserDiagram).Error
		if err != nil {
			return err
		}

		if updateUserDiagram.Role == "owner" {
			return errors.New("user is the owner of the diagram")
		}

		if userDiagram.Role == "editor" && (role == "owner" || role == "editor") {
			return errors.New("user is the editor of the diagram and the new role is owner or editor")
		}

		updateUserDiagram.Role = role

		return tx.Save(&updateUserDiagram).Error
	})

	return err
}

func (u *Users_SDK) GetAllWithAccessRole(diagramId, idToken string) ([]models.DiagramUserRoleModel, error) {
	// Get the user id from the id token
	userId, err := u.Auth.GetUserIdFromToken(idToken)
	if err != nil {
		return nil, err
	}

	// Get all users with access to the diagram if public or userId is the owner, editor or viewer
	var userDiagrams []models.DiagramUserRoleModel

	err = u.db.Transaction(func(tx *gorm.DB) error {
		var diagram models.DiagramModel

		err := tx.Where("id = ?", diagramId).First(&diagram).Error
		if err != nil {
			return err
		}

		if diagram.Public {
			err := tx.Where("diagram_id = ?", diagramId).Find(&userDiagrams).Error
			if err != nil {
				return err
			}
			return nil
		}

		var userDiagram models.DiagramUserRoleModel

		err = tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error
		if err != nil {
			return err
		}

		if userDiagram.Role != "owner" && userDiagram.Role != "editor" && userDiagram.Role != "viewer" {
			return errors.New("user is not the owner, editor or viewer of the diagram")
		}

		return tx.Where("diagram_id = ?", diagramId).Find(&userDiagrams).Error
	})

	if err != nil {
		return nil, err
	}

	return userDiagrams, nil
}
