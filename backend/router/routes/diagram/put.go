package diagram

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func Put(sdkP *sdk.SDK) fiber.Handler {
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

		// need to get public and content from body
		type body struct {
			Public  bool            `json:"public"`
			Name    string          `json:"name"`
			Content json.RawMessage `json:"content"`
		}

		b := body{}
		err := fbCtx.BodyParser(&b)
		if err != nil {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		// Make changes to the diagram
		err = sdkP.Postgres.Diagram.Update(diagramId, userId, b.Public, b.Name, b.Content)
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
