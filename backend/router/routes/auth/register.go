package auth

import (
	"time"

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

		// Store id token in http only cookie
		fbCtx.Cookie(&fiber.Cookie{
			Name:  "id_token",
			Value: idToken,
			// Domain:   "prouml.com", // TODO remove this
			Expires:  time.Now().Add(7 * 24 * time.Hour),
			HTTPOnly: true,
			// Secure:   true, // TODO remove this
		})

		// Store refresh token in http only cookie
		fbCtx.Cookie(&fiber.Cookie{
			Name:  "refresh_token",
			Value: refreshToken,
			// Domain:   "prouml.com", // TODO remove this
			Expires:  time.Now().Add(30 * 24 * time.Hour),
			HTTPOnly: true,
			// Secure:   true, // TODO remove this
		})

		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success: true,
		})
	}
}
