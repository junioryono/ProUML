package sdk

import (
	"context"
	"errors"
	"os"

	"github.com/go-redis/redis/v9"
)

type Redis_SDK struct {
	Client  *redis.Client
	Context context.Context
}

func initRedis() (*Redis_SDK, error) {
	Username := os.Getenv("REDIS_USERNAME")
	Password := os.Getenv("REDIS_PASSWORD")
	Host := os.Getenv("REDIS_HOST")
	Port := os.Getenv("REDIS_PORT")

	if Username == "" {
		return nil, errors.New("redis username is empty")
	}

	if Password == "" {
		return nil, errors.New("redis password is empty")
	}

	if Host == "" {
		return nil, errors.New("redis host is empty")
	}

	if Port == "" {
		return nil, errors.New("redis port is empty")
	}

	t, err := redis.ParseURL("rediss://default:AVNS_ATgD0ccu3JaGmrWSzHf@db-redis-sfo3-32384-do-user-2346086-0.b.db.ondigitalocean.com:25061")
	if err != nil {
		return nil, err
	}

	r := &Redis_SDK{
		Client:  redis.NewClient(t),
		Context: context.Background(),
	}

	if r.Client == nil {
		return nil, errors.New("could not initialize redis client")
	}

	return r, nil
}
