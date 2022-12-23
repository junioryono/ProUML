package redis

import (
	"context"
	"errors"
	"fmt"
	"os"

	"github.com/go-redis/redis/v9"
)

type Redis_SDK struct {
	Client  *redis.Client
	Context context.Context
}

func Init() (*Redis_SDK, error) {
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

	t, err := redis.ParseURL(fmt.Sprintf("rediss://%s:%s@%s:%s", Username, Password, Host, Port))
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
