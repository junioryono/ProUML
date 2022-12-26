package auth

import (
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func Register(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		idToken, refreshToken, err := sdkP.Postgres.Auth.CreateUser(
			fbCtx.IP(),
			fbCtx.FormValue("email"),
			fbCtx.FormValue("password"),
			fbCtx.FormValue("firstName"),
			fbCtx.FormValue("lastName"),
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
				Reason:  "Internal Server Error",
			})
		}

		if err := SetCookie(fbCtx, RefreshTokenCookieName, refreshToken); err != nil {
			return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
				Success: false,
				Reason:  "Internal Server Error",
			})
		}

		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success: true,
		})
	}
}
