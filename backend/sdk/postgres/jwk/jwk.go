package jwk

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/lestrrat-go/jwx/jwk"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

func (jwkSDK *JWK_SDK) GetSet() (jwk.Set, error) {
	// Get the JWT models from the database
	var jwt []models.JWTModel
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
func (jwkSDK *JWK_SDK) addJWTToSet(token models.JWTModel) error {
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

// Get the currently active JWT token from the database
func (jwkSDK *JWK_SDK) GetActiveJWT() (*models.JWTModel, error) {
	// Get the currently active JWT token from the database
	var jwt models.JWTModel
	err := jwkSDK.db.Where("active = true").First(&jwt).Error
	if err != nil {
		return nil, err
	}

	jwkSDK.JWT = &jwt
	return jwkSDK.JWT, nil
}

func (jwkSDK *JWK_SDK) SetNewJWT() error {
	// Create a new JWT token
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return err
	}

	// Create a new JWT model
	jwtModel := models.JWTModel{
		ID:             uuid.New().String(),
		PrivateKey:     x509.MarshalPKCS1PrivateKey(privateKey),
		PublicKey:      x509.MarshalPKCS1PublicKey(&privateKey.PublicKey),
		PrivateKeyCert: privateKey,
		PublicKeyCert:  &privateKey.PublicKey,
		Active:         true,
	}

	// Save the new JWT token to the database
	result := jwkSDK.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&jwtModel).Error; err != nil {
			return err
		}

		if jwkSDK.JWT != nil {
			// We already have a JWT token, so set it to inactive
			jwkSDK.JWT.Active = false
			if err := tx.Save(jwkSDK.JWT).Error; err != nil {
				return err
			}
		} else {
			// Get the currently active jwt token from the database and set it to inactive
			var jwt models.JWTModel
			if err := tx.Where("active = true AND id != ?", jwtModel.ID).First(&jwt).Error; err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return nil
				}

				return err
			}

			jwt.Active = false
			if err := tx.Save(&jwt).Error; err != nil {
				return err
			}
		}

		return nil
	})
	if result != nil {
		if jwkSDK.JWT != nil {
			jwkSDK.JWT.Active = true
		}

		return result
	}

	// Add the new JWT token to the JWK set
	if err := jwkSDK.addJWTToSet(jwtModel); err != nil {
		return err
	}

	// Set the new JWT token as the active token
	jwkSDK.JWT = &jwtModel

	return nil
}

// Remove all JWT tokens from the database
func (jwkSDK *JWK_SDK) RemoveAllJWTs() error {
	// Remove all JWT tokens from the database
	return jwkSDK.db.Where("true = true").Delete(&models.JWTModel{}).Error
}

func (jwkSDK *JWK_SDK) listenForJWTUpdates(dsn string) {
	// Create a listener using pq.NewListener for events
	listener := pq.NewListener(dsn, 10*time.Second, time.Minute, nil)

	// Listen for events
	if err := listener.Listen("jwt"); err != nil {
		return
	}

	// Listen for events
	go func() {
		for {
			// Wait for an event and get the data from it
			notification := <-listener.Notify

			if notification == nil || notification.Channel != "jwt" {
				continue
			}

			// Get the active JWT
			if _, err := jwkSDK.GetActiveJWT(); err != nil {
				continue
			}

			// The active JWT has been updated. Add it to the JWK set
			jwkSDK.addJWTToSet(*jwkSDK.JWT)
		}
	}()
}

func (jwkSDK *JWK_SDK) triggerJWTUpdates() {
	for {
		// Get the active JWT's creation time
		createdAt := jwkSDK.JWT.CreatedAt

		// Get the current time
		now := time.Now()

		// Get the difference between the current time and the JWT's creation time
		diff := now.Sub(createdAt)

		fmt.Printf("Waiting for %v\n", 1*time.Minute-diff)

		// // Wait for the difference to be 30 days
		// time.Sleep(30*24*time.Hour - diff)

		// Wait for the difference to be 1 minute
		time.Sleep(1*time.Minute - diff)

		if err := jwkSDK.SetNewJWT(); err != nil {
			fmt.Println("Error setting new JWT")
			fmt.Println(err)
		} else {
			fmt.Println("New JWT set")
		}
	}
}
