package auth0

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/lestrrat-go/jwx/jwk"
)

type Auth0_SDK struct {
	credentials     *credentials
	token           *token
	managementToken *token
	jwks            jwk.Set
}

type credentials struct {
	Domain             string
	URL                string
	ClientId           string
	ClientSecret       string
	Audience           string
	ManagementAudience string
	JWTIssuer          string
}

type token struct {
	AccessToken string `json:"access_token"`
	Scope       string `json:"scope"`
	ExpiresIn   int    `json:"expires_in"`
	TokenType   string `json:"token_type"`
}

func Init() (*Auth0_SDK, error) {
	Domain := os.Getenv("AUTH0_DOMAIN")
	ClientId := os.Getenv("AUTH0_CLIENT_ID")
	ClientSecret := os.Getenv("AUTH0_CLIENT_SECRET")
	Audience := os.Getenv("AUTH0_AUDIENCE")
	ManagementAudience := os.Getenv("AUTH0_MANAGEMENT_AUDIENCE")

	if Domain == "" {
		return nil, errors.New("auth0 domain is empty")
	}

	if ClientId == "" {
		return nil, errors.New("auth0 client id is empty")
	}

	if ClientSecret == "" {
		return nil, errors.New("auth0 client secret is empty")
	}

	if Audience == "" {
		return nil, errors.New("auth0 api identifier is empty")
	}

	if ManagementAudience == "" {
		return nil, errors.New("auth0 management api identifier is empty")
	}

	credentials := &credentials{
		Domain:             Domain,
		URL:                fmt.Sprintf("https://%s/oauth/token", Domain),
		ClientId:           ClientId,
		ClientSecret:       ClientSecret,
		Audience:           Audience,
		ManagementAudience: ManagementAudience,
		JWTIssuer:          fmt.Sprintf("https://%s/", Domain),
	}

	sdk := &Auth0_SDK{
		credentials: credentials,
	}

	err := sdk.requestNewAuth0AccessToken(credentials.Audience)
	if err != nil {
		return nil, err
	}

	err = sdk.requestNewAuth0AccessToken(credentials.ManagementAudience)
	if err != nil {
		return nil, err
	}

	err = sdk.requestJSONWebKeySet()
	if err != nil {
		return nil, err
	}

	// Request a new access token every 23 hours
	go func() {
		var recursiveAudience func()
		var recursiveManagementAudience func()

		recursiveAudience = func() {
			err := sdk.requestNewAuth0AccessToken(credentials.Audience)
			if err != nil {
				recursiveAudience()
			}
		}

		recursiveManagementAudience = func() {
			err := sdk.requestNewAuth0AccessToken(credentials.ManagementAudience)
			if err != nil {
				recursiveManagementAudience()
			}
		}

		for range time.Tick(time.Hour * 23) {
			recursiveAudience()
			recursiveManagementAudience()
		}
	}()

	return sdk, nil
}

func (auth0SDK *Auth0_SDK) requestNewAuth0AccessToken(audience string) error {
	requestBody := map[string]string{
		"client_id":     auth0SDK.credentials.ClientId,
		"client_secret": auth0SDK.credentials.ClientSecret,
		"audience":      audience,
		"grant_type":    "client_credentials",
	}

	requestJSONBody, err := json.Marshal(requestBody)
	if err != nil {
		return err
	}

	req, _ := http.NewRequest("POST", auth0SDK.credentials.URL, bytes.NewBuffer(requestJSONBody))
	req.Header.Add("content-type", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return errors.New("auth0 could not get access token")
	}

	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return errors.New("auth0 could not read response body")
	}

	var t token
	err = json.Unmarshal(body, &t)
	if err != nil {
		return errors.New("auth0 could not unmarshal body")
	}

	if audience == auth0SDK.credentials.Audience {
		auth0SDK.token = &t
	} else if audience == auth0SDK.credentials.ManagementAudience {
		auth0SDK.managementToken = &t
	} else {
		return errors.New("auth0 could not find audience")
	}

	return nil
}

func (auth0SDK *Auth0_SDK) requestJSONWebKeySet() error {
	url := fmt.Sprintf("https://%s/.well-known/jwks.json", auth0SDK.credentials.Domain)

	jwks, err := jwk.Fetch(context.Background(), url)
	if err != nil {
		return err
	}

	auth0SDK.jwks = jwks
	return nil
}

// Function to register user. Returns id_token, refresh_token, and error
func (auth0SDK *Auth0_SDK) Register(userIPAddress, email, password, firstName, lastName string) (string, string, error) {
	// TODO need to add first name and last name

	if email == "" {
		return "", "", errors.New("email is empty")
	}

	if password == "" {
		return "", "", errors.New("password is empty")
	}

	requestBody := map[string]string{
		"client_id":     auth0SDK.credentials.ClientId,
		"client_secret": auth0SDK.credentials.ClientSecret,
		"email":         email,
		"password":      password,
		"connection":    "Username-Password-Authentication",
	}

	requestJSONBody, err := json.Marshal(requestBody)
	if err != nil {
		return "", "", err
	}

	req, _ := http.NewRequest("POST", fmt.Sprintf("https://%s/dbconnections/signup", auth0SDK.credentials.Domain), bytes.NewBuffer(requestJSONBody))
	req.Header.Add("content-type", "application/json")
	req.Header.Add("authorization", "Bearer "+auth0SDK.token.AccessToken)
	req.Header.Add("auth0-forwarded-for", userIPAddress)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", "", err
	}

	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return "", "", err
	}

	type response struct {
		Email string `json:"email"`
	}

	var user response
	err = json.Unmarshal(body, &user)
	if err != nil {
		return "", "", err
	}

	if user.Email == "" {
		return "", "", errors.New("email already in use")
	}

	idToken, refreshToken, err := auth0SDK.Login(userIPAddress, email, password)
	if err != nil {
		return "", "", err
	}

	return idToken, refreshToken, nil
}

// Function to log in user with email and password. Returns id_token, refresh_token, and error
func (auth0SDK *Auth0_SDK) Login(userIPAddress, email, password string) (string, string, error) {
	if email == "" {
		return "", "", errors.New("email is empty")
	}

	if password == "" {
		return "", "", errors.New("password is empty")
	}

	requestBody := map[string]string{
		"grant_type":    "password",
		"username":      email,
		"password":      password,
		"audience":      auth0SDK.credentials.Audience,
		"client_id":     auth0SDK.credentials.ClientId,
		"client_secret": auth0SDK.credentials.ClientSecret,
		"scope":         "openid offline_access",
	}

	requestJSONBody, err := json.Marshal(requestBody)
	if err != nil {
		return "", "", err
	}

	req, _ := http.NewRequest("POST", fmt.Sprintf("https://%s/oauth/token", auth0SDK.credentials.Domain), bytes.NewBuffer(requestJSONBody))
	req.Header.Add("content-type", "application/json")
	req.Header.Add("authorization", "Bearer "+auth0SDK.token.AccessToken)
	req.Header.Add("auth0-forwarded-for", userIPAddress)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", "", err
	}

	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return "", "", err
	}

	type response struct {
		RefreshToken string `json:"refresh_token"`
		IdToken      string `json:"id_token"`
	}

	var user response
	err = json.Unmarshal(body, &user)
	if err != nil {
		return "", "", err
	}

	if user.IdToken == "" || user.RefreshToken == "" {
		return "", "", errors.New("incorrect email or password")
	}

	return user.IdToken, user.RefreshToken, nil
}

// Function to delete account. Returns error
func (auth0SDK *Auth0_SDK) DeleteAccount(userIPAddress, userId string) error {
	if userId == "" {
		return errors.New("user id not provided")
	}

	req, _ := http.NewRequest("DELETE", fmt.Sprintf("https://%s/api/v2/users/%s", auth0SDK.credentials.Domain, userId), nil)
	req.Header.Add("content-type", "application/json")
	req.Header.Add("authorization", "Bearer "+auth0SDK.managementToken.AccessToken)
	req.Header.Add("auth0-forwarded-for", userIPAddress)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	if res.StatusCode != 204 {
		return errors.New("could not remove user")
	}

	return nil
}

// Function to refresh id token. Returns new id_token and error
func (auth0SDK *Auth0_SDK) RefreshIdToken(userIPAddress, refreshToken string) (string, error) {
	if refreshToken == "" {
		return "", errors.New("refresh token not provided")
	}

	requestBody := map[string]string{
		"grant_type":    "refresh_token",
		"refresh_token": refreshToken,
		"audience":      auth0SDK.credentials.Audience,
		"client_id":     auth0SDK.credentials.ClientId,
		"client_secret": auth0SDK.credentials.ClientSecret,
		"scope":         "openid offline_access",
	}

	requestJSONBody, err := json.Marshal(requestBody)
	if err != nil {
		return "", err
	}

	req, _ := http.NewRequest("POST", fmt.Sprintf("https://%s/oauth/token", auth0SDK.credentials.Domain), bytes.NewBuffer(requestJSONBody))
	req.Header.Add("content-type", "application/json")
	req.Header.Add("authorization", "Bearer "+auth0SDK.token.AccessToken)
	req.Header.Add("auth0-forwarded-for", userIPAddress)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}

	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return "", err
	}

	type response struct {
		IdToken string `json:"id_token"`
	}

	var user response
	err = json.Unmarshal(body, &user)
	if err != nil {
		return "", err
	}

	if user.IdToken == "" {
		return "", errors.New("incorrect email or password")
	}

	return user.IdToken, nil
}

// Function to resend verification email using /api/v2/jobs/verification-email
func (auth0SDK *Auth0_SDK) ResendVerificationEmail(userIPAddress, userId string) error {
	// Get user info
	claims, err := auth0SDK.GetUser(userIPAddress, userId)
	if err != nil {
		return err
	}

	// Check if email is already verified
	if claims["email_verified"].(bool) {
		return errors.New("email is already verified")
	}

	requestBody := map[string]string{
		"user_id":   claims["sub"].(string),
		"client_id": auth0SDK.credentials.ClientId,
	}

	requestJSONBody, err := json.Marshal(requestBody)
	if err != nil {
		return err
	}

	req, _ := http.NewRequest("POST", fmt.Sprintf("https://%s/api/v2/jobs/verification-email", auth0SDK.credentials.Domain), bytes.NewBuffer(requestJSONBody))
	req.Header.Add("content-type", "application/json")
	req.Header.Add("authorization", "Bearer "+auth0SDK.managementToken.AccessToken)
	req.Header.Add("auth0-forwarded-for", userIPAddress)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return err
	}

	// print
	fmt.Println(string(body))

	type response struct {
		Status string `json:"status"`
	}

	var user response
	err = json.Unmarshal(body, &user)
	if err != nil {
		return err
	}

	if user.Status == "pending" || user.Status == "completed" {
		return nil
	}

	return errors.New("could not resend email")

}

// Function to fetch user info using /api/v2/users/{id}
func (auth0SDK *Auth0_SDK) GetUser(userIPAddress, userId string) (jwt.MapClaims, error) {

	req, _ := http.NewRequest("GET", fmt.Sprintf("https://%s/api/v2/users/%s", auth0SDK.credentials.Domain, userId), nil)
	req.Header.Add("content-type", "application/json")
	req.Header.Add("authorization", "Bearer "+auth0SDK.managementToken.AccessToken)
	req.Header.Add("auth0-forwarded-for", userIPAddress)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	// // print
	// fmt.Println(string(body))

	response := jwt.MapClaims{}

	err = json.Unmarshal(body, &response)
	if err != nil {
		return nil, err
	}

	return response, nil
}

// Function to parse claims from tokenString
func (auth0SDK *Auth0_SDK) ParseClaims(tokenString string) (jwt.MapClaims, error) {
	if tokenString == "" {
		return nil, errors.New("token string not provided")
	}

	claims := jwt.MapClaims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		// Verify if the token was signed with correct signing method
		// AWS Cognito is using RSA256 in my case
		_, ok := token.Method.(*jwt.SigningMethodRSA)
		if !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		// Get "kid" value from token header
		// "kid" is shorthand for Key ID
		kid, ok := token.Header["kid"].(string)
		if !ok {
			return nil, errors.New("kid header not found")
		}

		// "kid" must be present in the public keys set
		key, ok := auth0SDK.jwks.LookupKeyID(kid)
		if !ok {
			return nil, fmt.Errorf("key %v not found", kid)
		}

		// Return token key as []byte{string} type
		var tokenKey interface{}
		if err := key.Raw(&tokenKey); err != nil {
			return nil, errors.New("failed to create token key")
		}

		return tokenKey, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		if ok := claims.VerifyIssuer(auth0SDK.credentials.JWTIssuer, true); !ok {
			return nil, errors.New("invalid issuer")
		}

		// Check if token is not expired
		if !claims.VerifyExpiresAt(time.Now().Unix(), true) {
			return nil, errors.New("token expired")
		}

		return claims, nil
	}

	return nil, errors.New("invalid token")
}
