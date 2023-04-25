package auth

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/types"
)

func VerifyEmail(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		emailVerificationToken := fbCtx.Query("token")
		if emailVerificationToken == "" {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  types.ErrInvalidRequest,
			})
		}

		if err := sdkP.Postgres.Auth.Client.VerifyEmail(emailVerificationToken); err != nil {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		if idToken := fbCtx.Cookies(IdTokenCookieName); idToken != "" {
			// The reissueIdToken function uses the idToken local variable, so we need to set it here
			fbCtx.Locals("idToken", idToken)
			if err := reissueIdToken(fbCtx, sdkP); err != nil {
				fmt.Println("reissuing id token failed")
				return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
					Success: false,
					Reason:  err.Error(),
				})
			}
		}

		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success: true,
		})
	}
}
