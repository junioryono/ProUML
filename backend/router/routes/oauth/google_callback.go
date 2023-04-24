package oauth

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"

	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
)

func GoogleCallback(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		if err := validateStateToken(fbCtx, sdkP); err != nil {
			return err
		}

		token, err := sdkP.OAuth.Google.Exchange(context.Background(), fbCtx.FormValue("code"))
		if err != nil {
			fmt.Println("err1", err)
			return fbCtx.Status(fiber.StatusTemporaryRedirect).Redirect(sdkP.OAuth.FailureURL)
		}

		oauthClient := sdkP.OAuth.Google.Client(context.Background(), token)
		response, err := oauthClient.Do(&http.Request{
			Method: http.MethodGet,
			URL: &url.URL{
				Scheme: "https",
				Host:   "www.googleapis.com",
				Path:   "/oauth2/v2/userinfo",
				RawQuery: url.Values{
					"access_token": []string{token.AccessToken},
				}.Encode(),
			},
		})
		if err != nil {
			fmt.Println("err2", err)
			return fbCtx.Status(fiber.StatusTemporaryRedirect).Redirect(sdkP.OAuth.FailureURL)
		}
		defer response.Body.Close()

		user := struct {
			ID    string `json:"id"`
			Email string `json:"email"`
			Name  string `json:"name"`
		}{}
		if err := json.NewDecoder(response.Body).Decode(&user); err != nil {
			fmt.Println("err3", err)
			return fbCtx.Status(fiber.StatusTemporaryRedirect).Redirect(sdkP.OAuth.FailureURL)
		}

		return getUserFromIdentityProvider(fbCtx, sdkP, user.ID, user.Email, user.Name)
	}
}
