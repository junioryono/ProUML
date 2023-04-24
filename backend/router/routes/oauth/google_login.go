package oauth

import (
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"golang.org/x/oauth2"
)

func GoogleLogin(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		oauthState, err := createStateToken(fbCtx, sdkP)
		if err != nil {
			return err
		}

		urlOptions := []oauth2.AuthCodeOption{
			oauth2.SetAuthURLParam("access_type", "offline"),
			oauth2.SetAuthURLParam("prompt", "consent"),
			oauth2.SetAuthURLParam("include_granted_scopes", "true"),
		}

		return fbCtx.Status(fiber.StatusOK).Redirect(sdkP.OAuth.Google.AuthCodeURL(oauthState, urlOptions...))
	}
}
