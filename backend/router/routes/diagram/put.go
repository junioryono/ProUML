package diagram

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/router/routes/auth"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/types"
)

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

		// need to get public and content from body
		type body struct {
			Public  *bool            `json:"public"`
			Name    string           `json:"name"`
			Content *json.RawMessage `json:"content"`
		}

		b := body{}
		if err := fbCtx.BodyParser(&b); err != nil {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		// Make changes to the diagram
		if err := sdkP.Postgres.Diagram.Update(diagramId, fbCtx.Cookies(auth.IdTokenCookieName), b.Public, b.Name, b.Content); err != nil {
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
