package auth

import (
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/types"
)

func Register(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		user, idToken, refreshToken, err := sdkP.Postgres.Auth.CreateUser(
			fbCtx.IP(),
			fbCtx.FormValue("email"),
			fbCtx.FormValue("password"),
			fbCtx.FormValue("fullName"),
		)

		if err != nil {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		if err := SetCookie(fbCtx, IdTokenCookieName, idToken); err != nil {
			return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		if err := SetCookie(fbCtx, RefreshTokenCookieName, refreshToken); err != nil {
			return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success:  true,
			Response: user,
		})
	}
}
