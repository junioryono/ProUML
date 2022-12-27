package auth

import (
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func UpdateProfile(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		if fbCtx.FormValue("fullName") != "" {
			err := sdkP.Postgres.Auth.UpdateUserFullName(
				fbCtx.Cookies("id_token"),
				fbCtx.FormValue("fullName"),
			)

			if err != nil {
				return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
					Success: false,
					Reason:  err.Error(),
				})
			}

			if err := reissueIdToken(fbCtx, sdkP); err != nil {
				return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
					Success: false,
					Reason:  err.Error(),
				})
			}

			return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
				Success: true,
			})
		}

		// TODO - Add more fields to update

		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success: false,
			Reason:  "Invalid request",
		})
	}
}

func reissueIdToken(fbCtx *fiber.Ctx, sdkP *sdk.SDK) error {
	idToken, err := sdkP.Postgres.Auth.RefreshIdToken(fbCtx.Cookies(IdTokenCookieName))
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

	return nil
}
