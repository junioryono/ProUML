package teams

import (
	"github.com/junioryono/ProUML/backend/sdk/postgres/auth"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/types"
	"gorm.io/gorm"
)

type Teams_SDK struct {
	Auth *auth.Auth_SDK
	db   *gorm.DB
}

func Init(db *gorm.DB, Auth *auth.Auth_SDK) *Teams_SDK {
	return &Teams_SDK{
		Auth: Auth,
		db:   db,
	}
}

func (t *Teams_SDK) GetAllWithAccessRole(idToken string, offset int) ([]models.TeamModel, *types.WrappedError) {
	userId, err := t.Auth.Client.GetUserId(idToken)
	if err != nil {
		return nil, err
	}

	var teams []models.TeamModel
	if err := t.db.
		Offset(offset).
		Model(&models.TeamModel{}).
		Select("id, created_at, updated_at, public, name").
		Joins("JOIN team_user_role_models ON team_user_role_models.project_id = project_models.id").
		Where("team_user_role_models.user_id = ?", userId).
		Order("project_models.updated_at DESC").
		Limit(15).
		Find(&teams).Error; err != nil {
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	return teams, nil
}
