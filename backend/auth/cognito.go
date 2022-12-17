package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"errors"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	cognito "github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
)

type Cognito struct {
	CognitoClient   *cognito.CognitoIdentityProvider
	UserPoolID      string
	AppClientID     string
	AppClientSecret string
}

func Init(UserPoolID, AppClientID, AppClientSecret string) (*Cognito, error) {
	if UserPoolID == "" {
		return nil, errors.New("user pool id is empty")
	}

	if AppClientID == "" {
		return nil, errors.New("app client id is empty")
	}

	if AppClientSecret == "" {
		return nil, errors.New("app client secret is empty")
	}

	conf := &aws.Config{Region: aws.String("us-west-2")}
	sess, err := session.NewSession(conf)
	if err != nil {
		return nil, err
	}

	return &Cognito{
		CognitoClient:   cognito.New(sess),
		UserPoolID:      UserPoolID,
		AppClientID:     AppClientID,
		AppClientSecret: AppClientSecret,
	}, nil
}

func (cgn Cognito) ComputeSecretHash(username string) string {
	mac := hmac.New(sha256.New, []byte(cgn.AppClientSecret))
	mac.Write([]byte(username + cgn.AppClientID))

	return base64.StdEncoding.EncodeToString(mac.Sum(nil))
}
