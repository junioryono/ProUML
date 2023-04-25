package auth

import (
	"strings"

	"github.com/junioryono/ProUML/backend/sdk/postgres/jwk"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/sdk/sendgrid"
	"github.com/junioryono/ProUML/backend/types"
	jwkT "github.com/lestrrat-go/jwx/jwk"
	"gorm.io/gorm"
)

type Auth_SDK struct {
	Admin  *admin_SDK
	Client *client_SDK
	jwk    *jwk.JWK_SDK
}

func Init(getDb func() *gorm.DB, jwk *jwk.JWK_SDK, sendgrid *sendgrid.SendGrid_SDK) *Auth_SDK {
	authSDK := &Auth_SDK{
		jwk: jwk,
	}

	authSDK.Admin = &admin_SDK{
		auth:     authSDK,
		getDb:    getDb,
		jwk:      jwk,
		sendgrid: sendgrid,
	}

	authSDK.Client = &client_SDK{
		auth:     authSDK,
		getDb:    getDb,
		jwk:      jwk,
		sendgrid: sendgrid,
	}

	return authSDK
}

// Function that get the JWK set from jwk.GetSet
func (authSDK *Auth_SDK) GetJWKSet() (jwkT.Set, *types.WrappedError) {
	return authSDK.jwk.GetSet()
}

func (authSDK *Auth_SDK) createUserTokens(user models.UserModel) (string, string, *types.WrappedError) {
	// Create the user's id token, access token, and refresh token using postgres
	idToken, err := authSDK.jwk.CreateUserIdToken(user)
	if err != nil {
		return "", "", types.Wrap(err, types.ErrInternalServerError)
	}

	refreshToken, err := authSDK.jwk.CreateUserRefreshToken(user)
	if err != nil {
		return "", "", types.Wrap(err, types.ErrInternalServerError)
	}

	return idToken, refreshToken, nil
}

func getUserPictureURL(fullName string) string {
	imageString := "https://cdn.auth0.com/avatars/"

	if fullName == "" {
		return imageString + "default.png"
	}

	// Split the full name into first name and last name
	before, after, found := strings.Cut(fullName, " ")

	if found {
		if len(before) > 0 {
			// Get the first letter of the first name lowercase
			imageString += strings.ToLower(string(before[0]))
		}
		if len(after) > 0 {
			// Get the first letter of the last name lowercase
			imageString += strings.ToLower(string(after[0]))
		}

	} else {
		// Get the first letter of the full name lowercase
		imageString += strings.ToLower(string(fullName[0]))
	}

	return imageString + ".png"
}
