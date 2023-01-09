package main

import (
	"github.com/joho/godotenv"
	"github.com/junioryono/ProUML/backend/router"
	"github.com/junioryono/ProUML/backend/sdk"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		panic(err)
	}

	sdkP, err := sdk.Init()
	if err != nil {
		panic(err)
	}

	router.Init(sdkP)
}
