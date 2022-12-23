package users

import (
	"errors"

	"github.com/junioryono/ProUML/backend/sdk/types"
	"gorm.io/gorm"
)

type Users_SDK struct {
	db *gorm.DB
}

func Init(db *gorm.DB) *Users_SDK {
	return &Users_SDK{db: db}
}

func (u *Users_SDK) AddToDiagram(diagramId, userId, newUserId, role string) error {
	// Check if the role is valid
	if role != "editor" && role != "viewer" {
		return errors.New("invalid role")
	}

	// Add a newUserId to the diagram if userId is the owner or editor
	err := u.db.Transaction(func(tx *gorm.DB) error {
		var userDiagram types.DiagramUserRoleModel

		err := tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error
		if err != nil {
			return err
		}

		if userDiagram.Role != "owner" && userDiagram.Role != "editor" {
			return errors.New("user is not the owner or editor of the diagram")
		}

		var newUserDiagram types.DiagramUserRoleModel

		err = tx.Where("user_id = ? AND diagram_id = ?", newUserId, diagramId).First(&newUserDiagram).Error
		if err != nil {
			return err
		}

		if newUserDiagram.Role != "" {
			return errors.New("user already has access to the diagram")
		}

		newUserDiagram = types.DiagramUserRoleModel{
			UserID:    newUserId,
			DiagramID: diagramId,
			Role:      role,
		}

		err = tx.Create(&newUserDiagram).Error
		if err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		return err
	}

	return nil
}

func (u *Users_SDK) RemoveFromDiagram(diagramId, userId, removerUserId string) error {
	// Remove removerUserId from the diagram if userId is the owner or editor and removerUserId is not the owner
	err := u.db.Transaction(func(tx *gorm.DB) error {
		var userDiagram types.DiagramUserRoleModel

		err := tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error
		if err != nil {
			return err
		}

		if userDiagram.Role != "owner" && userDiagram.Role != "editor" {
			return errors.New("user is not the owner or editor of the diagram")
		}

		var removerUserDiagram types.DiagramUserRoleModel

		err = tx.Where("user_id = ? AND diagram_id = ?", removerUserId, diagramId).First(&removerUserDiagram).Error
		if err != nil {
			return err
		}

		if removerUserDiagram.Role == "owner" {
			return errors.New("user is the owner of the diagram")
		}

		err = tx.Delete(&removerUserDiagram).Error
		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return err
	}

	return nil
}

func (u *Users_SDK) UpdateAccessRole(diagramId, userId, updateUserId, role string) error {
	// Update the role of updateUserId to the diagram if:
	// updateUserId is not the owner
	// userId is the owner
	// userId is the editor and the new role is editor or viewer

	if role != "editor" && role != "viewer" {
		return errors.New("invalid role")
	}

	err := u.db.Transaction(func(tx *gorm.DB) error {
		var userDiagram types.DiagramUserRoleModel

		err := tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error
		if err != nil {
			return err
		}

		if userDiagram.Role != "owner" && userDiagram.Role != "editor" {
			return errors.New("user is not the owner or editor of the diagram")
		}

		var updateUserDiagram types.DiagramUserRoleModel

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

		err = tx.Save(&updateUserDiagram).Error
		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return err
	}

	return nil
}

func (u *Users_SDK) GetAllWithAccessRole(diagramId, userId string) ([]types.DiagramUserRoleModel, error) {
	// Get all users with access to the diagram if public or userId is the owner, editor or viewer
	var userDiagrams []types.DiagramUserRoleModel

	err := u.db.Transaction(func(tx *gorm.DB) error {
		var diagram types.DiagramModel

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

		var userDiagram types.DiagramUserRoleModel

		err = tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error
		if err != nil {
			return err
		}

		if userDiagram.Role != "owner" && userDiagram.Role != "editor" && userDiagram.Role != "viewer" {
			return errors.New("user is not the owner, editor or viewer of the diagram")
		}

		err = tx.Where("diagram_id = ?", diagramId).Find(&userDiagrams).Error
		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return userDiagrams, nil
}
