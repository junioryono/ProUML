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
		Model(&models.DiagramModel{}).
		Preload("UserRoles", "user_id = ?", userId).
		Select("diagram_models.id, diagram_models.created_at, diagram_models.updated_at, diagram_models.public, diagram_models.name, diagram_models.image, diagram_models.project_id, diagram_models.allow_editor_permissions").
		Joins("LEFT JOIN diagram_user_role_models ON diagram_user_role_models.diagram_id = diagram_models.id").
		Where(`(
			(diagram_models.project_id = 'default' AND diagram_user_role_models.user_id = ?) OR
			(diagram_models.project_id != 'default' AND diagram_models.project_id NOT IN (SELECT project_id FROM project_user_role_models WHERE user_id = ?) AND diagram_user_role_models.user_id = ?)
		)`, userId, userId, userId).
		Order("diagram_models.updated_at DESC").
		Find(&diagrams).Error; err != nil {
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	// Go to diagrammodelshiddencontent
	var response []models.DiagramModelHiddenContent
	for _, diagram := range diagrams {
		var IsSharedWithCurrentUser bool = false
		for _, userRole := range diagram.UserRoles {
			if userRole.UserID == userId {
				if userRole.Role != "owner" {
					IsSharedWithCurrentUser = true
				}

				break
			}
		}

		var IsFromUnsharedProject bool = false
		if diagram.ProjectID != "default" {
			IsFromUnsharedProject = true
		}

		var CurrentUserHasEditPermission bool = false
		for _, userRole := range diagram.UserRoles {
			if userRole.UserID == userId {
				if userRole.Role == "owner" || (userRole.Role == "editor" && diagram.AllowEditorPermissions) {
					CurrentUserHasEditPermission = true
				}

				break
			}
		}
		response = append(response, models.DiagramModelHiddenContent{
			ID:                           diagram.ID,
			CreatedAt:                    diagram.CreatedAt,
			UpdatedAt:                    diagram.UpdatedAt,
			Public:                       diagram.Public,
			Name:                         diagram.Name,
			Image:                        diagram.Image,
			IsSharedWithCurrentUser:      IsSharedWithCurrentUser,
			IsFromUnsharedProject:        IsFromUnsharedProject,
			CurrentUserHasEditPermission: CurrentUserHasEditPermission,
		})

	}

	return response, nil
}

func (d *Diagrams_SDK) GetShared(idToken string, offset int) ([]models.DiagramModelHiddenContent, *types.WrappedError) {
	userId, err := d.Auth.Client.GetUserId(idToken)
	if err != nil {
		return nil, err
	}

	var diagrams []models.DiagramModel
	if err := d.getDb().
		Model(&models.DiagramModel{}).
		Preload("UserRoles", "user_id = ?", userId).
		Select("diagram_models.id, diagram_models.created_at, diagram_models.updated_at, diagram_models.public, diagram_models.name, diagram_models.image, diagram_models.project_id, diagram_models.allow_editor_permissions").
		Joins("JOIN diagram_user_role_models ON diagram_user_role_models.diagram_id = diagram_models.id").
		Where("diagram_user_role_models.user_id = ? AND diagram_user_role_models.role != 'owner'", userId).
		Order("diagram_models.updated_at DESC").
		Find(&diagrams).Error; err != nil {
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	// Go to diagrammodelshiddencontent
	var response []models.DiagramModelHiddenContent
	for _, diagram := range diagrams {
		var IsSharedWithCurrentUser bool = false
		for _, userRole := range diagram.UserRoles {
			if userRole.UserID == userId {
				if userRole.Role != "owner" {
					IsSharedWithCurrentUser = true
				}

				break
			}
		}

		var IsFromUnsharedProject bool = false
		if diagram.ProjectID != "default" {
			IsFromUnsharedProject = true
		}

		var CurrentUserHasEditPermission bool = false
		for _, userRole := range diagram.UserRoles {
			if userRole.UserID == userId {
				if userRole.Role == "owner" || (userRole.Role == "editor" && diagram.AllowEditorPermissions) {
					CurrentUserHasEditPermission = true
				}

				break
			}
		}
		response = append(response, models.DiagramModelHiddenContent{
			ID:                           diagram.ID,
			CreatedAt:                    diagram.CreatedAt,
			UpdatedAt:                    diagram.UpdatedAt,
			Public:                       diagram.Public,
			Name:                         diagram.Name,
			Image:                        diagram.Image,
			IsSharedWithCurrentUser:      IsSharedWithCurrentUser,
			IsFromUnsharedProject:        IsFromUnsharedProject,
			CurrentUserHasEditPermission: CurrentUserHasEditPermission,
		})

	}

	return response, nil
}

func (d *Diagrams_SDK) GetAllDiagramsIssues(idToken string) ([]models.IssueModel, *types.WrappedError) {
	userId, err := d.Auth.Client.GetUserId(idToken)
	if err != nil {
		return nil, err
	}

	// Get all Diagrams that the user has a role in
	var diagrams []models.DiagramModel
	if err := d.getDb().
		Model(&models.DiagramModel{}).
		Preload("Issues").
		Preload("Issues.CreatedBy").
		Joins("LEFT JOIN diagram_user_role_models ON diagram_user_role_models.diagram_id = diagram_models.id").
		Joins("LEFT JOIN project_user_role_models ON project_user_role_models.project_id = diagram_models.project_id").
		Where("diagram_user_role_models.user_id = ? OR project_user_role_models.user_id = ?", userId, userId).
		Find(&diagrams).Error; err != nil {
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	// Collect all issues from the diagrams
	var allIssues []models.IssueModel
	for _, diagram := range diagrams {
		allIssues = append(allIssues, diagram.Issues...)
	}

	return allIssues, nil
}
