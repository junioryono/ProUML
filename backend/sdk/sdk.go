package sdk

type SDK struct {
	AWS   *AWS_SDK
	Redis *Redis_SDK
}

func Init() (*SDK, error) {
	AWS, err := initAWS()
	if err != nil {
		return nil, err
	}

	Redis, err := initRedis()
	if err != nil {
		return nil, err
	}

	return &SDK{
		AWS:   AWS,
		Redis: Redis,
	}, nil
}
