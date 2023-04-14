package issues

import (
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/types"
)

func Post(sdkP *sdk.SDK) fiber.Handler {
	type body struct {
		ConnectedCells []string `json:"connected_cells"`
		Title          string   `json:"title"`
		Description    string   `json:"description"`
		Image          string   `json:"image"`
	}

	return func(fbCtx *fiber.Ctx) error {
		diagramId := fbCtx.Query("diagram_id")

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

		issue, err := sdkP.Postgres.Diagram.Issues.Create(diagramId, fbCtx.Locals("idToken").(string), b.ConnectedCells, b.Title, b.Description, b.Image)
		if err != nil {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		// User did not upload a project or use a template
		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success:  true,
			Response: issue,
		})
	}
}
