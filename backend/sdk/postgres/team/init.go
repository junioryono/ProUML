package team

import (
	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/postgres/auth"
	"github.com/junioryono/ProUML/backend/sdk/postgres/diagram/users"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/types"
	"gorm.io/gorm"
)

type Team_SDK struct {
	Users *users.Users_SDK
	auth  *auth.Auth_SDK
	db    *gorm.DB
}

func Init(db *gorm.DB, Auth *auth.Auth_SDK) *Team_SDK {
	return &Team_SDK{
		Users: users.Init(Auth, db),
		auth:  Auth,
		db:    db,
	}
}

func (t *Team_SDK) Create(idToken, name string) (string, *types.WrappedError) {
	// Get the user id from the id token
	userId, err := t.auth.Client.GetUserId(idToken)
	if err != nil {
		return "", err
	}

	teamId := uuid.New().String()

	// Create a new team model
	team := models.TeamModel{
		ID: teamId,
	}

	if name != "" {
		team.Name = name
	}

	// Create a new user team model
	userTeam := models.TeamUserRoleModel{
		UserID: userId,
		TeamID: teamId,
		Owner:  true,
	}

	tx := t.db.Begin()

	// Save the team and the user team to the database
	if err := tx.Create(&team).Error; err != nil {
		tx.Rollback()
		return "", types.Wrap(err, types.ErrInternalServerError)
	}

	if err := tx.Create(&userTeam).Error; err != nil {
		tx.Rollback()
		return "", types.Wrap(err, types.ErrInternalServerError)
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return "", types.Wrap(err, types.ErrInternalServerError)
	}

	return teamId, nil
}

func (t *Team_SDK) Get(teamId, idToken string) (*models.TeamModel, *types.WrappedError) {
	// Get the user id from the id token
	userId, err := t.auth.Client.GetUserId(idToken)
	if err != nil {
		return nil, err
	}

	// Get the team from the database if the user has access to it
	team := models.TeamModel{}
	if err := t.db.Model(&models.TeamUserRoleModel{}).
		Where("user_id = ? AND team_id = ?", userId, teamId).
		First(&team).Error; err != nil {
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	return &team, nil
}
