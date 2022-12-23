package sdk

import (
	"github.com/junioryono/ProUML/backend/sdk/auth0"
	"github.com/junioryono/ProUML/backend/sdk/postgres"
	"github.com/junioryono/ProUML/backend/sdk/redis"
	"github.com/junioryono/ProUML/backend/sdk/ses"
)

type SDK struct {
	Auth0    *auth0.Auth0_SDK
	Postgres *postgres.Postgres_SDK
	Redis    *redis.Redis_SDK
}

func Init() (*SDK, error) {
	Auth0, err := auth0.Init()
	if err != nil {
		return nil, err
	}

	SES, err := ses.Init()
	if err != nil {
		return nil, err
	}

	Postgres, err := postgres.Init(SES)
	if err != nil {
		return nil, err
	}

	Redis, err := redis.Init()
	if err != nil {
		return nil, err
	}

	return &SDK{
		Auth0:    Auth0,
		Postgres: Postgres,
		Redis:    Redis,
	}, nil
}
