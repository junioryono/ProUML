package diagrams

import (
	"github.com/junioryono/ProUML/backend/sdk/postgres/auth"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/types"
	"gorm.io/gorm"
)

type Diagrams_SDK struct {
	Auth *auth.Auth_SDK
	db   *gorm.DB
}

func Init(db *gorm.DB, Auth *auth.Auth_SDK) *Diagrams_SDK {
	return &Diagrams_SDK{
		Auth: Auth,
		db:   db,
	}
}

func (d *Diagrams_SDK) GetAllWithAccessRole(idToken string, offset int) ([]models.DiagramModelHiddenContent, *types.WrappedError) {
	userId, err := d.Auth.Client.GetUserId(idToken)
	if err != nil {
		return nil, err
	}

	var diagrams []models.DiagramModelHiddenContent
	if err := d.db.
		Offset(offset).
		Model(&models.DiagramModel{}).
		Select("id, created_at, updated_at, public, name").
		Joins("JOIN diagram_user_role_models ON diagram_user_role_models.diagram_id = diagram_models.id").
		Where("diagram_user_role_models.user_id = ?", userId).
		Order("diagram_models.updated_at DESC").
		Limit(15).
		Find(&diagrams).Error; err != nil {
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	return diagrams, nil
}
