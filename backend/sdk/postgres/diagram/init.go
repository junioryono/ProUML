package diagram

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/postgres/auth"
	"github.com/junioryono/ProUML/backend/sdk/postgres/diagram/users"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/types"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Diagram_SDK struct {
	Admin *admin_SDK
	Users *users.Users_SDK
	auth  *auth.Auth_SDK
	getDb func() *gorm.DB
}

func Init(getDb func() *gorm.DB, Auth *auth.Auth_SDK) *Diagram_SDK {
	return &Diagram_SDK{
		Admin: &admin_SDK{getDb: getDb},
		Users: users.Init(Auth, getDb),
		auth:  Auth,
		getDb: getDb,
	}
}

func (d *Diagram_SDK) Create(idToken, projectId string, diagramContent *[]any) (string, *types.WrappedError) {
	// Get the user id from the id token
	userId, err := d.auth.Client.GetUserId(idToken)
	if err != nil {
		return "", err
	}

	if projectId != "" {
		// Check if the user is a member of the project
		var projectUserRole models.ProjectUserRoleModel
		if err := d.getDb().Where("user_id = ? AND project_id = ?", userId, projectId).First(&projectUserRole).Error; err != nil {
			return "", types.Wrap(err, types.ErrInvalidRequest)
		}
	}

	// Create a new diagram model
	diagram := models.DiagramModel{
		ID:        uuid.New().String(),
		ProjectID: projectId,
	}

	if diagramContent != nil {
		diagram.Content = *diagramContent
	}

	// Create a new user diagram model
	userDiagram := models.DiagramUserRoleModel{
		UserID:    userId,
		DiagramID: diagram.ID,
		Role:      "owner",
	}

	tx := d.getDb().Begin()

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

	return diagram.ID, nil
}

func (d *Diagram_SDK) Delete(diagramId, idToken string) *types.WrappedError {
	// Get the user id from the id token
	userId, err := d.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	tx := d.getDb().Begin()

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

func (d *Diagram_SDK) Get(diagramId, idToken string) (*models.DiagramModel, string, *types.WrappedError) {
	var diagram models.DiagramModel
	var role string

	// Get the user id from the id token
	userId, err := d.auth.Client.GetUserId(idToken)
	if err != nil {
		return nil, "", err
	}

	// Get the diagram from the database if the user has access to it or models.DiagramModel.public is true
	if err := d.getDb().Preload("Project").Preload("Project.Diagrams").Where("id = ?", diagramId).First(&diagram).Error; err != nil {
		fmt.Printf("error getting diagram: %v\n", err)
		return nil, "", types.Wrap(err, types.ErrDiagramNotFound)
	}

	if err := d.getDb().Model(&models.DiagramUserRoleModel{}).Where("user_id = ? AND diagram_id = ?", userId, diagramId).Select("role").First(&role).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, "", types.Wrap(err, types.ErrInternalServerError)
		}
	}

	// Check public and roles. If the user is not the owner, editor, or viewer, check if the diagram is public. If it's public, set the role to viewer.
	if role != "owner" && role != "editor" && role != "viewer" {
		if diagram.Public {
			role = "viewer"
		} else {
			return nil, "", types.Wrap(errors.New("user does not have access to the diagram"), types.ErrInvalidRequest)
		}
	}

	if diagram.Project != nil && diagram.Project.ID == "default" {
		diagram.Project = nil
	}

	return &diagram, role, nil
}

func (d *Diagram_SDK) UpdatePublic(diagramId, idToken string, public bool) *types.WrappedError {
	// Get the user id from the id token
	userId, err := d.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Update the diagram in the database if the user is the owner or editor
	var userDiagram models.DiagramUserRoleModel
	if err := d.getDb().Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if userDiagram.Role != "owner" && userDiagram.Role != "editor" {
		return types.Wrap(errors.New("user is not the owner or editor of the diagram"), types.ErrInvalidRequest)
	}

	if err := d.getDb().Model(&models.DiagramModel{}).Where("id = ?", diagramId).Update("public", public).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (d *Diagram_SDK) UpdateName(diagramId, idToken string, name string) *types.WrappedError {
	if name == "" {
		return types.Wrap(errors.New("diagram name cannot be empty"), types.ErrInvalidRequest)
	}

	// Get the user id from the id token
	userId, err := d.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Update the diagram in the database if the user is the owner or editor
	var userDiagram models.DiagramUserRoleModel
	if err := d.getDb().Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if userDiagram.Role != "owner" && userDiagram.Role != "editor" {
		return types.Wrap(errors.New("user is not the owner or editor of the diagram"), types.ErrInvalidRequest)
	}

	if err := d.getDb().Model(&models.DiagramModel{}).Where("id = ?", diagramId).Update("name", name).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (d *Diagram_SDK) UpdateContent(diagramId, idToken string, cell map[string]interface{}, events []string) *types.WrappedError {
	// Get the user id from the id token
	userId, err := d.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Update the diagram in the database if the user is the owner or editor
	var userDiagram models.DiagramUserRoleModel
	if err := d.getDb().Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if userDiagram.Role != "owner" && userDiagram.Role != "editor" {
		return types.Wrap(errors.New("user is not the owner or editor of the diagram"), types.ErrInvalidRequest)
	}

	tx := d.getDb().Begin()

	var diagram models.DiagramModel
	if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("id = ?", diagramId).First(&diagram).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	cellId, ok := cell["id"].(string)
	if !ok || cellId == "" {
		return types.Wrap(errors.New("cell id not found"), types.ErrInvalidRequest)
	}

	switch {
	case sliceContains(events, "db_addCell"):
		diagram.Content = append(diagram.Content, cell)

	case sliceContains(events, "db_updateCell"):
		for i, existingCell := range diagram.Content {
			switch c := existingCell.(type) {
			case map[string]interface{}:
				if c["id"].(string) == cellId {
					diagram.Content[i] = cell
					break
				}
			}
		}

	case sliceContains(events, "db_removeCell"):
		for i, existingCell := range diagram.Content {
			switch c := existingCell.(type) {
			case map[string]interface{}:
				if c["id"].(string) == cellId {
					if i+1 < len(diagram.Content) {
						diagram.Content = append(diagram.Content[:i], diagram.Content[i+1:]...)
						break
					}

					diagram.Content = diagram.Content[:i]
					break
				}
			}
		}
	}

	if err := tx.Save(&diagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (d *Diagram_SDK) UpdateImage(diagramId, idToken string, image string) *types.WrappedError {
	// Get the user id from the id token
	userId, err := d.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Update the diagram in the database if the user is the owner or editor
	var userDiagram models.DiagramUserRoleModel
	if err := d.getDb().Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if userDiagram.Role != "owner" && userDiagram.Role != "editor" {
		return types.Wrap(errors.New("user is not the owner or editor of the diagram"), types.ErrInvalidRequest)
	}

	if err := d.getDb().Model(&models.DiagramModel{}).Where("id = ?", diagramId).Update("image", image).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (d *Diagram_SDK) UpdateBackgroundColor(diagramId, idToken string, backgroundColor string) *types.WrappedError {
	// Get the user id from the id token
	userId, err := d.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Update the diagram in the database if the user is the owner or editor
	var userDiagram models.DiagramUserRoleModel
	if err := d.getDb().Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if userDiagram.Role != "owner" && userDiagram.Role != "editor" {
		return types.Wrap(errors.New("user is not the owner or editor of the diagram"), types.ErrInvalidRequest)
	}

	if err := d.getDb().Model(&models.DiagramModel{}).Where("id = ?", diagramId).Update("background_color", backgroundColor).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (d *Diagram_SDK) UpdateShowGrid(diagramId, idToken string, showGrid bool) *types.WrappedError {
	// Get the user id from the id token
	userId, err := d.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Update the diagram in the database if the user is the owner or editor
	var userDiagram models.DiagramUserRoleModel
	if err := d.getDb().Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if userDiagram.Role != "owner" && userDiagram.Role != "editor" {
		return types.Wrap(errors.New("user is not the owner or editor of the diagram"), types.ErrInvalidRequest)
	}

	if err := d.getDb().Model(&models.DiagramModel{}).Where("id = ?", diagramId).Update("show_grid", showGrid).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func sliceContains(slice []string, contains string) bool {
	for _, value := range slice {
		if value == contains {
			return true
		}
	}
	return false
}
