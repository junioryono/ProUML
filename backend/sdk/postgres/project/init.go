package project

import (
	"errors"

	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/postgres/auth"
	"github.com/junioryono/ProUML/backend/sdk/postgres/diagram/users"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/sdk/postgres/project/diagram"
	"github.com/junioryono/ProUML/backend/types"
	"gorm.io/gorm"
)

type Project_SDK struct {
	Diagram *diagram.Diagram_SDK
	Users   *users.Users_SDK
	auth    *auth.Auth_SDK
	getDb   func() *gorm.DB
}

func Init(getDb func() *gorm.DB, Auth *auth.Auth_SDK) *Project_SDK {
	return &Project_SDK{
		Diagram: diagram.Init(getDb, Auth),
		Users:   users.Init(Auth, getDb),
		auth:    Auth,
		getDb:   getDb,
	}
}

func (p *Project_SDK) Create(idToken, name string) (string, *types.WrappedError) {
	// Get the user id from the id token
	userId, err := p.auth.Client.GetUserId(idToken)
	if err != nil {
		return "", err
	}

	projectId := uuid.New().String()

	// Create a new project model
	project := models.ProjectModel{
		ID: projectId,
	}

	if name != "" {
		project.Name = name
	}

	// Create a new user project model
	userProject := models.ProjectUserRoleModel{
		UserID:    userId,
		ProjectID: projectId,
		Owner:     true,
	}

	tx := p.getDb().Begin()

	// Save the project and the user project to the database
	if err := tx.Create(&project).Error; err != nil {
		tx.Rollback()
		return "", types.Wrap(err, types.ErrInternalServerError)
	}

	if err := tx.Create(&userProject).Error; err != nil {
		tx.Rollback()
		return "", types.Wrap(err, types.ErrInternalServerError)
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return "", types.Wrap(err, types.ErrInternalServerError)
	}

	return projectId, nil
}

func (p *Project_SDK) Delete(projectId, idToken string) *types.WrappedError {
	if projectId == "default" {
		return types.Wrap(errors.New("cannot delete the default project"), types.ErrInvalidRequest)
	}

	// Get the user id from the id token
	userId, err := p.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	tx := p.getDb().Begin()

	// Delete the project, diagram, and diagram user role models in the database if the current user is the owner
	var userProject models.ProjectUserRoleModel

	if err := tx.Where("user_id = ? AND project_id = ?", userId, projectId).First(&userProject).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if !userProject.Owner {
		tx.Rollback()
		return types.Wrap(errors.New("user is not the owner of the project"), types.ErrInvalidRequest)
	}

	// First, delete the diagram user role models
	if err := tx.Table("diagram_user_role_models").
		Where("diagram_user_role_models.diagram_id IN (SELECT id FROM diagram_models WHERE project_id = ?)", projectId).
		Delete(&models.DiagramUserRoleModel{}).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Second, delete the diagram models
	if err := tx.Table("diagram_models").
		Where("diagram_models.project_id = ?", projectId).
		Delete(&models.DiagramModel{}).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Third, delete the project user role models
	if err := tx.Table("project_user_role_models").
		Where("project_user_role_models.project_id = ?", projectId).
		Delete(&models.ProjectUserRoleModel{}).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Finally, delete the project models
	if err := tx.Table("project_models").
		Where("project_models.id = ?", projectId).
		Delete(&models.ProjectModel{}).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (p *Project_SDK) Get(projectId, idToken string) (*models.ProjectModelWithDiagrams, *types.WrappedError) {
	if projectId == "default" {
		return nil, types.Wrap(errors.New("cannot get the default project"), types.ErrInvalidRequest)
	}

	// Get the user id from the id token
	userId, err := p.auth.Client.GetUserId(idToken)
	if err != nil {
		return nil, err
	}

	// Get the project model from the database
	var project models.ProjectModel
	if err := p.getDb().
		Model(&models.ProjectModel{}).
		// Preload the diagrams
		Preload("Diagrams", func(db *gorm.DB) *gorm.DB {
			return db.
				// Only select the id, created_at, updated_at, public, name, image, and project_id of the diagram
				Select("id, created_at, updated_at, public, name, image, project_id").
				// Order the diagrams by updated_at
				Order("diagram_models.updated_at DESC")
		}).
		// Only select the id, created_at, updated_at, and name of the project
		Select("id, created_at, updated_at, name").
		// Make sure the user has a role in the project
		Where("id = ? AND EXISTS (SELECT 1 FROM project_user_role_models WHERE project_user_role_models.project_id = ? AND project_user_role_models.user_id = ?)", projectId, projectId, userId).
		First(&project).Error; err != nil {
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	var response models.ProjectModelWithDiagrams
	response.ID = project.ID
	response.CreatedAt = project.CreatedAt
	response.UpdatedAt = project.UpdatedAt
	response.Name = project.Name
	for _, diagram := range project.Diagrams {
		var responseDiagram models.DiagramModelHiddenContent
		responseDiagram.ID = diagram.ID
		responseDiagram.CreatedAt = diagram.CreatedAt
		responseDiagram.UpdatedAt = diagram.UpdatedAt
		responseDiagram.Public = diagram.Public
		responseDiagram.Name = diagram.Name
		responseDiagram.Image = diagram.Image
		response.Diagrams = append(response.Diagrams, responseDiagram)
	}

	return &response, nil
}

func (p *Project_SDK) UpdateName(projectId, idToken, name string) *types.WrappedError {
	if projectId == "default" {
		return types.Wrap(errors.New("cannot update the default project"), types.ErrInvalidRequest)
	}

	if projectId == "" {
		return types.Wrap(errors.New("project id is empty"), types.ErrInvalidRequest)
	}

	if name == "" {
		return types.Wrap(errors.New("name is empty"), types.ErrInvalidRequest)
	}

	// Get the user id from the id token
	userId, err := p.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Update the project name in the database if the user is the owner
	var userProject models.ProjectUserRoleModel

	if err := p.getDb().Where("user_id = ? AND project_id = ?", userId, projectId).First(&userProject).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if !userProject.Owner {
		return types.Wrap(errors.New("user is not the owner of the project"), types.ErrInvalidRequest)
	}

	if err := p.getDb().Model(&models.ProjectModel{}).Where("id = ?", projectId).Update("name", name).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}
