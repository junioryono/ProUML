package diagramUsers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func Put(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		// Get the diagram id from query string
		diagramId := fbCtx.Query("diagram_id")
		updateUserId := fbCtx.Query("user_id")
		role := fbCtx.Query("role")

		if diagramId == "" {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  "diagram id is required",
			})
		}

		if updateUserId == "" {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  "user id is required",
			})
		}

		if role == "" {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  "role is required",
			})
		}

		err := sdkP.Postgres.Diagram.Users.Update(diagramId, fbCtx.Cookies("id_token"), updateUserId, role)
		if err != nil {
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