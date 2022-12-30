package diagram

import (
	"encoding/json"
	"errors"

	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/postgres/auth"
	"github.com/junioryono/ProUML/backend/sdk/postgres/diagram/users"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/types"
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

func (d *Diagram_SDK) Create(idToken string) (string, *types.WrappedError) {
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

	tx := d.db.Begin()

	// Save the diagram and the user diagram to the database
	if err := tx.Create(&diagram).Error; err != nil {
		tx.Rollback()
		return "", types.Wrap(err, types.ErrInternalServerError)
	}

	if err := tx.Create(&userDiagram).Error; err != nil {
		tx.Rollback()
		return "", types.Wrap(err, types.ErrInternalServerError)
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return "", types.Wrap(err, types.ErrInternalServerError)
	}

	return diagramId, nil
}

func (d *Diagram_SDK) Delete(diagramId, idToken string) *types.WrappedError {
	// Get the user id from the id token
	userId, err := d.Auth.GetUserIdFromToken(idToken)
	if err != nil {
		return err
	}

	// Delete the diagram in the database if the user is the owner
	err2 := d.db.Transaction(func(tx *gorm.DB) error {
		var userDiagram models.DiagramUserRoleModel

		err := tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error
		if err != nil {
			return err
		}

		if userDiagram.Role != "owner" {
			return errors.New("user is not the owner of the diagram")
		}

		err = tx.Where("diagram_id = ?", diagramId).Delete(&models.DiagramUserRoleModel{}).Error
		if err != nil {
			return err
		}

		return tx.Where("id = ?", diagramId).Delete(&models.DiagramModel{}).Error
	})

	if err2 != nil {
		return types.Wrap(err2, types.ErrInternalServerError)
	}

	return nil
}

func (d *Diagram_SDK) Get(diagramId, idToken string) (*models.DiagramModel, *types.WrappedError) {
	// Get the user id from the id token
	userId, err := d.Auth.GetUserIdFromToken(idToken)
	if err != nil {
		return nil, err
	}

	// Get the diagram from the database if the user has access to it or models.DiagramModel.public is true
	var diagram models.DiagramModel
	err2 := d.db.Transaction(func(tx *gorm.DB) error {
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

	if err2 != nil {
		return nil, types.Wrap(err2, types.ErrInternalServerError)
	}

	return &diagram, nil
}

func (d *Diagram_SDK) Update(diagramId, idToken string, public *bool, name string, content *json.RawMessage) *types.WrappedError {
	// Get the user id from the id token
	userId, err := d.Auth.GetUserIdFromToken(idToken)
	if err != nil {
		return err
	}

	// Update the diagram in the database if the user is the owner or editor
	err2 := d.db.Transaction(func(tx *gorm.DB) error {
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

	if err2 != nil {
		return types.Wrap(err2, types.ErrInternalServerError)
	}

	return nil
}
