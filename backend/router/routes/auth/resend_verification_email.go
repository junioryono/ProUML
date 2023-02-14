package auth

import (
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/types"
)

func ResendVerificationEmail(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		idToken := fbCtx.Cookies(IdTokenCookieName, fbCtx.Locals("idToken").(string))
		if err := sdkP.Postgres.Auth.Client.ResendEmailVerificationEmail(idToken); err != nil {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success: true,
		})
	}
}
