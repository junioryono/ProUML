package auth

import (
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func Login(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		_, err := sdkP.AWS.RefreshIdToken(fbCtx, fbCtx.Cookies("refresh_token"))
		if err == nil {
			return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
				Success: true,
			})
		}

		_, err = sdkP.AWS.Login(fbCtx, fbCtx.FormValue("email"), fbCtx.FormValue("password"))
		if err != nil {
			if awsErr, ok := err.(awserr.Error); ok {
				return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
					Success: false,
					Reason:  awsErr.Message(),
				})
			}

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
