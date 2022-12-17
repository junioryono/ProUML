package main

import (
	"os"

	"github.com/joho/godotenv"
	"github.com/junioryono/ProUML/backend/auth"
	"github.com/junioryono/ProUML/backend/router"
)

func main() {
	godotenv.Load(".env")

	UserPoolID := os.Getenv("COGNITO_USER_POOL_ID")
	AppClientID := os.Getenv("COGNITO_APP_CLIENT_ID")
	AppClientSecret := os.Getenv("COGNITO_APP_CLIENT_SECRET")

	cognito, err := auth.Init(UserPoolID, AppClientID, AppClientSecret)
	if err != nil {
		panic(err)
	}

	router.Init(*cognito)
}
