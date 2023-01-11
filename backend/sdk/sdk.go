package sdk

import (
	"github.com/junioryono/ProUML/backend/sdk/oauth"
	"github.com/junioryono/ProUML/backend/sdk/postgres"
	"github.com/junioryono/ProUML/backend/sdk/redis"
	"github.com/junioryono/ProUML/backend/sdk/ses"
)

type SDK struct {
	OAuth    *oauth.OAuth_SDK
	Postgres *postgres.Postgres_SDK
	Redis    *redis.Redis_SDK
}

func Init() (*SDK, error) {
	OAuth, err := oauth.Init()
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
		OAuth:    OAuth,
		Postgres: Postgres,
		Redis:    Redis,
	}, nil
}
