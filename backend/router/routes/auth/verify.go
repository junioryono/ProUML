package router

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	cognito "github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/auth"
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func Verify(cgn auth.Cognito) func(*fiber.Ctx) error {
	return func(fbCtx *fiber.Ctx) error {
		// use redis to store
		// key will be "email:confirmationCode-jryono123@gmail.com"
		// value will be "123456" < the confirmation code
		// need to encrypt the value using their password

		// change implementation to use redis
		// search for the key
		// decrypt the value using their password

		email := "jryono123@gmail.com"
		confirmationCode := fbCtx.Params("confirmationCode")

		confirmSignUpInput := &cognito.ConfirmSignUpInput{
			ClientId:         aws.String(cgn.AppClientID),
			ConfirmationCode: aws.String(confirmationCode),
			SecretHash:       aws.String(cgn.ComputeSecretHash(email)),
			Username:         aws.String(email),
		}

		err := confirmSignUpInput.Validate()
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

		user, err := cgn.CognitoClient.ConfirmSignUp(confirmSignUpInput)
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
