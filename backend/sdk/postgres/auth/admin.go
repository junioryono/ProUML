package auth

import (
	"errors"

	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/postgres/jwk"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/sdk/ses"
	"github.com/junioryono/ProUML/backend/types"
	"gorm.io/gorm"
)

type admin_SDK struct {
	auth *Auth_SDK
	db   *gorm.DB
	jwk  *jwk.JWK_SDK
	ses  *ses.SES_SDK
}

func (adminSDK *admin_SDK) GetUserFromIdentityProvider(userIPAddress, email, fullName string) (models.UserModel, string, string, *types.WrappedError) {
	var userModel models.UserModel

	// Get the user from the database using the email
	if err := adminSDK.db.Where("email = ?", email).First(&userModel).Error; err != nil {
		// If the user does not exist, create a new user
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Create the user
			userModel = models.UserModel{
				ID:      uuid.New().String(),
				Email:   email,
				LastIP:  userIPAddress,
				Picture: getUserPictureURL(fullName),
			}

			if fullName != "" {
				userModel.FullName = fullName
			}

			// Create the user in the database
			if err := adminSDK.db.Create(&userModel).Error; err != nil {
				return userModel, "", "", types.Wrap(err, types.ErrInternalServerError)
			}
		} else {
			return userModel, "", "", types.Wrap(err, types.ErrInternalServerError)
		}
	}

	// Create the user's id token, access token, and refresh token using postgres
	idToken, refreshToken, err := adminSDK.auth.createUserTokens(userModel)
	if err != nil {
		return userModel, "", "", types.Wrap(err, types.ErrInternalServerError)
	}

	return userModel, idToken, refreshToken, nil
}
