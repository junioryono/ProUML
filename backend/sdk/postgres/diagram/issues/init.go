package issues

import (
	"errors"

	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/postgres/auth"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/types"
	"gorm.io/gorm"
)

type Issues_SDK struct {
	auth  *auth.Auth_SDK
	getDb func() *gorm.DB
}

func Init(auth *auth.Auth_SDK, getDb func() *gorm.DB) *Issues_SDK {
	return &Issues_SDK{
		auth:  auth,
		getDb: getDb,
	}
}

func (d *Issues_SDK) Create(diagramId, idToken string, connectedCells []string, title, description, image string) (*models.IssueModel, *types.WrappedError) {
	var diagram models.DiagramModel

	// Get the user id from the id token
	userId, err := d.auth.Client.GetUserId(idToken)
	if err != nil {
		return nil, err
	}

	// Get the diagram from the database if the user has access to it or models.DiagramModel.public is true
	if err := d.getDb().
		Preload("UserRoles").
		Where("id = ?", diagramId).
		First(&diagram).Error; err != nil {
		return nil, types.Wrap(err, types.ErrDiagramNotFound)
	}

	// Check if the user has access to the diagram
	userHasAccess := false
	for _, userDiagram := range diagram.UserRoles {
		if userDiagram.UserID == userId {
			userHasAccess = true
			break
		}
	}

	if !userHasAccess {
		return nil, types.Wrap(errors.New("user does not have access to the diagram"), types.ErrInvalidRequest)
	}

	// Create the new issue
	issue := models.IssueModel{
		ID:             uuid.New().String(),
		DiagramID:      diagramId,
		CreatedByID:    userId,
		ConnectedCells: connectedCells,
		Title:          title,
		Description:    description,
		Image:          image,
	}

	// Save the issue to the database
	if err := d.getDb().Create(&issue).Error; err != nil {
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	return &issue, nil
}

// Make a function that deletes an issue
func (d *Issues_SDK) Delete(diagramId, idToken, issueId string) *types.WrappedError {
	var diagram models.DiagramModel

	// Get the user id from the id token
	userId, err := d.auth.Client.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Get the diagram from the database if the user has access to it or models.DiagramModel.public is true
	if err := d.getDb().
		Preload("UserRoles").
		Where("id = ?", diagramId).
		First(&diagram).Error; err != nil {
		return types.Wrap(err, types.ErrDiagramNotFound)
	}

	// Check if the user has access to the diagram
	userHasAccess := false
	for _, userDiagram := range diagram.UserRoles {
		if userDiagram.UserID == userId {
			userHasAccess = true
			break
		}
	}

	if !userHasAccess {
		return types.Wrap(errors.New("user does not have access to the diagram"), types.ErrInvalidRequest)
	}

	// Delete the issue from the database
	if err := d.getDb().Where("id = ? AND diagram_id = ?", issueId, diagramId).Delete(&models.IssueModel{}).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}
