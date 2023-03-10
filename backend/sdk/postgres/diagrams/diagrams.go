package diagrams

import (
	"github.com/junioryono/ProUML/backend/sdk/postgres/auth"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/types"
	"gorm.io/gorm"
)

type Diagrams_SDK struct {
	Auth  *auth.Auth_SDK
	getDb func() *gorm.DB
}

func Init(getDb func() *gorm.DB, Auth *auth.Auth_SDK) *Diagrams_SDK {
	return &Diagrams_SDK{
		Auth:  Auth,
		getDb: getDb,
	}
}

func (d *Diagrams_SDK) GetDashboard(idToken string, offset int) ([]models.DiagramModelHiddenContent, *types.WrappedError) {
	userId, err := d.Auth.Client.GetUserId(idToken)
	if err != nil {
		return nil, err
	}

	var diagrams []models.DiagramModel
	if err := d.getDb().
		Offset(offset).
		Model(&models.DiagramModel{}).
		// Select only the needed fields
		Select("diagram_models.id, diagram_models.created_at, diagram_models.updated_at, diagram_models.public, diagram_models.name, diagram_models.image, diagram_models.project_id").
		// Project id is default
		Where("diagram_models.project_id = ?", "default").
		// User has access to the diagram
		Where("diagram_models.id IN (SELECT diagram_id FROM diagram_user_role_models WHERE user_id = ?)", userId).
		// Project id is not default
		Or("diagram_models.project_id != ?", "default").
		// User does not have access to the project
		Where("diagram_models.project_id NOT IN (SELECT project_id FROM project_user_role_models WHERE user_id = ?)", userId).
		// User has access to the diagram
		Where("diagram_models.id IN (SELECT diagram_id FROM diagram_user_role_models WHERE user_id = ?)", userId).
		// Order by updated_at
		Order("diagram_models.updated_at DESC").
		Limit(15).
		Find(&diagrams).Error; err != nil {
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	// Go to diagrammodelshiddencontent
	var response []models.DiagramModelHiddenContent
	for _, diagram := range diagrams {
		response = append(response, models.DiagramModelHiddenContent{
			ID:        diagram.ID,
			CreatedAt: diagram.CreatedAt,
			UpdatedAt: diagram.UpdatedAt,
			Public:    diagram.Public,
			Name:      diagram.Name,
			Image:     diagram.Image,
		})

		if diagram.ProjectID != "default" {
			response[len(response)-1].HasProject = true
		}
	}

	return response, nil
}
