package auth

import (
	"errors"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk/postgres/jwk"
)

var (
	Production             = os.Getenv("NODE_ENV") == "production"
	IdTokenCookieName      = "id_token"
	RefreshTokenCookieName = "refresh_token"
	OAuthStateCookieName   = "oauthstate"
	oauthStateTime         = time.Now().Add(365 * 24 * time.Hour)
)

func SetCookie(fbCtx *fiber.Ctx, name, value string) error {
	cookie := &fiber.Cookie{
		Name:     name,
		Value:    value,
		HTTPOnly: true,
	}

	if name == IdTokenCookieName {
		cookie.Expires = jwk.IdTokenTime
	} else if name == RefreshTokenCookieName {
		cookie.Expires = jwk.RefreshTokenTime
	} else if name == OAuthStateCookieName {
		cookie.Expires = oauthStateTime
	} else {
		return errors.New("invalid cookie name")
	}

	if Production {
		cookie.Domain = "prouml.com"
		cookie.Secure = true
		cookie.SameSite = "Strict"
		cookie.Path = "/"
	}

	fbCtx.Cookie(cookie)
	return nil
}

func DeleteCookie(fbCtx *fiber.Ctx, name string) error {
	cookie := &fiber.Cookie{
		Name:     name,
		Value:    "",
		Expires:  time.Now(),
		HTTPOnly: true,
	}

	if Production {
		cookie.Domain = "prouml.com"
		cookie.Secure = true
		cookie.SameSite = "Strict"
		cookie.Path = "/"
	}

	fbCtx.Cookie(cookie)
	return nil
}
