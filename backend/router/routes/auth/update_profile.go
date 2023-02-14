package auth

import (
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/types"
)

func UpdateProfile(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		if fbCtx.FormValue("fullName") != "" {
			idToken := fbCtx.Cookies(IdTokenCookieName, fbCtx.Locals("idToken").(string))
			if err := sdkP.Postgres.Auth.Client.UpdateUserFullName(idToken, fbCtx.FormValue("fullName")); err != nil {
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
			Reason:  types.ErrInvalidRequest,
		})
	}
}

func reissueIdToken(fbCtx *fiber.Ctx, sdkP *sdk.SDK) error {
	idToken, err := sdkP.Postgres.Auth.Client.RefreshIdToken(fbCtx.Cookies(IdTokenCookieName, fbCtx.Locals("idToken").(string)))
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
