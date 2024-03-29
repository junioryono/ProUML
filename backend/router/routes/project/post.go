package project

import (
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	httpTypes "github.com/junioryono/ProUML/backend/types"
)

func Post(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		projectName := fbCtx.Query("name")

		projectId, err := sdkP.Postgres.Project.Create(fbCtx.Locals("idToken").(string), projectName)
		if err != nil {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(httpTypes.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		// User did not upload a project or use a template
		return fbCtx.Status(fiber.StatusOK).JSON(httpTypes.Status{
			Success:  true,
			Response: projectId,
		})
	}
}
