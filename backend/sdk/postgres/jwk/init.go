package jwk

import (
	"github.com/junioryono/ProUML/backend/sdk/types"
	"github.com/lestrrat-go/jwx/jwk"
	"gorm.io/gorm"
)

type JWK_SDK struct {
	db   *gorm.DB
	JWT  *types.JWTModel
	JWKs jwk.Set
}

func Init(db *gorm.DB) (*JWK_SDK, error) {
	// Remove all JWTs from the database
	// p.JWK_RemoveAllJWTs()

	// Create a new JWT
	j := &JWK_SDK{db: db}

	// Set the JWK set
	if _, err := j.GetSet(); err != nil {
		return nil, err
	}

	if err := j.rotateJWT(); err != nil {
		return nil, err
	}

	return j, nil
}
