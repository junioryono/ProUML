package diagram

import (
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/router/routes/auth"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/types"
)

type body struct {
	Public *bool  `json:"public"`
	Name   string `json:"name"`
}

func Put(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		// Get the diagram id from query string
		diagramId := fbCtx.Query("id")

		if diagramId == "" {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  types.ErrInvalidRequest,
			})
		}

		b := body{}
		if err := fbCtx.BodyParser(&b); err != nil {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		if b.Public != nil {
			if err := sdkP.Postgres.Diagram.UpdatePublic(diagramId, fbCtx.Cookies(auth.IdTokenCookieName), *b.Public); err != nil {
				return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
					Success: false,
					Reason:  err.Error(),
				})
			}
		} else if b.Name != "" {
			if err := sdkP.Postgres.Diagram.UpdateName(diagramId, fbCtx.Cookies(auth.IdTokenCookieName), b.Name); err != nil {
				return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
					Success: false,
					Reason:  err.Error(),
				})
			}
		} else {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  types.ErrInvalidRequest,
			})
		}

		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success: true,
		})
	}
}
