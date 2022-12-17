package router

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	cognito "github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/auth"
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func Register(cgn auth.Cognito) func(*fiber.Ctx) error {
	return func(fbCtx *fiber.Ctx) error {

		email := fbCtx.FormValue("email")
		password := fbCtx.FormValue("password")

		firstName := fbCtx.FormValue("first_name")
		lastName := fbCtx.FormValue("last_name")

		if email == "" {
			return fbCtx.JSON(types.Status{
				Success: false,
				Reason:  "email is empty",
			})
		}

		if password == "" {
			return fbCtx.JSON(types.Status{
				Success: false,
				Reason:  "password is empty",
			})
		}

		signUpInput := &cognito.SignUpInput{
			Username:   aws.String(email),
			Password:   aws.String(password),
			ClientId:   aws.String(cgn.AppClientID),
			SecretHash: aws.String(cgn.ComputeSecretHash(email)),
			UserAttributes: []*cognito.AttributeType{
				{
					Name:  aws.String("given_name"),
					Value: aws.String(firstName),
				},
				{
					Name:  aws.String("family_name"),
					Value: aws.String(lastName),
				},
			},
		}

		err := signUpInput.Validate()
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

		_, err = cgn.CognitoClient.SignUp(signUpInput)
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
			Success: true,
		})
	}
}
