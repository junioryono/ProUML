package oauth

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/google/go-github/github"
	"github.com/junioryono/ProUML/backend/sdk"
)

func GitHubCallback(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		if err := validateStateToken(fbCtx, sdkP); err != nil {
			return err
		}

		token, err := sdkP.OAuth.GitHub.Exchange(context.Background(), fbCtx.FormValue("code"))
		if err != nil {
			return fbCtx.Status(fiber.StatusTemporaryRedirect).Redirect(sdkP.OAuth.FailureURL)
		}

		oauthClient := sdkP.OAuth.GitHub.Client(context.Background(), token)
		client := github.NewClient(oauthClient)
		user, _, err := client.Users.Get(context.Background(), "")
		if err != nil {
			return fbCtx.Status(fiber.StatusTemporaryRedirect).Redirect(sdkP.OAuth.FailureURL)
		}

		return getUserFromIdentityProvider(fbCtx, sdkP, user.GetEmail(), user.GetName())
	}
}
