package diagram

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/postgres/diagram/users"
	"github.com/junioryono/ProUML/backend/sdk/types"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Diagram_SDK struct {
	Users *users.Users_SDK
	db    *gorm.DB
}

func Init(db *gorm.DB) *Diagram_SDK {
	return &Diagram_SDK{
		Users: users.Init(db),
		db:    db,
	}
}

func (d *Diagram_SDK) Create(userId string) (string, error) {
	diagramId := uuid.New().String()

	// Create a new diagram model
	diagram := types.DiagramModel{
		ID:      diagramId,
		Content: datatypes.JSON([]byte("{}")),
	}

	// Create a new user diagram model
	userDiagram := types.DiagramUserRoleModel{
		UserID:    userId,
		DiagramID: diagramId,
		Role:      "owner",
	}

	// Save the diagram and the user diagram to the database
	err := d.db.Transaction(func(tx *gorm.DB) error {
		err := tx.Create(&diagram).Error
		if err != nil {
			return err
		}

		err = tx.Create(&userDiagram).Error
		if err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return "", err
	}

	fmt.Printf("Diagram created: %v", diagram)

	return diagramId, nil
}

func (d *Diagram_SDK) Delete(diagramId, userId string) error {
	// Delete the diagram from the database if the user is the owner
	err := d.db.Transaction(func(tx *gorm.DB) error {
		var userDiagram types.DiagramUserRoleModel

		err := tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error
		if err != nil {
			return err
		}

		if userDiagram.Role != "owner" {
			return errors.New("user is not the owner of the diagram")
		}

		var diagram types.DiagramModel

		err = tx.Where("id = ?", diagramId).First(&diagram).Error
		if err != nil {
			return err
		}

		err = tx.Delete(&diagram).Error
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

func (d *Diagram_SDK) Get(diagramId, userId string) (*types.DiagramModel, error) {
	var diagram types.DiagramModel

	// Get the diagram from the database if the user has access to it or types.DiagramModel.public is true
	err := d.db.Transaction(func(tx *gorm.DB) error {
		err := tx.Where("id = ?", diagramId).First(&diagram).Error
		if err != nil {
			return err
		}

		if !diagram.Public {
			var userDiagram types.DiagramUserRoleModel

			err := tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error
			if err != nil {
				return err
			}

			if userDiagram.Role != "owner" && userDiagram.Role != "editor" && userDiagram.Role != "viewer" {
				return errors.New("user does not have access to diagram")
			}
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return &diagram, nil
}

func (d *Diagram_SDK) Update(diagramId, userId string, public bool, name string, content json.RawMessage) error {
	// Update the diagram in the database if the user is the owner or editor
	err := d.db.Transaction(func(tx *gorm.DB) error {
		var userDiagram types.DiagramUserRoleModel

		err := tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error
		if err != nil {
			return err
		}

		if userDiagram.Role != "owner" && userDiagram.Role != "editor" {
			return errors.New("user is not the owner or editor of the diagram")
		}

		var diagram types.DiagramModel

		err = tx.Where("id = ?", diagramId).First(&diagram).Error
		if err != nil {
			return err
		}

		diagram.Public = public
		diagram.Content = datatypes.JSON(content)

		if name != "" {
			diagram.Name = name
		}

		err = tx.Save(&diagram).Error
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
