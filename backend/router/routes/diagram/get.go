package diagram

import (
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/types"
)

func Get(sdkP *sdk.SDK) fiber.Handler {
	type Response struct {
		Diagram *models.DiagramModel `json:"diagram"`
		Role    string               `json:"role"`
	}

	return func(fbCtx *fiber.Ctx) error {
		diagramId := fbCtx.Query("id")
		if diagramId == "" {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  types.ErrInvalidRequest,
			})
		}

		diagram, role, err := sdkP.Postgres.Diagram.Get(diagramId, fbCtx.Locals("idToken").(string))
		if err != nil {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success:  true,
			Response: Response{Diagram: diagram, Role: role},
		})
	}
}
