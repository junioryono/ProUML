package project

import (
	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/postgres/auth"
	"github.com/junioryono/ProUML/backend/sdk/postgres/diagram/users"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/types"
	"gorm.io/gorm"
)

type Project_SDK struct {
	Users *users.Users_SDK
	auth  *auth.Auth_SDK
	db    *gorm.DB
}

func Init(db *gorm.DB, Auth *auth.Auth_SDK) *Project_SDK {
	return &Project_SDK{
		Users: users.Init(Auth, db),
		auth:  Auth,
		db:    db,
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

func (p *Project_SDK) Get(projectId, idToken string) (*models.ProjectModel, *types.WrappedError) {
	// Get the user id from the id token
	userId, err := p.auth.Client.GetUserId(idToken)
	if err != nil {
		return nil, err
	}

	// Get the project from the database if the user has access to it or models.ProjectModel.public is true
	var project models.ProjectModel
	if err := p.db.Where("id = ?", projectId).First(&project).Error; err != nil {
		return nil, types.Wrap(err, types.ErrProjectNotFound)
	}

	if !project.Public {
		var userProject models.ProjectUserRoleModel

		if err := p.db.Where("user_id = ? AND project_id = ?", userId, projectId).First(&userProject).Error; err != nil {
			return nil, types.Wrap(err, types.ErrProjectNotFound)
		}
	}

	return &project, nil
}
