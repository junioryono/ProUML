package diagram

import (
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/postgres/auth"
	"github.com/junioryono/ProUML/backend/sdk/postgres/diagram/users"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/types"
	"gorm.io/gorm"
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

	diagramId := uuid.New().String()

	// Create the diagram
	diagram := models.DiagramModel{
		ID:        uuid.New().String(),
		ProjectID: projectId,
		UserRoles: []models.DiagramUserRoleModel{
			{
				UserID:    userId,
				DiagramID: diagramId,
				Role:      "owner",
			},
		},
	}

	// Set the diagram content if it is not nil
	if diagramContent != nil {
		diagramContentJson, err := json.Marshal(*diagramContent)
		if err != nil {
			return "", types.Wrap(err, types.ErrInternalServerError)
		}

		diagram.Content = diagramContentJson
	}

	db := d.getDb()

	// If projectId is not empty, check if the user is a member of the project
	if projectId != "" {
		var projectUserRole models.ProjectUserRoleModel
		if err := db.Where("user_id = ? AND project_id = ?", userId, projectId).First(&projectUserRole).Error; err != nil {
			return "", types.Wrap(err, types.ErrInvalidRequest)
		}
	}

	// Save the diagram to the database
	if err := db.Create(&diagram).Error; err != nil {
		return "", types.Wrap(err, types.ErrInternalServerError)
	}

	return diagram.ID, nil
}

func (d *Diagram_SDK) Duplicate(idToken, projectId, duplicateDiagramId string) (string, *types.WrappedError) {
	// Get the user id from the id token
	userId, err := d.auth.Client.GetUserId(idToken)
	if err != nil {
		return "", err
	}

	// Check if the user is a member of the project, if projectId is provided
	if projectId != "" {
		var projectUserRole models.ProjectUserRoleModel
		if err := d.getDb().Where("user_id = ? AND project_id = ?", userId, projectId).First(&projectUserRole).Error; err != nil {
			return "", types.Wrap(err, types.ErrInvalidRequest)
		}
	}

	// Get the diagram to duplicate
	var duplicateDiagram models.DiagramModel
	if err := d.getDb().Where("id = ?", duplicateDiagramId).First(&duplicateDiagram).Error; err != nil {
		return "", types.Wrap(err, types.ErrDiagramNotFound)
	}

	diagramId := uuid.New().String()

	// Create the diagram
	diagram := models.DiagramModel{
		ID:              uuid.New().String(),
		Name:            duplicateDiagram.Name + " (copy)",
		Image:           duplicateDiagram.Image,
		Content:         duplicateDiagram.Content,
		BackgroundColor: duplicateDiagram.BackgroundColor,
		ShowGrid:        duplicateDiagram.ShowGrid,
		ProjectID:       projectId,
		UserRoles: []models.DiagramUserRoleModel{
			{
				UserID:    userId,
				DiagramID: diagramId,
				Role:      "owner",
			},
		},
	}

	// Save the diagram and the user diagram to the database
	if err := d.getDb().Create(&diagram).Error; err != nil {
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

	// Start a database transaction
	tx := d.getDb().Begin()

	// Check if the user is the owner of the diagram
	var userDiagram models.DiagramUserRoleModel
	if err := tx.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if userDiagram.Role != "owner" {
		tx.Rollback()
		return types.Wrap(errors.New("user is not the owner of the diagram"), types.ErrInvalidRequest)
	}

	// Delete the diagram's user roles and the diagram itself
	if err := tx.Where("diagram_id = ?", diagramId).Delete(&models.DiagramUserRoleModel{}).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if err := tx.Delete(&models.DiagramModel{ID: diagramId}).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Commit the transaction
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
	if err := d.getDb().
		Preload("UserRoles").
		Preload("Project", func(db *gorm.DB) *gorm.DB {
			// Preload the project if the user has a role in the project
			return db.Where("id IN (SELECT project_id FROM project_user_role_models WHERE user_id = ?)", userId).
				Preload("Diagrams").
				Select("id, name")
		}).
		Where("id = ?", diagramId).
		First(&diagram).Error; err != nil {
		return nil, "", types.Wrap(err, types.ErrDiagramNotFound)
	}

	// Get the user's role in the diagram
	for _, userDiagram := range diagram.UserRoles {
		if userDiagram.UserID == userId {
			role = userDiagram.Role
			break
		}
	}

	if role == "" {
		return nil, "", types.Wrap(errors.New("user does not have access to the diagram"), types.ErrInvalidRequest)
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

	hasPermission, err := d.UserHasDiagramEdittingPermissions(diagramId, userId)
	if err != nil {
		return err
	}

	if !hasPermission {
		return types.Wrap(errors.New("user does not have permission to edit the diagram"), types.ErrInvalidRequest)
	}

	// Update the diagram in the database
	if err := d.getDb().Model(&models.DiagramModel{}).
		Where("id = ?", diagramId).
		Update("public", public).Error; err != nil {
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

	hasPermission, err := d.UserHasDiagramEdittingPermissions(diagramId, userId)
	if err != nil {
		return err
	}

	if !hasPermission {
		return types.Wrap(errors.New("user does not have permission to edit the diagram"), types.ErrInvalidRequest)
	}

	// Update the diagram in the database
	if err := d.getDb().Model(&models.DiagramModel{}).
		Where("id = ?", diagramId).
		Update("name", name).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (d *Diagram_SDK) UpdateContentAddCell(diagramId, idToken string, cell map[string]interface{}) *types.WrappedError {
	// Get the user id from the id token
	userId, err := d.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	hasPermission, err := d.UserHasDiagramEdittingPermissions(diagramId, userId)
	if err != nil {
		return err
	}

	if !hasPermission {
		return types.Wrap(errors.New("user does not have permission to edit the diagram"), types.ErrInvalidRequest)
	}

	if err := d.getDb().Exec("SELECT add_cell_to_diagram(?, ?::jsonb);", diagramId, cell).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (d *Diagram_SDK) UpdateContentUpdateCell(diagramId, idToken string, cell map[string]interface{}) *types.WrappedError {
	// Get the user id from the id token
	userId, err := d.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	hasPermission, err := d.UserHasDiagramEdittingPermissions(diagramId, userId)
	if err != nil {
		return err
	}

	if !hasPermission {
		return types.Wrap(errors.New("user does not have permission to edit the diagram"), types.ErrInvalidRequest)
	}

	cellId, ok := cell["id"].(string)
	if !ok || cellId == "" {
		return types.Wrap(errors.New("cell id not found"), types.ErrInvalidRequest)
	}

	if err := d.getDb().Exec("SELECT update_cell_in_diagram(?, ?, ?::jsonb);", diagramId, cellId, cell).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (d *Diagram_SDK) UpdateContentRemoveCell(diagramId, idToken string, cell map[string]interface{}) *types.WrappedError {
	// Get the user id from the id token
	userId, err := d.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	hasPermission, err := d.UserHasDiagramEdittingPermissions(diagramId, userId)
	if err != nil {
		return err
	}

	if !hasPermission {
		return types.Wrap(errors.New("user does not have permission to edit the diagram"), types.ErrInvalidRequest)
	}

	cellId, ok := cell["id"].(string)
	if !ok || cellId == "" {
		return types.Wrap(errors.New("cell id not found"), types.ErrInvalidRequest)
	}

	if err := d.getDb().Exec("SELECT remove_cell_from_diagram(?, ?);", diagramId, cellId).Error; err != nil {
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

	hasPermission, err := d.UserHasDiagramEdittingPermissions(diagramId, userId)
	if err != nil {
		return err
	}

	if !hasPermission {
		return types.Wrap(errors.New("user does not have permission to edit the diagram"), types.ErrInvalidRequest)
	}

	if err := d.getDb().
		Model(&models.DiagramModel{}).
		Where("id = ?", diagramId).
		Update("image", image).Error; err != nil {
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

	hasPermission, err := d.UserHasDiagramEdittingPermissions(diagramId, userId)
	if err != nil {
		return err
	}

	if !hasPermission {
		return types.Wrap(errors.New("user does not have permission to edit the diagram"), types.ErrInvalidRequest)
	}

	if err := d.getDb().
		Model(&models.DiagramModel{}).
		Where("id = ?", diagramId).
		Update("background_color", backgroundColor).Error; err != nil {
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

	hasPermission, err := d.UserHasDiagramEdittingPermissions(diagramId, userId)
	if err != nil {
		return err
	}

	if !hasPermission {
		return types.Wrap(errors.New("user does not have permission to edit the diagram"), types.ErrInvalidRequest)
	}

	if err := d.getDb().
		Model(&models.DiagramModel{}).
		Where("id = ?", diagramId).
		Update("show_grid", showGrid).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (d *Diagram_SDK) UpdateAllowEditorPermissions(diagramId, idToken string, allowEditorPermissions bool) *types.WrappedError {
	// Get the user id from the id token
	userId, err := d.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Update the diagram in the database if the user is the owner
	var role string
	if err := d.getDb().
		Model(&models.DiagramUserRoleModel{}).
		Where("diagram_id = ? AND user_id = ?", diagramId, userId).
		Pluck("role", &role).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if role != "owner" {
		return types.Wrap(errors.New("user is not the owner of the diagram"), types.ErrInvalidRequest)
	}

	if err := d.getDb().
		Model(&models.DiagramModel{}).
		Where("id = ?", diagramId).
		Update("allow_editor_permissions", allowEditorPermissions).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (d *Diagram_SDK) UserHasDiagramEdittingPermissions(diagramId, userId string) (bool, *types.WrappedError) {
	type Result struct {
		Role                   sql.NullString
		AllowEditorPermissions bool
		IsInProject            bool
	}

	var result Result
	err := d.getDb().
		Raw(`(
			SELECT
				diagram_user_role_models.role,
				diagram_models.allow_editor_permissions,
				false as is_in_project
			FROM diagram_user_role_models
			JOIN diagram_models ON diagram_models.id = diagram_user_role_models.diagram_id
			WHERE diagram_user_role_models.diagram_id = ? AND diagram_user_role_models.user_id = ?
		) UNION (
			SELECT
				NULL as role,
				diagram_models.allow_editor_permissions,
				true as is_in_project
			FROM project_user_role_models
			JOIN diagram_models ON diagram_models.project_id = project_user_role_models.project_id
			WHERE diagram_models.id = ? AND project_user_role_models.user_id = ?
		)`, diagramId, userId, diagramId, userId).Scan(&result).Error

	if err != nil && err != gorm.ErrRecordNotFound {
		return false, types.Wrap(err, types.ErrInternalServerError)
	}

	if err == gorm.ErrRecordNotFound {
		return false, nil
	}

	if result.Role.Valid {
		if result.Role.String == "owner" || (result.Role.String == "editor" && result.AllowEditorPermissions) {
			return true, nil
		}
	} else if result.IsInProject {
		return true, nil
	}

	return false, nil
}
