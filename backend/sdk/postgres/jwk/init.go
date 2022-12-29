package jwk

import (
	"errors"

	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/lestrrat-go/jwx/jwk"
	"gorm.io/gorm"
)

type JWK_SDK struct {
	JWT     *models.JWTModel
	JWKs    jwk.Set
	db      *gorm.DB
	cluster *models.ClusterModel
}

func Init(db *gorm.DB, dsn string, cluster *models.ClusterModel) (*JWK_SDK, error) {
	// Create a new JWT_SDK
	j := &JWK_SDK{
		db:      db,
		cluster: cluster,
	}

	// // Remove all JWTs from the database
	// j.RemoveAllJWTs()
	// time.Sleep(3 * time.Second)

	// Set the JWK set
	if _, err := j.GetSet(); err != nil {
		return nil, err
	}

	// Get the active JWT
	if _, err := j.GetActiveJWT(); err != nil {
		if err == gorm.ErrRecordNotFound {
			if j.cluster.Master {
				// Create a new JWT if there is not an active JWT
				if err := j.SetNewJWT(); err != nil {
					return nil, err
				}

				goto next
			} else {
				return nil, errors.New("no active JWT found and this cluster is not the master")
			}
		}

		return nil, err
	}

next:
	if j.cluster.Master {
		go j.triggerJWTUpdates()
	} else {
		go j.listenForJWTUpdates(dsn)
	}

	return j, nil
}
