package auth

import (
	"github.com/aws/aws-sdk-go/aws"
	cognito "github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
	"github.com/go-redis/redis/v9"
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func Verify(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		confirmationCode := fbCtx.Params("confirmationCode") // confirmationCode will never be empty

		email, err := sdkP.Redis.Client.Get(sdkP.Redis.Context, confirmationCode).Result()
		if err == redis.Nil {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  "Invalid confirmation code.",
			})
		} else if err != nil {
			return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		go func() {
			// Remove key from Redis
			sdkP.Redis.Client.Del(sdkP.Redis.Context, confirmationCode)
		}()

		go func() {
			// Set email_verified attribute to true
			sdkP.AWS.Cognito.AdminUpdateUserAttributes(&cognito.AdminUpdateUserAttributesInput{
				UserPoolId: &sdkP.AWS.UserPoolID,
				Username:   &email,
				UserAttributes: []*cognito.AttributeType{
					{
						Name:  aws.String("email_verified"),
						Value: aws.String("true"),
					},
				},
			})
		}()

		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success:  true,
			Response: email + " is now verified.",
		})
	}
}
