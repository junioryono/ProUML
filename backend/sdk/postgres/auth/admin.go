package auth

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/postgres/jwk"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/sdk/ses"
	"github.com/junioryono/ProUML/backend/types"
	"gorm.io/gorm"
)

type admin_SDK struct {
	auth  *Auth_SDK
	getDb func() *gorm.DB
	jwk   *jwk.JWK_SDK
	ses   *ses.SES_SDK
}

func (adminSDK *admin_SDK) GetUserFromIdentityProvider(userIPAddress, id, email, fullName string) (models.UserModel, string, string, *types.WrappedError) {
	var userModel models.UserModel

	query := adminSDK.getDb()

	if id != "" {
		query = query.Where("id = ?", id)
	}

	if email != "" {
		query = query.Or("email = ?", email)
	}

	if err := query.First(&userModel).Error; err != nil {
		// If the user does not exist, create a new user
		if errors.Is(err, gorm.ErrRecordNotFound) {
			if id == "" {
				id = uuid.New().String()
			}

			// Create the user
			userModel = models.UserModel{
				ID:     id,
				Email:  email,
				LastIP: userIPAddress,
			}

			if fullName != "" {
				userModel.FullName = fullName
				userModel.Picture = getUserPictureURL(fullName)
			}

			// Create the user in the database
			if err := adminSDK.getDb().Create(&userModel).Error; err != nil {
				return userModel, "", "", types.Wrap(err, types.ErrInternalServerError)
			}
		} else {
			fmt.Println("err7", err)
			return userModel, "", "", types.Wrap(err, types.ErrInternalServerError)
		}
	}

	// Create the user's id token, access token, and refresh token using postgres
	idToken, refreshToken, err := adminSDK.auth.createUserTokens(userModel)
	if err != nil {
		fmt.Println("err8", err)
		return userModel, "", "", types.Wrap(err, types.ErrInternalServerError)
	}

	return userModel, idToken, refreshToken, nil
}
