package router

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	cognito "github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/auth"
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func GetProfile(cgn auth.Cognito) func(*fiber.Ctx) error {
	return func(fbCtx *fiber.Ctx) error {
		accessToken := fbCtx.FormValue("access_token")

		getUserInput := &cognito.GetUserInput{
			AccessToken: aws.String(fbCtx.FormValue(accessToken)),
		}

		err := getUserInput.Validate()
		if err != nil {
			if awsErr, ok := err.(awserr.Error); ok {
				return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
					Success: false,
					Reason:  awsErr.Message(),
				})
			}

			return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		user, err := cgn.CognitoClient.GetUser(getUserInput)
		if err != nil {
			if awsErr, ok := err.(awserr.Error); ok {
				return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
					Success: false,
					Reason:  awsErr.Message(),
				})
			}

			return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success:  true,
			Response: user,
		})
	}
}
