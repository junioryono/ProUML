package oauth

import (
	"errors"
	"fmt"
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
	"golang.org/x/oauth2/google"
)

type OAuth_SDK struct {
	FailureURL         string
	CallbackSuccessURL string
	GitHub             *oauth2.Config
	Google             *oauth2.Config
}

const (
	// webDomain string = "http://127.0.0.1:3000"
	// apiDomain string = "http://127.0.0.1:5000"
	webDomain string = "https://prouml.com"
	apiDomain string = "https://api.prouml.com"
)

func Init() (*OAuth_SDK, error) {
	response := &OAuth_SDK{
		FailureURL:         webDomain,
		CallbackSuccessURL: webDomain + "/dashboard/diagrams",
	}

	var err error

	response.GitHub, err = initGitHub()
	if err != nil {
		return nil, err
	}

	response.Google, err = initGoogle()
	if err != nil {
		return nil, err
	}

	return response, nil
}

func initGitHub() (*oauth2.Config, error) {
	var response *oauth2.Config = &oauth2.Config{
		ClientID:     os.Getenv("OAUTH_GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("OAUTH_GITHUB_CLIENT_SECRET"),
		Endpoint:     github.Endpoint,
		RedirectURL:  getCallbackURL("github"),
		Scopes:       []string{"user:email", "read:user"},
	}

	if response.ClientID == "" {
		return nil, errors.New("github oauth client id is not set")
	}

	if response.ClientSecret == "" {
		return nil, errors.New("github oauth client secret is not set")
	}

	return response, nil
}

func initGoogle() (*oauth2.Config, error) {
	var response *oauth2.Config = &oauth2.Config{
		ClientID:     os.Getenv("OAUTH_GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("OAUTH_GOOGLE_CLIENT_SECRET"),
		Endpoint:     google.Endpoint,
		RedirectURL:  getCallbackURL("google"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
	}

	if response.ClientID == "" {
		return nil, errors.New("google oauth client id is not set")
	}

	if response.ClientSecret == "" {
		return nil, errors.New("google oauth client secret is not set")
	}

	return response, nil
}

func getCallbackURL(provider string) string {
	return fmt.Sprintf(apiDomain+"/oauth/%s/callback", provider)
}
