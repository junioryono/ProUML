package diagram

import (
	"errors"

	"github.com/junioryono/ProUML/backend/sdk/postgres/auth"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/types"
	"gorm.io/gorm"
)

type Diagram_SDK struct {
	auth  *auth.Auth_SDK
	getDb func() *gorm.DB
}

func Init(getDb func() *gorm.DB, Auth *auth.Auth_SDK) *Diagram_SDK {
	return &Diagram_SDK{
		auth:  Auth,
		getDb: getDb,
	}
}

// Function that will add a diagram to a project
func (d *Diagram_SDK) Put(projectId, diagramId, idToken string) *types.WrappedError {
	if projectId == "" || diagramId == "" {
		return types.Wrap(errors.New("project id or diagram id is empty"), types.ErrInvalidRequest)
	}

	// Get the user id from the id token
	userId, err := d.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Update the DiagramModel's ProjectID if the user is a member of the project
	// Check if the user is a member of the project
	var projectUserRole models.ProjectUserRoleModel
	if err := d.getDb().Where("user_id = ? AND project_id = ?", userId, projectId).First(&projectUserRole).Error; err != nil {
		return types.Wrap(err, types.ErrInvalidRequest)
	}

	// Update the diagram's project id
	if err := d.getDb().Model(&models.DiagramModel{}).Where("id = ?", diagramId).Update("project_id", projectId).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

// Function that will remove a diagram from a project
func (d *Diagram_SDK) Delete(projectId, diagramId, idToken string) *types.WrappedError {
	if projectId == "" || diagramId == "" {
		return types.Wrap(errors.New("project id or diagram id is empty"), types.ErrInvalidRequest)
	}

	// Get the user id from the id token
	userId, err := d.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Check if the user is a member of the project
	var projectUserRole models.ProjectUserRoleModel
	if err := d.getDb().Where("user_id = ? AND project_id = ?", userId, projectId).First(&projectUserRole).Error; err != nil {
		return types.Wrap(err, types.ErrInvalidRequest)
	}

	// Update the diagram's project id
	if err := d.getDb().Model(&models.DiagramModel{}).Where("id = ?", diagramId).Update("project_id", "default").Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}
