package oauth

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/url"

	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
)

func GoogleCallback(sdkP *sdk.SDK) fiber.Handler {
	const oauthGoogleUrlAPI = "https://www.googleapis.com/oauth2/v2/userinfo?access_token="

	return func(fbCtx *fiber.Ctx) error {
		if err := validateStateToken(fbCtx, sdkP); err != nil {
			return err
		}

		token, err := sdkP.OAuth.Google.Exchange(context.Background(), fbCtx.FormValue("code"))
		if err != nil {
			return fbCtx.Status(fiber.StatusTemporaryRedirect).Redirect(sdkP.OAuth.FailureURL)
		}

		oauthClient := sdkP.OAuth.Google.Client(context.Background(), token)
		response, err := oauthClient.Do(&http.Request{
			Method: http.MethodGet,
			URL:    &url.URL{Path: oauthGoogleUrlAPI + token.AccessToken},
		})
		if err != nil {
			return fbCtx.Status(fiber.StatusTemporaryRedirect).Redirect(sdkP.OAuth.FailureURL)
		}
		defer response.Body.Close()

		user := struct {
			Email string `json:"email"`
			Name  string `json:"name"`

			Error string `json:"error"`
		}{}
		if err := json.NewDecoder(response.Body).Decode(&user); err != nil && err != io.EOF {
			return fbCtx.Status(fiber.StatusTemporaryRedirect).Redirect(sdkP.OAuth.FailureURL)
		}

		if user.Error != "" {
			return fbCtx.Status(fiber.StatusTemporaryRedirect).Redirect(sdkP.OAuth.FailureURL)
		}

		return getUserFromIdentityProvider(fbCtx, sdkP, user.Email, user.Name)
	}
}
