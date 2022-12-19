package sdk

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	cognito "github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go/service/ses"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/lestrrat-go/jwx/jwk"
)

type AWS_SDK struct {
	SES             *ses.SES
	Cognito         *cognito.CognitoIdentityProvider
	UserPoolID      string
	AppClientID     string
	AppClientSecret string
	JWTPublicKeySet jwk.Set
}

func initAWS() (*AWS_SDK, error) {
	Region := os.Getenv("AWS_REGION")
	AccessKeyID := os.Getenv("AWS_ACCESS_KEY_ID")
	SecretAccessKey := os.Getenv("AWS_SECRET_ACCESS_KEY")
	UserPoolID := os.Getenv("COGNITO_USER_POOL_ID")
	AppClientID := os.Getenv("COGNITO_APP_CLIENT_ID")
	AppClientSecret := os.Getenv("COGNITO_APP_CLIENT_SECRET")

	if Region == "" {
		return nil, errors.New("region is empty")
	}

	if AccessKeyID == "" {
		return nil, errors.New("access key id is empty")
	}

	if SecretAccessKey == "" {
		return nil, errors.New("secret access key is empty")
	}

	if UserPoolID == "" {
		return nil, errors.New("user pool id is empty")
	}

	if AppClientID == "" {
		return nil, errors.New("app client id is empty")
	}

	if AppClientSecret == "" {
		return nil, errors.New("app client secret is empty")
	}

	conf := &aws.Config{Region: aws.String(Region)}
	sess, err := session.NewSession(conf)
	if err != nil {
		return nil, err
	}

	JWTPublicKeysURL := "https://cognito-idp." + Region + ".amazonaws.com/" + UserPoolID + "/.well-known/jwks.json"
	JWTPublicKeySet, err := jwk.Fetch(context.Background(), JWTPublicKeysURL)
	if err != nil {
		return nil, err
	}

	return &AWS_SDK{
		SES:             ses.New(sess),
		Cognito:         cognito.New(sess),
		UserPoolID:      UserPoolID,
		AppClientID:     AppClientID,
		AppClientSecret: AppClientSecret,
		JWTPublicKeySet: JWTPublicKeySet,
	}, nil
}

// Login user and set cookies
func (awsSDK AWS_SDK) Login(fbCtx *fiber.Ctx, email, password string) (*cognito.AdminInitiateAuthOutput, error) {
	if email == "" || password == "" {
		return nil, errors.New("email or password not provided")
	}

	user, err := awsSDK.Cognito.AdminInitiateAuth(&cognito.AdminInitiateAuthInput{
		AuthFlow:   aws.String(cognito.AuthFlowTypeAdminUserPasswordAuth),
		ClientId:   aws.String(awsSDK.AppClientID),
		UserPoolId: aws.String(awsSDK.UserPoolID),
		AuthParameters: map[string]*string{
			"SECRET_HASH": aws.String(awsSDK.ComputeSecretHash(email)),
			"USERNAME":    aws.String(email),
			"PASSWORD":    aws.String(password),
		},
	})

	if err != nil {
		return nil, err
	}

	// Store id token in http only cookie
	fbCtx.Cookie(&fiber.Cookie{
		Name:  "id_token",
		Value: *user.AuthenticationResult.IdToken,
		// Domain:   "prouml.com", // TODO remove this
		Expires:  time.Now().Add(7 * 24 * time.Hour),
		HTTPOnly: true,
		// Secure:   true, // TODO remove this
	})

	// Store refresh token in http only cookie
	fbCtx.Cookie(&fiber.Cookie{
		Name:  "refresh_token",
		Value: *user.AuthenticationResult.RefreshToken,
		// Domain:   "prouml.com", // TODO remove this
		Expires:  time.Now().Add(30 * 24 * time.Hour),
		HTTPOnly: true,
		// Secure:   true, // TODO remove this
	})

	return user, nil
}

// Refresh id token and set new cookie
func (awsSDK AWS_SDK) RefreshIdToken(fbCtx *fiber.Ctx, refreshToken string) (*cognito.AdminInitiateAuthOutput, error) {
	if refreshToken == "" {
		return nil, errors.New("id token or refresh token not provided")
	}

	claims, err := awsSDK.ParseClaims(refreshToken)
	if err != nil {
		return nil, err
	}

	user, err := awsSDK.Cognito.AdminInitiateAuth(&cognito.AdminInitiateAuthInput{
		AuthFlow:   aws.String(cognito.AuthFlowTypeRefreshTokenAuth),
		ClientId:   aws.String(awsSDK.AppClientID),
		UserPoolId: aws.String(awsSDK.UserPoolID),
		AuthParameters: map[string]*string{
			"SECRET_HASH":   aws.String(awsSDK.ComputeSecretHash(claims["sub"].(string))),
			"REFRESH_TOKEN": aws.String(refreshToken),
		},
	})

	if err != nil {
		return nil, err
	}

	// Store id token in http only cookie
	fbCtx.Cookie(&fiber.Cookie{
		Name:  "id_token",
		Value: *user.AuthenticationResult.IdToken,
		// Domain:   "prouml.com", // TODO remove this
		Expires:  time.Now().Add(7 * 24 * time.Hour),
		HTTPOnly: true,
		// Secure:   true, // TODO remove this
	})

	return user, nil
}

func (awsSDK AWS_SDK) ParseClaims(tokenString string) (jwt.MapClaims, error) {
	claims := jwt.MapClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		// Verify if the token was signed with correct signing method
		// AWS Cognito is using RSA256 in my case
		_, ok := token.Method.(*jwt.SigningMethodRSA)
		if !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		// Get "kid" value from token header
		// "kid" is shorthand for Key ID
		kid, ok := token.Header["kid"].(string)
		if !ok {
			return nil, errors.New("kid header not found")
		}

		// "kid" must be present in the public keys set
		key, ok := awsSDK.JWTPublicKeySet.LookupKeyID(kid)
		if !ok {
			return nil, fmt.Errorf("key %v not found", kid)
		}

		// Return token key as []byte{string} type
		var tokenKey interface{}
		if err := key.Raw(&tokenKey); err != nil {
			return nil, errors.New("failed to create token key")
		}

		return tokenKey, nil
	})

	// Check if there was an error while parsing token
	if err != nil {
		return nil, err
	}

	// Check if token is valid
	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	// Check if token is expired
	if err := claims.Valid(); err != nil {
		return nil, err
	}

	return claims, nil
}

func (awsSDK AWS_SDK) ComputeSecretHash(username string) string {
	mac := hmac.New(sha256.New, []byte(awsSDK.AppClientSecret))
	mac.Write([]byte(username + awsSDK.AppClientID))

	return base64.StdEncoding.EncodeToString(mac.Sum(nil))
}
