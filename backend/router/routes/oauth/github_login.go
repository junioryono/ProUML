package oauth

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/router/routes/auth"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/types"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
)

var githubOAuthConfig = &oauth2.Config{
	RedirectURL: "https://api.prouml.com/auth/github/callback",
	Scopes:      []string{"read:user", "user:email"},
	Endpoint:    github.Endpoint,
}

func GitHubLogin(sdkP *sdk.SDK) fiber.Handler {
	githubOAuthConfig.ClientID = os.Getenv("GITHUB_OAUTH_CLIENT_ID")
	githubOAuthConfig.ClientSecret = os.Getenv("GITHUB_OAUTH_CLIENT_SECRET")

	return func(fbCtx *fiber.Ctx) error {
		// Create oauthState cookie
		b := make([]byte, 16)
		rand.Read(b)
		oauthState := base64.URLEncoding.EncodeToString(b)

		// Print githubOAuthConfig.ClientID
		fmt.Println(githubOAuthConfig.ClientID)

		if err := auth.SetCookie(fbCtx, auth.OAuthStateCookieName, oauthState); err != nil {
			return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		u := githubOAuthConfig.AuthCodeURL(oauthState)
		return fbCtx.Status(fiber.StatusOK).Redirect(u)
	}
}
