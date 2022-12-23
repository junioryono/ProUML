package diagrams

import (
	"github.com/junioryono/ProUML/backend/sdk/postgres/auth"
	"github.com/junioryono/ProUML/backend/sdk/types"
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

func (d *Diagrams_SDK) GetAllWithAccessRole(idToken string, offset int) ([]types.DiagramModelNoContent, error) {
	userId, err := d.Auth.GetUserIdFromToken(idToken)
	if err != nil {
		return nil, err
	}

	var diagrams []types.DiagramModelNoContent

	// Get all diagrams the user has access to (dont use public to query)
	err = d.db.Transaction(func(tx *gorm.DB) error {
		var userDiagrams []types.DiagramUserRoleModel

		err := tx.Where("user_id = ?", userId).Find(&userDiagrams).Error
		if err != nil {
			return err
		}

		for _, userDiagram := range userDiagrams {
			var diagram types.DiagramModelNoContent

			err := tx.Limit(10).Offset(offset).Model(&types.DiagramModel{}).Where("id = ?", userDiagram.DiagramID).First(&diagram).Find(&types.DiagramModelNoContent{}).Error
			if err != nil {
				return err
			}

			diagrams = append(diagrams, diagram)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return diagrams, nil
}
