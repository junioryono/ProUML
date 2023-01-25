package projects

import (
	"github.com/junioryono/ProUML/backend/sdk/postgres/auth"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/types"
	"gorm.io/gorm"
)

type Projects_SDK struct {
	Auth *auth.Auth_SDK
	db   *gorm.DB
}

func Init(db *gorm.DB, Auth *auth.Auth_SDK) *Projects_SDK {
	return &Projects_SDK{
		Auth: Auth,
		db:   db,
	}
}

func (p *Projects_SDK) GetAllWithAccessRole(idToken string, offset int) ([]models.ProjectModel, *types.WrappedError) {
	userId, err := p.Auth.Client.GetUserId(idToken)
	if err != nil {
		return nil, err
	}

	var projects []models.ProjectModel
	if err := p.db.
		Offset(offset).
		Model(&models.ProjectModel{}).
		Select("id, created_at, updated_at, public, name").
		Joins("JOIN project_user_role_models ON project_user_role_models.project_id = project_models.id").
		Where("project_user_role_models.user_id = ?", userId).
		Order("project_models.updated_at DESC").
		Limit(15).
		Find(&projects).Error; err != nil {
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	return projects, nil
}
