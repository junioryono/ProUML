package oauth

import (
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
)

func GoogleLogin(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		oauthState, err := createStateToken(fbCtx, sdkP)
		if err != nil {
			return err
		}

		return fbCtx.Status(fiber.StatusOK).Redirect(sdkP.OAuth.Google.AuthCodeURL(oauthState))
	}
}
