package diagrams

import (
	"errors"

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
	userId, err := d.Auth.GetUserIdFromToken(idToken)
	if err != nil {
		return nil, err
	}

	tx := d.db.Begin()

	// Get all diagrams the user has access to
	var userDiagrams []models.DiagramUserRoleModel
	if err := tx.Where("user_id = ?", userId).Find(&userDiagrams).Error; err != nil {
		tx.Rollback()
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	var diagrams []models.DiagramModelHiddenContent
	for _, userDiagram := range userDiagrams {
		var diagram models.DiagramModelHiddenContent

		if err := tx.Limit(10).
			Offset(offset).
			Model(&models.DiagramModel{}).
			Where("id = ?", userDiagram.DiagramID).
			First(&diagram).
			Find(&models.DiagramModelHiddenContent{}).Error; err != nil {
			tx.Rollback()
			return nil, types.Wrap(err, types.ErrInternalServerError)
		}

		diagrams = append(diagrams, diagram)
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	if len(diagrams) == 0 {
		return nil, types.Wrap(errors.New("no diagrams found"), types.ErrNoDiagramsFound)
	}

	return diagrams, nil
}
