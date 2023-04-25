package sendgrid

import (
	"github.com/junioryono/ProUML/backend/types"
	"github.com/sendgrid/rest"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

func (sendgridSDK *SendGrid_SDK) SendEmail(SenderName, SenderEmail, Subject, ToAddressName, ToAddressEmail, TextBody, HtmlBody string) (*rest.Response, *types.WrappedError) {
	var (
		Sender    = mail.NewEmail(SenderName, SenderEmail)
		ToAddress = mail.NewEmail(ToAddressName, ToAddressEmail)
	)

	message := mail.NewSingleEmail(Sender, Subject, ToAddress, TextBody, HtmlBody)
	response, err := sendgridSDK.client.Send(message)
	if err != nil {
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	return response, nil
}
