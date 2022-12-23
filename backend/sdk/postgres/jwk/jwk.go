package jwk

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/types"
	"github.com/lestrrat-go/jwx/jwk"
	"gorm.io/gorm"
)

func (jwkSDK *JWK_SDK) GetSet() (jwk.Set, error) {
	// Get the JWT models from the database
	var jwt []types.JWTModel
	err := jwkSDK.db.Find(&jwt).Error
	if err != nil {
		return nil, err
	}

	// Print the length of the JWT models
	fmt.Printf("%d JWT models found\n", len(jwt))

	// If jwkSDK.JWKs is null, create a new JWK set
	if jwkSDK.JWKs == nil {
		jwkSDK.JWKs = jwk.NewSet()
	}

	// Add the public keys to the JWK set
	for _, j := range jwt {
		err := jwkSDK.addJWTToSet(j)

		if err != nil {
			return nil, err
		}
	}

	return jwkSDK.JWKs, nil
}

// Add the new JWT token to the JWK set
func (jwkSDK *JWK_SDK) addJWTToSet(token types.JWTModel) error {
	publicKey, err := x509.ParsePKCS1PublicKey(token.PublicKey)
	if err != nil {
		return err
	}

	// Convert the public key to a JWK
	jwkM, err := jwk.New(publicKey)
	if err != nil {
		return err
	}

	// Set the key ID
	jwkM.Set(jwk.KeyIDKey, token.ID)

	// Add the JWK to the JWK set
	jwkSDK.JWKs.Add(jwkM)

	return nil
}

// Do this in a transaction:
// Create a new JWT token
// Get the currently active jwt token from the database and set it to inactive
// Save the new JWT token to the database
// Add the new JWT token to the JWK set
func (jwkSDK *JWK_SDK) rotateJWT() error {
	if _, err := jwkSDK.getActiveJWT(); err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	// Create a new JWT token
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return err
	}

	// Create a new JWT model
	jwtModel := types.JWTModel{
		ID:             uuid.New().String(),
		PrivateKey:     x509.MarshalPKCS1PrivateKey(privateKey),
		PublicKey:      x509.MarshalPKCS1PublicKey(&privateKey.PublicKey),
		PrivateKeyCert: privateKey,
		PublicKeyCert:  &privateKey.PublicKey,
	}

	// Save the new JWT token to the database
	result := jwkSDK.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&jwtModel).Error; err != nil {
			return err
		}

		if jwkSDK.JWT != nil {
			jwkSDK.JWT.Active = false
			if err := tx.Save(jwkSDK.JWT).Error; err != nil {
				return err
			}
		}

		return nil
	})
	if result != nil {
		return result
	}

	// Add the new JWT token to the JWK set
	if err := jwkSDK.addJWTToSet(jwtModel); err != nil {
		return err
	}

	jwkSDK.JWT = &jwtModel

	return nil
}

// Get the currently active JWT token from the database
func (jwkSDK *JWK_SDK) getActiveJWT() (*types.JWTModel, error) {
	// Create a new JWT model
	jwtModel := &types.JWTModel{}

	// Get the currently active JWT token from the database
	result := jwkSDK.db.Where("active = ?", true).First(jwtModel)
	if result.Error != nil {
		return nil, result.Error
	}

	// Add certificate to the JWT model
	var err error
	jwtModel.PrivateKeyCert, err = x509.ParsePKCS1PrivateKey(jwtModel.PrivateKey)
	if err != nil {
		return nil, err
	}

	jwtModel.PublicKeyCert, err = x509.ParsePKCS1PublicKey(jwtModel.PublicKey)
	if err != nil {
		return nil, err
	}

	return jwtModel, nil
}

// Remove all JWT tokens from the database
func (jwkSDK *JWK_SDK) RemoveAllJWTs() error {
	// Remove all JWT tokens from the database
	return jwkSDK.db.Where("true = true").Delete(&types.JWTModel{}).Error
}
