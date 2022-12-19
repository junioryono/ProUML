package main

import (
	"github.com/joho/godotenv"
	"github.com/junioryono/ProUML/backend/router"
	"github.com/junioryono/ProUML/backend/sdk"
)

func main() {
	godotenv.Load(".env")

	sdkP, err := sdk.Init()
	if err != nil {
		panic(err)
	}

	router.Init(sdkP)
}
