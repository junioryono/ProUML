package auth

import (
	"errors"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
)

var (
	Production             = os.Getenv("NODE_ENV") == "production"
	IdTokenCookieName      = "id_token"
	RefreshTokenCookieName = "refresh_token"
	idTokenTime            = time.Now().Add(7 * 24 * time.Hour)
	refreshTokenTime       = time.Now().Add(30 * 24 * time.Hour)
)

func SetCookie(fbCtx *fiber.Ctx, name, value string) error {
	cookie := &fiber.Cookie{
		Name:     name,
		Value:    value,
		HTTPOnly: true,
	}

	if name == IdTokenCookieName {
		cookie.Expires = idTokenTime
	} else if name == RefreshTokenCookieName {
		cookie.Expires = refreshTokenTime
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
