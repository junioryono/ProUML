package diagramUsers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/router/routes/auth"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/types"
)

func Post(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		// Get the diagram id from query string
		diagramId := fbCtx.Query("diagram_id")
		addUserId := fbCtx.Query("user_id")
		role := fbCtx.Query("role")

		if diagramId == "" {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  types.ErrInvalidRequest,
			})
		}

		if addUserId == "" {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  types.ErrInvalidRequest,
			})
		}

		if role == "" {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  types.ErrInvalidRequest,
			})
		}

		if err := sdkP.Postgres.Diagram.Users.Add(diagramId, fbCtx.Cookies(auth.IdTokenCookieName), addUserId, role); err != nil {
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
