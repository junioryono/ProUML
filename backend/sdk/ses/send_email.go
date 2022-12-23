package ses

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/ses"
)

// SendEmail function that will send an email using Amazon SES
func (sesSDK *SES_SDK) SendEmail(Sender, Subject, HtmlBody, TextBody string, ToAddresses, CcAddresses []string) (*ses.SendEmailOutput, error) {
	var (
		CharSet        = "UTF-8"
		awsCcAddresses = []*string{}
		awsToAddresses = []*string{}
	)

	for _, cc := range CcAddresses {
		awsCcAddresses = append(awsCcAddresses, aws.String(cc))
	}

	for _, to := range ToAddresses {
		awsToAddresses = append(awsToAddresses, aws.String(to))
	}

	return sesSDK.Client.SendEmail(&ses.SendEmailInput{
		ReturnPathArn: aws.String(""),
		ReturnPath:    aws.String(Sender),
		Source:        aws.String(Sender),
		Destination: &ses.Destination{
			CcAddresses: awsCcAddresses,
			ToAddresses: awsToAddresses,
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
