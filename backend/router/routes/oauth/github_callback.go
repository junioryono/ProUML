package oauth

import (
	"context"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/google/go-github/github"
	"github.com/junioryono/ProUML/backend/router/routes/auth"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/types"
)

func GitHubCallback(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		// Read oauthState from Cookie
		if fbCtx.FormValue("state") != fbCtx.Cookies(auth.OAuthStateCookieName) {
			return fbCtx.Status(fiber.StatusTemporaryRedirect).Redirect("https://prouml.com")
		}

		token, err := githubOAuthConfig.Exchange(context.Background(), fbCtx.FormValue("code"))
		if err != nil {
			return fbCtx.Status(fiber.StatusTemporaryRedirect).Redirect("https://prouml.com")
		}

		oauthClient := githubOAuthConfig.Client(context.Background(), token)
		client := github.NewClient(oauthClient)
		user, _, err := client.Users.Get(context.Background(), "")
		if err != nil {
			return fbCtx.Status(fiber.StatusTemporaryRedirect).Redirect("https://prouml.com")
		}

		if err := auth.DeleteCookie(fbCtx, auth.OAuthStateCookieName); err != nil {
			return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		fmt.Printf("User: %v", user)

		return fbCtx.Status(fiber.StatusTemporaryRedirect).Redirect("https://prouml.com/dashboard/diagrams")
	}
}
