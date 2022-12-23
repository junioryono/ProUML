package ses

import (
	"errors"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
)

type SES_SDK struct {
	Client *ses.SES
	ARN    string
}

func Init() (*SES_SDK, error) {
	Region := os.Getenv("AWS_REGION")
	AccessKeyID := os.Getenv("AWS_ACCESS_KEY_ID")
	SecretAccessKey := os.Getenv("AWS_SECRET_ACCESS_KEY")
	ARN := os.Getenv("SES_ARN")

	if Region == "" {
		return nil, errors.New("region is empty")
	}

	if AccessKeyID == "" {
		return nil, errors.New("access key id is empty")
	}

	if SecretAccessKey == "" {
		return nil, errors.New("secret access key is empty")
	}

	if ARN == "" {
		return nil, errors.New("ses arn is empty")
	}

	conf := &aws.Config{Region: aws.String(Region)}
	sess, err := session.NewSession(conf)
	if err != nil {
		return nil, err
	}

	return &SES_SDK{
		Client: ses.New(sess),
		ARN:    ARN,
	}, nil
}
