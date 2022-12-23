package diagramUsers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func Get(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		// Get user id from fiber context
		userId := fbCtx.Locals("user_id").(string)

		// Get the diagram id from query string
		diagramId := fbCtx.Query("id")

		if diagramId == "" {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  "diagram id is required",
			})
		}

		// Get all users that have access to the diagram
		users, err := sdkP.Postgres.Diagram.Users.GetAllWithAccessRole(diagramId, userId)
		if err != nil {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success:  true,
			Response: users,
		})
	}
}
