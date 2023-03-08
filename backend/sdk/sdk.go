package sdk

import (
	"os"
	"os/signal"
	"sync"
	"syscall"

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

	sdk := &SDK{
		OAuth:    OAuth,
		Postgres: Postgres,
		Redis:    Redis,
	}

	go sdk.gracefulShutdown()

	return sdk, nil
}

func (s *SDK) gracefulShutdown() {
	cancelChan := make(chan os.Signal, 1)
	signal.Notify(cancelChan, syscall.SIGTERM, syscall.SIGINT)
	<-cancelChan

	var wg sync.WaitGroup

	wg.Add(1)
	go func() {
		defer wg.Done()
		s.Postgres.Shutdown()
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		s.Redis.Shutdown()
	}()

	wg.Wait()
	os.Exit(0)
}
