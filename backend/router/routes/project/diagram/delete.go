package project

import (
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/types"
)

func Delete(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		projectId := fbCtx.FormValue("projectId")
		diagramId := fbCtx.FormValue("diagramId")

		if projectId == "" || diagramId == "" {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  types.ErrInvalidRequest,
			})
		}

		if err := sdkP.Postgres.Project.Diagram.Delete(projectId, diagramId, fbCtx.Locals("idToken").(string)); err != nil {
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
