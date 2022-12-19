package auth

import (
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	cognito "github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go/service/ses"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func Register(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		email := fbCtx.FormValue("email")
		password := fbCtx.FormValue("password")

		firstName := fbCtx.FormValue("first_name")
		lastName := fbCtx.FormValue("last_name")

		if email == "" {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  "email is empty",
			})
		}

		if password == "" {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  "password is empty",
			})
		}

		secretHash := sdkP.AWS.ComputeSecretHash(email)

		// Register user
		_, err := sdkP.AWS.Cognito.SignUp(&cognito.SignUpInput{
			Username:   aws.String(email),
			Password:   aws.String(password),
			ClientId:   aws.String(sdkP.AWS.AppClientID),
			SecretHash: aws.String(secretHash),
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
		})
		if err != nil {
			if awsErr, ok := err.(awserr.Error); ok {
				return fbCtx.Status(fiber.StatusConflict).JSON(types.Status{
					Success: false,
					Reason:  awsErr.Message(),
				})
			}

			return fbCtx.Status(fiber.StatusConflict).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		sdkP.AWS.Cognito.AdminConfirmSignUp(&cognito.AdminConfirmSignUpInput{
			UserPoolId: &sdkP.AWS.UserPoolID,
			Username:   &email,
		})

		_, err = sdkP.AWS.Login(fbCtx, email, password)
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

		go generateStoreAndEmailVerificationCode(sdkP, email)

		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success: true,
		})
	}
}

func generateStoreAndEmailVerificationCode(sdkP *sdk.SDK, email string) {
	var (
		// Replace sender@example.com with your "From" address.
		// This address must be verified with Amazon SES.
		Sender = "no-reply@prouml.com"

		// The subject line for the email.
		Subject = "Your verification code"

		//The email body for recipients with non-HTML email clients.
		TextBody = "This email was sent with Amazon SES using the AWS SDK for Go."

		// The character encoding for the email.
		CharSet = "UTF-8"

		// Generate a verification code and store it in redis
		verificationCode = uuid.New()

		// The HTML body for the email.
		HtmlBody = "Click <a href=\"https://prouml.com/verify/" + verificationCode.String() + "\">here</a> to verify your email."
	)

	go func() {
		sdkP.Redis.Client.SetNX(sdkP.Redis.Context, verificationCode.String(), email, 7*24*time.Hour)
	}()

	// Send the verification code to the user's email
	sdkP.AWS.SES.SendEmail(&ses.SendEmailInput{
		ReturnPathArn: aws.String("arn:aws:ses:us-west-2:651200794168:identity/prouml.com"),
		ReturnPath:    aws.String(Sender),
		Source:        aws.String(Sender),
		Destination: &ses.Destination{
			CcAddresses: []*string{},
			ToAddresses: []*string{
				aws.String(email),
			},
		},
		Message: &ses.Message{
			Body: &ses.Body{
				Html: &ses.Content{
					Charset: aws.String(CharSet),
					Data:    aws.String(HtmlBody),
				},
				Text: &ses.Content{
					Charset: aws.String(CharSet),
					Data:    aws.String(TextBody),
				},
			},
			Subject: &ses.Content{
				Charset: aws.String(CharSet),
				Data:    aws.String(Subject),
			},
		},
	})
}
