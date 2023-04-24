package oauth

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/router/routes/auth"
	"github.com/junioryono/ProUML/backend/sdk"
)

func createStateToken(fbCtx *fiber.Ctx, sdkP *sdk.SDK) (string, error) {
	b := make([]byte, 16)
	rand.Read(b)
	oauthState := base64.URLEncoding.EncodeToString(b)

	if err := auth.SetCookie(fbCtx, auth.OAuthStateCookieName, oauthState); err != nil {
		return "", fbCtx.Status(fiber.StatusTemporaryRedirect).Redirect(sdkP.OAuth.FailureURL)
	}

	return oauthState, nil
}

func validateStateToken(fbCtx *fiber.Ctx, sdkP *sdk.SDK) error {
	fmt.Println("validateStateToken", fbCtx.Cookies(auth.OAuthStateCookieName), fbCtx.FormValue("state"))
	if fbCtx.FormValue("state") != fbCtx.Cookies(auth.OAuthStateCookieName) {
		fmt.Println("validateStateToken state not the same")
		return fbCtx.Status(fiber.StatusTemporaryRedirect).Redirect(sdkP.OAuth.FailureURL)
	}

	if err := auth.DeleteCookie(fbCtx, auth.OAuthStateCookieName); err != nil {
		fmt.Println("validateStateToken err", err)
		return fbCtx.Status(fiber.StatusTemporaryRedirect).Redirect(sdkP.OAuth.FailureURL)
	}

	return nil
}

func getUserFromIdentityProvider(fbCtx *fiber.Ctx, sdkP *sdk.SDK, id, email, fullName string) error {
	_, idToken, refreshToken, err := sdkP.Postgres.Auth.Admin.GetUserFromIdentityProvider(fbCtx.IP(), id, email, fullName)
	if err != nil {
		return fbCtx.Status(fiber.StatusTemporaryRedirect).Redirect(sdkP.OAuth.FailureURL)
	}

	if err := auth.SetCookie(fbCtx, auth.IdTokenCookieName, idToken); err != nil {
		return fbCtx.Status(fiber.StatusTemporaryRedirect).Redirect(sdkP.OAuth.FailureURL)
	}

	if err := auth.SetCookie(fbCtx, auth.RefreshTokenCookieName, refreshToken); err != nil {
		return fbCtx.Status(fiber.StatusTemporaryRedirect).Redirect(sdkP.OAuth.FailureURL)
	}

	return fbCtx.Status(fiber.StatusTemporaryRedirect).Redirect(sdkP.OAuth.CallbackSuccessURL)
}
