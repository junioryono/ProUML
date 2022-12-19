package diagram

import (
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func New(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success:  true,
			Response: "Hello World!",
		})
	}
}
