package sdk

import (
	"github.com/junioryono/ProUML/backend/sdk/postgres"
	"github.com/junioryono/ProUML/backend/sdk/redis"
	"github.com/junioryono/ProUML/backend/sdk/ses"
)

type SDK struct {
	Postgres *postgres.Postgres_SDK
	Redis    *redis.Redis_SDK
}

func Init() (*SDK, error) {
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
		Postgres: Postgres,
		Redis:    Redis,
	}, nil
}
