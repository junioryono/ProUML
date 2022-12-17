package router

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	cognito "github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/auth"
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func Login(cgn auth.Cognito) func(*fiber.Ctx) error {
	return func(fbCtx *fiber.Ctx) error {

		email := fbCtx.FormValue("email")
		password := fbCtx.FormValue("password")
		refreshToken := fbCtx.FormValue("refresh_token")

		if email == "" {
			return fbCtx.JSON(types.Status{
				Success: false,
				Reason:  "no email provided",
			})
		}

		if password == "" && refreshToken == "" {
			return fbCtx.JSON(types.Status{
				Success: false,
				Reason:  "no password or refresh token provided",
			})
		}

		authInput := &cognito.InitiateAuthInput{
			ClientId: aws.String(cgn.AppClientID),
			AuthParameters: map[string]*string{
				"SECRET_HASH": aws.String(cgn.ComputeSecretHash(email)),
			},
		}

		if refreshToken != "" {
			authInput.AuthFlow = aws.String(cognito.AuthFlowTypeRefreshTokenAuth)
			authInput.AuthParameters["REFRESH_TOKEN"] = aws.String(refreshToken)
		} else if password != "" {
			authInput.AuthFlow = aws.String(cognito.AuthFlowTypeUserPasswordAuth)
			authInput.AuthParameters["USERNAME"] = aws.String(email)
			authInput.AuthParameters["PASSWORD"] = aws.String(password)
		}

		err := authInput.Validate()
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

		userOutput, err := cgn.CognitoClient.InitiateAuth(authInput)
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
			Response: userOutput,
		})
	}
}

// package router

// import (
// 	"github.com/aws/aws-sdk-go/aws"
// 	cognito "github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
// 	"github.com/gofiber/fiber/v2"
// 	"github.com/junioryono/ProUML/backend/auth"
// 	"github.com/junioryono/ProUML/backend/transpiler/types"
// )

// func login(cgn auth.Cognito) func(c *fiber.Ctx) error {
// 	return func(fbCtx *fiber.Ctx) error {

// 		username := fbCtx.FormValue("email")
// 		password := fbCtx.FormValue("password")
// 		refreshToken := fbCtx.FormValue("refresh_token")

// 		secretHash := cgn.ComputeSecretHash(cgn.AppClientSecret, username, cgn.AppClientID)
// 		authInput := &cognito.InitiateAuthInput{
// 			ClientId: aws.String(cgn.AppClientID),
// 			AuthFlow: aws.String(cognito.AuthFlowTypeUserPasswordAuth),
// 			AuthParameters: map[string]*string{
// 				"SECRET_HASH": aws.String(secretHash),
// 			},
// 		}

// 		if refreshToken == "" && (username == "" || password == "") {
// 			return fbCtx.JSON(types.Status{
// 				Success: false,
// 				Reason:  "no auth credentials provided",
// 			})
// 		} else if refreshToken != "" {
// 			authInput.AuthFlow = aws.String(cognito.AuthFlowTypeRefreshTokenAuth)
// 			authInput.AuthParameters["REFRESH_TOKEN"] = aws.String(refreshToken)
// 		} else if username != "" && password != "" {
// 			authInput.AuthParameters["USERNAME"] = aws.String(username)
// 			authInput.AuthParameters["PASSWORD"] = aws.String(password)
// 		}

// 		for k, v := range authInput.AuthParameters {
// 			println(k, *v)
// 		}

// 		err := authInput.Validate()
// 		if err != nil {
// 			// if awsErr, ok := err.(awserr.Error); ok {
// 			// 	return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
// 			// 		Success: false,
// 			// 		Reason:  awsErr.Message(),
// 			// 	})
// 			// }

// 			return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
// 				Success: false,
// 				Reason:  err.Error(),
// 			})
// 		}

// 		userOutput, err := cgn.CognitoClient.InitiateAuth(authInput)
// 		if err != nil {
// 			// if awsErr, ok := err.(awserr.Error); ok {
// 			// 	return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
// 			// 		Success: false,
// 			// 		Reason:  awsErr.Message(),
// 			// 	})
// 			// }

// 			return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
// 				Success: false,
// 				Reason:  err.Error(),
// 			})
// 		}

// 		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
// 			Success:  true,
// 			Response: userOutput.AuthenticationResult,
// 		})
// 	}
// }
