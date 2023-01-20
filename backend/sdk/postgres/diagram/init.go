package diagram

import (
	"errors"

	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/postgres/auth"
	"github.com/junioryono/ProUML/backend/sdk/postgres/diagram/users"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/types"
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

func (d *Diagram_SDK) Create(idToken string, diagramContent *[]any) (string, *types.WrappedError) {
	// Get the user id from the id token
	userId, err := d.Auth.Client.GetUserId(idToken)
	if err != nil {
		return "", err
	}

	diagramId := uuid.New().String()

	// Create a new diagram model
	diagram := models.DiagramModel{
		ID: diagramId,
	}

	if diagramContent != nil {
		diagram.Content = *diagramContent
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
	userId, err := d.Auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	tx := d.db.Begin()

	// Delete the diagram in the database if the user is the owner
	var userDiagram models.DiagramUserRoleModel

	if err := tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if userDiagram.Role != "owner" {
		tx.Rollback()
		return types.Wrap(errors.New("user is not the owner of the diagram"), types.ErrInvalidRequest)
	}

	if err := tx.Where("diagram_id = ?", diagramId).Delete(&models.DiagramUserRoleModel{}).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if err := tx.Where("id = ?", diagramId).Delete(&models.DiagramModel{}).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (d *Diagram_SDK) Get(diagramId, idToken string) (*models.DiagramModel, *types.WrappedError) {
	// Get the user id from the id token
	userId, err := d.Auth.Client.GetUserId(idToken)
	if err != nil {
		return nil, err
	}

	// Get the diagram from the database if the user has access to it or models.DiagramModel.public is true
	var diagram models.DiagramModel
	if err := d.db.Where("id = ?", diagramId).First(&diagram).Error; err != nil {
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	if !diagram.Public {
		var userDiagram models.DiagramUserRoleModel

		if err := d.db.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error; err != nil {
			return nil, types.Wrap(err, types.ErrInternalServerError)
		}

		if userDiagram.Role != "owner" && userDiagram.Role != "editor" && userDiagram.Role != "viewer" {
			return nil, types.Wrap(errors.New("user does not have access to diagram"), types.ErrInvalidRequest)
		}
	}

	return &diagram, nil
}

func (d *Diagram_SDK) UpdatePublic(diagramId, idToken string, public bool) *types.WrappedError {
	// Get the user id from the id token
	userId, err := d.Auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Update the diagram in the database if the user is the owner or editor
	var userDiagram models.DiagramUserRoleModel
	if err := d.db.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if userDiagram.Role != "owner" && userDiagram.Role != "editor" {
		return types.Wrap(errors.New("user is not the owner or editor of the diagram"), types.ErrInvalidRequest)
	}

	var diagram models.DiagramModel
	if err := d.db.Where("id = ?", diagramId).First(&diagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	diagram.Public = public

	if err := d.db.Save(&diagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (d *Diagram_SDK) UpdateName(diagramId, idToken string, name string) *types.WrappedError {
	// Get the user id from the id token
	userId, err := d.Auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Update the diagram in the database if the user is the owner or editor
	var userDiagram models.DiagramUserRoleModel
	if err := d.db.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if userDiagram.Role != "owner" && userDiagram.Role != "editor" {
		return types.Wrap(errors.New("user is not the owner or editor of the diagram"), types.ErrInvalidRequest)
	}

	var diagram models.DiagramModel
	if err := d.db.Where("id = ?", diagramId).First(&diagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if name == "" {
		return types.Wrap(errors.New("diagram name cannot be empty"), types.ErrInvalidRequest)
	}

	diagram.Name = name

	if err := d.db.Save(&diagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (d *Diagram_SDK) UpdateContent(diagramId, idToken string, content models.DiagramContentUpdate, events []string) *types.WrappedError {
	// Get the user id from the id token
	userId, err := d.Auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Update the diagram in the database if the user is the owner or editor
	var userDiagram models.DiagramUserRoleModel
	if err := d.db.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if userDiagram.Role != "owner" && userDiagram.Role != "editor" {
		return types.Wrap(errors.New("user is not the owner or editor of the diagram"), types.ErrInvalidRequest)
	}

	var diagram models.DiagramModel
	if err := d.db.Where("id = ?", diagramId).First(&diagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	var cellId string
	switch c := content.Cell.(type) {
	case map[string]interface{}:
		var ok bool
		cellId, ok = c["id"].(string)
		if !ok {
			return types.Wrap(errors.New("cell id not found"), types.ErrInvalidRequest)
		}
	default:
		return types.Wrap(errors.New("cell type not supported"), types.ErrInvalidRequest)
	}

	switch {
	case stringContains(events, "db_addCell"):
		diagram.Content = append(diagram.Content, content.Cell)
	case stringContains(events, "db_updateCell"):
		for i, cell := range diagram.Content {
			switch c := cell.(type) {
			case map[string]interface{}:
				cellId2 := c["id"].(string)
				if cellId2 == cellId {
					diagram.Content[i] = content.Cell
				}
			}
		}
	case stringContains(events, "db_removeCell"):
		for i, cell := range diagram.Content {
			switch c := cell.(type) {
			case map[string]interface{}:
				cellId2 := c["id"].(string)
				if cellId2 == cellId {
					diagram.Content = append(diagram.Content[:i], diagram.Content[i+1:]...)
				}
			}
		}
	}

	if err := d.db.Save(&diagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func stringContains(slice []string, contains string) bool {
	for _, value := range slice {
		if value == contains {
			return true
		}
	}
	return false
}
