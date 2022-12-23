package jwk

import (
	"crypto/rsa"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/types"
)

func (jwkSDK *JWK_SDK) CreateUserIdToken(user types.UserModel) (string, error) {
	return jwkSDK.createUserToken(user, time.Now().Add(time.Hour*10).Unix(), true)
}

func (jwkSDK *JWK_SDK) CreateUserRefreshToken(user types.UserModel) (string, error) {
	return jwkSDK.createUserToken(user, time.Now().Add(time.Hour*24*365).Unix(), false)
}

func (jwkSDK *JWK_SDK) createUserToken(user types.UserModel, exp int64, includeUserMetadata bool) (string, error) {
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
	// Print the JWT ID
	fmt.Println("JWT ID: \n", jwkSDK.JWT.ID)
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

	// Print all JWK Ids in the JWK set using JWKs.Iterate()
	for i := 0; i < jwkSDK.JWKs.Len(); i++ {
		jwkM, _ := jwkSDK.JWKs.Get(i)
		fmt.Printf("JWK ID: %s\n", jwkM.KeyID())
	}

	// Parse the JWT token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Check the signing method
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		// Print the token header
		fmt.Printf("Token Header: %v\n", token.Header)

		// Get the key ID from the JWT token
		keyID, ok := token.Header["kid"].(string)
		// Print the key ID
		fmt.Printf("Actual Key ID: %s\n", keyID)
		if !ok {
			return nil, errors.New("no kid claim in token header")
		}

		if key, ok := jwkSDK.JWKs.LookupKeyID(keyID); ok {
			fmt.Printf("Key ID FOUND: %s\n", key.KeyID())
			var result rsa.PublicKey
			err := key.Raw(&result)
			if err != nil {
				fmt.Printf("hellllooeeeed: %s\n", err.Error())
				return nil, err
			}
			fmt.Printf("Key: %v\n", result)
			return &result, nil
		}

		return nil, errors.New("unable to find key")

	})
	if err != nil {
		fmt.Printf("helllloo\n")
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
