package sendgrid

import (
	"errors"
	"os"

	"github.com/sendgrid/sendgrid-go"
)

type SendGrid_SDK struct {
	client *sendgrid.Client
}

func Init() (*SendGrid_SDK, error) {
	APIKey := os.Getenv("SENDGRID_API_KEY")
	if APIKey == "" {
		return nil, errors.New("api key is empty")
	}

	return &SendGrid_SDK{
		client: sendgrid.NewSendClient(APIKey),
	}, nil
}
