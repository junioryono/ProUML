package auth

import (
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/types"
)

func ResetPassword(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		idToken := fbCtx.Cookies(IdTokenCookieName, fbCtx.Locals("idToken").(string))
		oldPassword := fbCtx.FormValue("old-password")
		newPassword := fbCtx.FormValue("new-password")
		if oldPassword == "" || newPassword == "" {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  types.ErrInvalidRequest,
			})
		}

		if err := sdkP.Postgres.Auth.Client.ChangePassword(idToken, oldPassword, newPassword); err != nil {
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
