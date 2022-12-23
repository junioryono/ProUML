package auth

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func GetProfile(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {

		// Get user id from fiber context
		userId := fbCtx.Locals("user_id").(string)
		fmt.Printf("userId: %s", userId)

		// NOT WORKING

		claims, err := sdkP.Auth0.GetUser(fbCtx.IP(), userId)
		if err != nil {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success:  true,
			Response: claims,
		})
	}
}
