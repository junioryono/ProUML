package auth

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func DeleteAccount(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		if fbCtx.FormValue("email") == "" || fbCtx.FormValue("password") == "" {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  "Email and password are required",
			})
		}

		// Authenticate user with Postgres
		_, idToken, _, err := sdkP.Postgres.Auth.AuthenticateUser(
			fbCtx.IP(),
			fbCtx.FormValue("email"),
			fbCtx.FormValue("password"),
		)

		if err != nil {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		go func(userIPAddress, idTokenParam string) {
			err := sdkP.Postgres.Auth.DeleteUser(idTokenParam)
			if err != nil {
				fmt.Println(err.Error())
			}

		}(fbCtx.IP(), idToken)

		// Remove cookies from browser
		if err := DeleteCookie(fbCtx, IdTokenCookieName); err != nil {
			return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		if err := DeleteCookie(fbCtx, RefreshTokenCookieName); err != nil {
			return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success: true,
		})
	}
}
