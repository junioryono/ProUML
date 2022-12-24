package jwk

import (
	"crypto/rsa"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
)

func (jwkSDK *JWK_SDK) CreateUserIdToken(user models.UserModel) (string, error) {
	return jwkSDK.createUserToken(user, time.Now().Add(time.Hour*10).Unix(), true)
}

func (jwkSDK *JWK_SDK) CreateUserRefreshToken(user models.UserModel) (string, error) {
	return jwkSDK.createUserToken(user, time.Now().Add(time.Hour*24*365).Unix(), false)
}

func (jwkSDK *JWK_SDK) createUserToken(user models.UserModel, exp int64, includeUserMetadata bool) (string, error) {
	claims := jwt.MapClaims{
		"sub": user.ID,
		"iss": "https://api.prouml.com",
		"aud": "https://api.prouml.com",
		"jti": uuid.New().String(),
		"iat": time.Now().Unix(),
		"exp": exp,
	}

	if includeUserMetadata {
		claims["user_metadata"] = user
	}

	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	token.Header["kid"] = jwkSDK.JWT.ID
	token.Header["jku"] = "https://api.prouml.com/.well-known/jwks.json"

	signedToken, err := token.SignedString(jwkSDK.JWT.PrivateKeyCert)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

// Parse and verify the JWT token from the JWK set
func (jwkSDK *JWK_SDK) ParseClaims(tokenString string) (jwt.MapClaims, error) {
	// Parse the JWT token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Check the signing method
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		// Get the key ID from the JWT token
		keyID, ok := token.Header["kid"].(string)
		if !ok {
			return nil, errors.New("no kid claim in token header")
		}

		if key, ok := jwkSDK.JWKs.LookupKeyID(keyID); ok {
			var result rsa.PublicKey
			err := key.Raw(&result)
			if err != nil {
				return nil, err
			}
			return &result, nil
		}

		return nil, errors.New("unable to find key")

	})
	if err != nil {
		return nil, err
	}

	// Check the JWT token
	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	// Check if the JWT is expired
	if token.Claims.(jwt.MapClaims)["exp"].(float64) < float64(time.Now().Unix()) {
		return nil, errors.New("token expired")
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		if ok := claims.VerifyIssuer("https://api.prouml.com", true); !ok {
			return nil, errors.New("invalid issuer")
		}

		// Check if token is not expired
		if ok := claims.VerifyExpiresAt(time.Now().Unix(), true); !ok {
			return nil, errors.New("token expired")
		}

		return claims, nil
	}

	return nil, errors.New("invalid token")
}
