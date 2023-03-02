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
	getDb   func() *gorm.DB
	cluster *models.ClusterModel
}

func Init(getDb func() *gorm.DB, dsn string, cluster *models.ClusterModel) (*JWK_SDK, error) {
	// Create a new JWT_SDK
	j := &JWK_SDK{
		getDb:   getDb,
		cluster: cluster,
	}

	// // Remove all JWTs from the database
	// if err := db.Where("true = true").Delete(&models.JWTModel{}).Error; err != nil {
	// 	return nil, err
	// }
	// time.Sleep(3 * time.Second)

	// Set the JWK set
	if _, err := j.GetSet(); err != nil {
		return nil, err
	}

	// Get the active JWT
	if _, err := j.getActiveJWT(); err != nil {
		if err == gorm.ErrRecordNotFound {
			if j.cluster.Master {
				// Create a new JWT if there is not an active JWT
				if err := j.setNewJWT(); err != nil {
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
