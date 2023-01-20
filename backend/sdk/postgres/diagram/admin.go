package diagram

import (
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/types"
	"gorm.io/gorm"
)

type admin_SDK struct {
	db *gorm.DB
}

func (a *admin_SDK) GetUserRole(diagramId, userId string) (string, *types.WrappedError) {
	var userDiagram models.DiagramUserRoleModel
	if err := a.db.Where("user_id = ? AND diagram_id = ?", userId, diagramId).First(&userDiagram).Error; err != nil {
		return "", types.Wrap(err, types.ErrDiagramNotFound)
	}

	return userDiagram.Role, nil
}
