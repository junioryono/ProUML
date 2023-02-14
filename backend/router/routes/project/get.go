package project

import (
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/types"
)

func Get(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		projectId := fbCtx.Query("id")
		if projectId == "" {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  types.ErrInvalidRequest,
			})
		}

		project, err := sdkP.Postgres.Project.Get(projectId, fbCtx.Locals("idToken").(string))
		if err != nil {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success:  true,
			Response: project,
		})
	}
}
