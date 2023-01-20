package diagrams

import (
	"fmt"
	"sort"

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

	// Get all diagrams the user has access to
	var userDiagrams []models.DiagramUserRoleModel
	if err := d.db.Where("user_id = ?", userId).Find(&userDiagrams).Error; err != nil {
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	var diagrams []models.DiagramModelHiddenContent
	for i, userDiagram := range userDiagrams {
		if i >= 10 {
			break
		}

		var diagram models.DiagramModelHiddenContent

		if err := d.db.
			Offset(offset).
			Model(&models.DiagramModel{}).
			Where("id = ?", userDiagram.DiagramID).
			First(&diagram).Error; err != nil {
			return nil, types.Wrap(err, types.ErrInternalServerError)
		}

		// Print the diagram's updated at
		fmt.Println(diagram.UpdatedAt.String())

		diagrams = append(diagrams, diagram)
	}

	// Sort the diagrams by updated at
	sort.Slice(diagrams, func(i, j int) bool {
		return diagrams[i].UpdatedAt.After(diagrams[j].UpdatedAt)
	})

	return diagrams, nil
}
