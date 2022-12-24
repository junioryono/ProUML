package diagram

import (
	"encoding/json"
	"errors"

	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/postgres/auth"
	"github.com/junioryono/ProUML/backend/sdk/postgres/diagram/users"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Diagram_SDK struct {
	Auth  *auth.Auth_SDK
	Users *users.Users_SDK
	db    *gorm.DB
}

func Init(db *gorm.DB, Auth *auth.Auth_SDK) *Diagram_SDK {
	return &Diagram_SDK{
		Auth:  Auth,
		Users: users.Init(Auth, db),
		db:    db,
	}
}

func (d *Diagram_SDK) Create(idToken string) (string, error) {
	// Get the user id from the id token
	userId, err := d.Auth.GetUserIdFromToken(idToken)
	if err != nil {
		return "", err
	}

	diagramId := uuid.New().String()

	// Create a new diagram model
	diagram := models.DiagramModel{
		ID:      diagramId,
		Content: datatypes.JSON([]byte("{}")),
	}

	// Create a new user diagram model
	userDiagram := models.DiagramUserRoleModel{
		UserID:    userId,
		DiagramID: diagramId,
		Role:      "owner",
	}

	// Save the diagram and the user diagram to the database
	err = d.db.Transaction(func(tx *gorm.DB) error {
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

	return diagramId, nil
}

func (d *Diagram_SDK) Delete(diagramId, idToken string) error {
	// Get the user id from the id token
	userId, err := d.Auth.GetUserIdFromToken(idToken)
	if err != nil {
		return err
	}

	return d.db.Table("diagram_user_role_models").
		Select("diagram_user_role_models.diagram_id").
		Joins("JOIN diagram_models ON diagram_models.id = diagram_user_role_models.diagram_id").
		Where("diagram_user_role_models.user_id = ? AND diagram_user_role_models.diagram_id = ? AND diagram_user_role_models.role = ?", userId, diagramId, "owner").
		Delete(&models.DiagramUserRoleModel{}).Error
}

func (d *Diagram_SDK) Get(diagramId, idToken string) (*models.DiagramModel, error) {
	// Get the user id from the id token
	userId, err := d.Auth.GetUserIdFromToken(idToken)
	if err != nil {
		return nil, err
	}

	// Get the diagram from the database if the user has access to it or models.DiagramModel.public is true
	var diagram models.DiagramModel
	err = d.db.Transaction(func(tx *gorm.DB) error {
		err := tx.Where("id = ?", diagramId).First(&diagram).Error
		if err != nil {
			return err
		}

		if !diagram.Public {
			var userDiagram models.DiagramUserRoleModel

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

func (d *Diagram_SDK) Update(diagramId, idToken string, public *bool, name string, content *json.RawMessage) error {
	// Get the user id from the id token
	userId, err := d.Auth.GetUserIdFromToken(idToken)
	if err != nil {
		return err
	}

	// Update the diagram in the database if the user is the owner or editor
	err = d.db.Transaction(func(tx *gorm.DB) error {
		var userDiagram models.DiagramUserRoleModel

		err := tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error
		if err != nil {
			return err
		}

		if userDiagram.Role != "owner" && userDiagram.Role != "editor" {
			return errors.New("user is not the owner or editor of the diagram")
		}

		var diagram models.DiagramModel

		err = tx.Where("id = ?", diagramId).First(&diagram).Error
		if err != nil {
			return err
		}

		if content != nil {
			diagram.Content = datatypes.JSON(*content)
		}

		if public != nil {
			diagram.Public = *public
		}

		if name != "" {
			diagram.Name = name
		}

		return tx.Save(&diagram).Error
	})

	return err
}
