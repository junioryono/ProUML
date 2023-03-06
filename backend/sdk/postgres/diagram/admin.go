package diagram

import (
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/types"
	"gorm.io/gorm"
)

type admin_SDK struct {
	getDb func() *gorm.DB
}

func (a *admin_SDK) GetUserRole(diagramId, userId string) (string, *types.WrappedError) {
	var userDiagram models.DiagramUserRoleModel
	if err := a.getDb().Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error; err != nil {
		return "", types.Wrap(err, types.ErrDiagramNotFound)
	}

	return userDiagram.Role, nil
}

func (a *admin_SDK) IsDiagramPublic(diagramId string) (bool, *types.WrappedError) {
	var public bool
	if err := a.getDb().Model(&models.DiagramModel{}).Where("id = ?", diagramId).Pluck("public", &public).Error; err != nil {
		return false, types.Wrap(err, types.ErrDiagramNotFound)
	}

	return public, nil
}
