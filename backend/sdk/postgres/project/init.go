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
	db      *gorm.DB
}

func Init(db *gorm.DB, Auth *auth.Auth_SDK) *Project_SDK {
	return &Project_SDK{
		Diagram: diagram.Init(db, Auth),
		Users:   users.Init(Auth, db),
		auth:    Auth,
		db:      db,
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

	tx := p.db.Begin()

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

	tx := p.db.Begin()

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

	// Use Joins to delete
	// project_models has id
	// diagram_models has project_id as a foreign key
	// diagram_user_role_models has diagram_id as a foreign key
	// Delete the project_user_role_models, then diagram_models, then project_models
	if err := tx.Table("project_user_role_models").
		Joins("INNER JOIN diagram_models ON project_user_role_models.project_id = diagram_models.project_id").
		Joins("INNER JOIN diagram_user_role_models ON diagram_models.id = diagram_user_role_models.diagram_id").
		Where("project_user_role_models.project_id = ?", projectId).
		Delete(&models.DiagramUserRoleModel{}).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if err := tx.Table("project_user_role_models").
		Joins("INNER JOIN diagram_models ON project_user_role_models.project_id = diagram_models.project_id").
		Where("project_user_role_models.project_id = ?", projectId).
		Delete(&models.DiagramModel{}).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if err := tx.Table("project_user_role_models").
		Where("project_user_role_models.project_id = ?", projectId).
		Delete(&models.ProjectUserRoleModel{}).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

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

	// Get the project user role model from the database
	var userProject models.ProjectUserRoleModel

	if err := p.db.Where("user_id = ? AND project_id = ?", userId, projectId).First(&userProject).Error; err != nil {
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	// Get the project model from the database
	var project models.ProjectModelWithDiagrams
	if err := p.db.Model(&models.ProjectModel{}).Select("id, created_at, updated_at, name").Where("id = ?", projectId).First(&project).Error; err != nil {
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	// Get the diagram models from the database
	if err := p.db.Model(&models.DiagramModel{}).
		Select("id, created_at, updated_at, name").
		Where("project_id = ?", projectId).
		Order("diagram_models.updated_at DESC").
		Find(&project.Diagrams).Error; err != nil {
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	return &project, nil
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

	if err := p.db.Where("user_id = ? AND project_id = ?", userId, projectId).First(&userProject).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if !userProject.Owner {
		return types.Wrap(errors.New("user is not the owner of the project"), types.ErrInvalidRequest)
	}

	if err := p.db.Model(&models.ProjectModel{}).Where("id = ?", projectId).Update("name", name).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}
