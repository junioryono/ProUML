package auth

import (
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/postgres/jwk"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/sdk/ses"
	jwkT "github.com/lestrrat-go/jwx/jwk"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Auth_SDK struct {
	db  *gorm.DB
	jwk *jwk.JWK_SDK
	ses *ses.SES_SDK
}

func Init(db *gorm.DB, jwk *jwk.JWK_SDK, ses *ses.SES_SDK) *Auth_SDK {
	return &Auth_SDK{
		db:  db,
		jwk: jwk,
		ses: ses,
	}
}

// Function that will authenticate the user
// Returns the users id token and refresh token
func (authSDK *Auth_SDK) AuthenticateUser(userIPAddress, email, password string) (string, string, error) {
	// Get the user from the database
	var user models.UserModel
	err := authSDK.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		// If error is record not found, return incorrect email or password
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", "", fmt.Errorf("incorrect email or password")
		}

		return "", "", err
	}

	// Check if the user's email has been verified
	// if !user.EmailVerified {
	// 	return "", "", fmt.Errorf("email has not been verified")
	// }

	// Check if the user's password is correct
	if ok := authSDK.CheckPasswordHash(password, user.Password); !ok {
		return "", "", fmt.Errorf("incorrect email or password")
	}

	// Update the user's last ip address
	user.LastIP = userIPAddress

	err = authSDK.db.Save(&user).Error
	if err != nil {
		return "", "", err
	}

	// Create the user's id token, access token, and refresh token using postgres
	idToken, refreshToken, err := authSDK.createUserTokens(user)
	if err != nil {
		return "", "", err
	}

	return idToken, refreshToken, nil
}

// Function that will create a user in the database
// Returns the users access token, id token, and refresh token
func (authSDK *Auth_SDK) CreateUser(userIPAddress, email, password, firstName, lastName string) (string, string, error) {
	// Check if the user already exists
	var user models.UserModel
	err := authSDK.db.Where("email = ?", email).First(&user).Error
	if err == nil {
		return "", "", fmt.Errorf("user already exists")
	}

	// Hash the password
	password, err = authSDK.hashPassword(password)
	if err != nil {
		return "", "", err
	}

	// Create the user
	user = models.UserModel{
		ID:        uuid.New().String(),
		Email:     email,
		Password:  password,
		FirstName: firstName,
		LastName:  lastName,
		LastIP:    userIPAddress,
	}

	if firstName != "" {
		user.FirstName = firstName
	}

	if lastName != "" {
		user.LastName = lastName
	}

	// Create the user in the database
	err = authSDK.db.Create(&user).Error
	if err != nil {
		return "", "", err
	}

	// Create the user's id token, access token, and refresh token using postgres
	idToken, refreshToken, err := authSDK.createUserTokens(user)
	if err != nil {
		return "", "", err
	}

	// Send the user an email to verify their email address in a separate goroutine
	go authSDK.SendEmailVerificationEmail(user)

	return idToken, refreshToken, nil
}

func (authSDK *Auth_SDK) createUserTokens(user models.UserModel) (string, string, error) {
	// Create the user's id token, access token, and refresh token using postgres
	idToken, err := authSDK.jwk.CreateUserIdToken(user)
	if err != nil {
		return "", "", err
	}

	refreshToken, err := authSDK.jwk.CreateUserRefreshToken(user)
	if err != nil {
		return "", "", err
	}

	return idToken, refreshToken, nil
}

// Function that will delete a user from the database
func (authSDK *Auth_SDK) DeleteUser(idToken string) error {
	// Get the user id from the access token
	userId, err := authSDK.GetUserIdFromToken(idToken)
	if err != nil {
		return err
	}

	return authSDK.db.Transaction(func(tx *gorm.DB) error {
		// Use tx.Table and joins to select the diagram_user_role_models.diagram_id where diagram_user_role_models.user_id = userId and diagram_user_role_models.role = "owner" using joins
		diagramUserRoleModels := []models.DiagramUserRoleModel{}
		err := tx.Table("diagram_user_role_models").
			Select("diagram_user_role_models.diagram_id").
			Joins("JOIN diagram_models ON diagram_models.id = diagram_user_role_models.diagram_id").
			Where("diagram_user_role_models.user_id = ? AND diagram_user_role_models.role = ?", userId, "owner").
			Find(&diagramUserRoleModels).Error

		if err != nil {
			return err
		}

		// Create a slice of diagramIDs
		diagramIDs := make([]string, len(diagramUserRoleModels))
		for i, durm := range diagramUserRoleModels {
			diagramIDs[i] = durm.DiagramID
		}

		// Delete all diagram_user_role_models where diagram_user_role_models.diagram_id is in diagramIDs
		err = tx.Where("diagram_id IN (?)", diagramIDs).Delete(&models.DiagramUserRoleModel{}).Error
		if err != nil {
			return err
		}

		// Delete all diagram_models where diagram_models.id is in diagramIDs
		err = tx.Where("id IN (?)", diagramIDs).Delete(&models.DiagramModel{}).Error
		if err != nil {
			return err
		}

		// Use tx.Table and joins to select the email_verification_token_models.token where email_verification_token_models.user_id = userId using joins
		emailVerificationTokenModels := []models.EmailVerificationTokenModel{}
		err = tx.Table("email_verification_token_models").
			Select("email_verification_token_models.token").
			Joins("JOIN user_models ON user_models.id = email_verification_token_models.user_id").
			Where("email_verification_token_models.user_id = ?", userId).
			Find(&emailVerificationTokenModels).Error

		if err != nil {
			return err
		}

		// Create a slice of tokens
		tokens := make([]string, len(emailVerificationTokenModels))
		for i, evtm := range emailVerificationTokenModels {
			tokens[i] = evtm.Token
		}

		// Delete all email_verification_token_models where email_verification_token_models.token is in tokens
		err = tx.Where("token IN (?)", tokens).Delete(&models.EmailVerificationTokenModel{}).Error
		if err != nil {
			return err
		}

		// Delete the user
		return tx.Where("id = ?", userId).Delete(&models.UserModel{}).Error
	})
}

// Function to resend the user an email verification email
func (authSDK *Auth_SDK) ResendEmailVerificationEmail(idToken string) error {
	// Get the user id from the id token
	userId, err := authSDK.GetUserIdFromToken(idToken)
	if err != nil {
		return err
	}

	// Check if the user exists
	var user models.UserModel
	err = authSDK.db.Where("id = ?", userId).First(&user).Error
	if err != nil {
		return err
	}

	// Print uses's email address
	fmt.Println(user.Email)

	// Check if the user's email has already been verified
	if user.EmailVerified {
		return fmt.Errorf("email has already been verified")
	}

	// Send the user an email to verify their email address in a separate goroutine
	go authSDK.SendEmailVerificationEmail(user)

	return nil
}

// Function that will verify the user's email address
func (authSDK *Auth_SDK) VerifyEmail(emailVerificationToken string) error {
	// Get the email verification token from the database
	var emailVerificationTokenModel models.EmailVerificationTokenModel
	err := authSDK.db.Where("token = ?", emailVerificationToken).First(&emailVerificationTokenModel).Error
	if err != nil {
		return err
	}

	// Check if the email verification token has expired
	if emailVerificationTokenModel.ExpiresAt < time.Now().Unix() {
		return fmt.Errorf("email verification token has expired")
	}

	// Get the user from the database
	var user models.UserModel
	err = authSDK.db.Where("id = ?", emailVerificationTokenModel.UserID).First(&user).Error
	if err != nil {
		return err
	}

	// Update the user's email verified status
	user.EmailVerified = true

	return authSDK.db.Save(&user).Error
}

// Function that will get a user from the database
func (authSDK *Auth_SDK) GetUser(idToken string) (*models.UserModel, error) {
	// Get the user id from the id token
	userId, err := authSDK.GetUserIdFromToken(idToken)
	if err != nil {
		return nil, err
	}

	var user models.UserModel

	err = authSDK.db.Where("id = ?", userId).First(&user).Error
	if err != nil {
		return nil, err
	}

	return &user, nil
}

// Function that will update a user in the database
func (authSDK *Auth_SDK) UpdateUser(idToken, email, firstName, lastName string) error {
	// Get the user id from the id token
	userId, err := authSDK.GetUserIdFromToken(idToken)
	if err != nil {
		return err
	}

	var user models.UserModel

	err = authSDK.db.Where("id = ?", userId).First(&user).Error
	if err != nil {
		return err
	}

	user.Email = email
	user.FirstName = firstName
	user.LastName = lastName

	return authSDK.db.Save(&user).Error
}

// Function that will send the user an email to verify their email address
func (authSDK *Auth_SDK) SendEmailVerificationEmail(user models.UserModel) error {
	// Create the email verification token
	emailVerificationToken, err := authSDK.CreateEmailVerificationToken(user)
	if err != nil {
		return err
	}

	var (
		Sender      = "no-reply@prouml.com"
		Subject     = "ProUML Account Verification"
		HtmlBody    = "Click <a href=\"https://prouml.com/verify/" + emailVerificationToken + "\">here</a> to verify your email."
		TextBody    = "Verify your email by clicking this link: https://prouml.com/verify/" + emailVerificationToken
		ToAddresses = []string{user.Email}
		CcAddresses = []string{}
	)

	_, err = authSDK.ses.SendEmail(Sender, Subject, HtmlBody, TextBody, ToAddresses, CcAddresses)

	return err
}

// Function that will create an email verification token
func (authSDK *Auth_SDK) CreateEmailVerificationToken(user models.UserModel) (string, error) {
	// Create the email verification token
	emailVerificationToken := uuid.New().String()

	// Create the email verification token in the database
	err := authSDK.db.Create(&models.EmailVerificationTokenModel{
		Token:     emailVerificationToken,
		UserID:    user.ID,
		ExpiresAt: time.Now().Add(time.Hour * 24 * 7).Unix(),
	}).Error
	if err != nil {
		return "", err
	}

	return emailVerificationToken, nil
}

// Function that will parse the JWT access token and return the user ID
func (authSDK *Auth_SDK) GetUserIdFromToken(idToken string) (string, error) {
	// Parse the JWT access token
	claims, err := authSDK.jwk.ParseClaims(idToken)
	if err != nil {
		return "", err
	}

	// Get the user ID from the claims
	userId, ok := claims["sub"].(string)
	if !ok {
		return "", fmt.Errorf("could not get user id from claims")
	}

	return userId, nil
}

// Function that will refresh the user's id token from the refresh token
func (authSDK *Auth_SDK) RefreshIdToken(refreshToken string) (string, error) {
	// Get the subject from the refresh token
	userId, err := authSDK.GetUserIdFromToken(refreshToken)
	if err != nil {
		return "", err
	}

	// Get the user from the database
	var user models.UserModel
	err = authSDK.db.Where("id = ?", userId).First(&user).Error
	if err != nil {
		return "", err
	}

	// Create a new id token
	idToken, err := authSDK.jwk.CreateUserIdToken(user)
	if err != nil {
		return "", err
	}

	return idToken, nil
}

// Function that will hash the password and return the hashed password
func (authSDK *Auth_SDK) hashPassword(password string) (string, error) {
	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return "", err
	}

	return string(hashedPassword), nil
}

// Function that will check if the password is correct
func (authSDK *Auth_SDK) CheckPasswordHash(password, hashedPassword string) bool {
	// Check if the password is correct
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}

// Function that get the JWK set from jwk.GetSet
func (authSDK *Auth_SDK) GetJWKSet() (jwkT.Set, error) {
	return authSDK.jwk.GetSet()
}

// // Create PasswordResetModel type
// type PasswordResetModel struct {
// 	ID     string `gorm:"primaryKey"`
// 	UserID string `gorm:"not null"`
// }

// func (p *Postgres_SDK) CreatePasswordReset(userId string) (string, error) {
// 	// Create a new password reset model
// 	passwordReset := PasswordResetModel{
// 		ID:     uuid.NewString(),
// 		UserID: userId,
// 	}

// 	// Save the password reset model to the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Create(&passwordReset).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return "", err
// 	}

// 	return passwordReset.ID, nil
// }

// func (p *Postgres_SDK) VerifyPasswordReset(passwordResetId string) (string, error) {
// 	// Get the password reset model from the database
// 	var passwordReset PasswordResetModel
// 	err := p.db.First(&passwordReset, passwordResetId).Error
// 	if err != nil {
// 		return "", err
// 	}

// 	return passwordReset.UserID, nil
// }

// func (p *Postgres_SDK) DeletePasswordReset(passwordResetId string) error {
// 	// Delete the password reset model from the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Delete(&PasswordResetModel{}, passwordResetId).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (p *Postgres_SDK) DeleteAllPasswordReset() error {
// 	// Delete the password reset models from the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Delete(&PasswordResetModel{}).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (p *Postgres_SDK) CreateEmailVerification(userId string) (string, error) {
// 	// Create a new email verification model
// 	emailVerification := EmailVerificationModel{
// 		ID:     uuid.NewString(),
// 		UserID: userId,
// 	}

// 	// Save the email verification model to the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Create(&emailVerification).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return "", err
// 	}

// 	return emailVerification.ID, nil
// }

// func (p *Postgres_SDK) VerifyEmailVerification(emailVerificationId string) (string, error) {
// 	// Get the email verification model from the database
// 	var emailVerification EmailVerificationModel
// 	err := p.db.First(&emailVerification, emailVerificationId).Error
// 	if err != nil {
// 		return "", err
// 	}

// 	return emailVerification.UserID, nil
// }

// func (p *Postgres_SDK) DeleteEmailVerification(emailVerificationId string) error {
// 	// Delete the email verification model from the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Delete(&EmailVerificationModel{}, emailVerificationId).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (p *Postgres_SDK) DeleteAllEmailVerification() error {
// 	// Delete the email verification models from the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Delete(&EmailVerificationModel{}).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (p *Postgres_SDK) CreateOAuth2Session(userId string, provider string, providerUserId string) (string, error) {
// 	// Create a new OAuth2 session model
// 	oAuth2Session := OAuth2SessionModel{
// 		ID:             uuid.NewString(),
// 		UserID:         userId,
// 		Provider:       provider,
// 		ProviderUserID: providerUserId,
// 	}

// 	// Save the OAuth2 session model to the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Create(&oAuth2Session).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return "", err
// 	}

// 	return oAuth2Session.ID, nil
// }

// func (p *Postgres_SDK) VerifyOAuth2Session(oAuth2SessionId string) (string, string, error) {
// 	// Get the OAuth2 session model from the database
// 	var oAuth2Session OAuth2SessionModel
// 	err := p.db.First(&oAuth2Session, oAuth2SessionId).Error
// 	if err != nil {
// 		return "", "", err
// 	}

// 	return oAuth2Session.UserID, oAuth2Session.Provider, nil
// }

// func (p *Postgres_SDK) DeleteOAuth2Session(oAuth2SessionId string) error {
// 	// Delete the OAuth2 session model from the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Delete(&OAuth2SessionModel{}, oAuth2SessionId).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (p *Postgres_SDK) DeleteAllOAuth2Session() error {
// 	// Delete the OAuth2 session models from the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Delete(&OAuth2SessionModel{}).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (p *Postgres_SDK) CreateOAuth2AuthorizationCode(userId string, clientID string, redirectURI string, scope string, codeChallenge string, codeChallengeMethod string) (string, error) {
// 	// Create a new OAuth2 authorization code model
// 	oAuth2AuthorizationCode := OAuth2AuthorizationCodeModel{
// 		ID:                  uuid.NewString(),
// 		UserID:              userId,
// 		ClientID:            clientID,
// 		RedirectURI:         redirectURI,
// 		Scope:               scope,
// 		CodeChallenge:       codeChallenge,
// 		CodeChallengeMethod: codeChallengeMethod,
// 	}

// 	// Save the OAuth2 authorization code model to the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Create(&oAuth2AuthorizationCode).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return "", err
// 	}

// 	return oAuth2AuthorizationCode.ID, nil
// }

// func (p *Postgres_SDK) VerifyOAuth2AuthorizationCode(oAuth2AuthorizationCodeId string) (string, string, string, string, string, string, error) {
// 	// Get the OAuth2 authorization code model from the database
// 	var oAuth2AuthorizationCode OAuth2AuthorizationCodeModel
// 	err := p.db.First(&oAuth2AuthorizationCode, oAuth2AuthorizationCodeId).Error
// 	if err != nil {
// 		return "", "", "", "", "", "", err
// 	}

// 	return oAuth2AuthorizationCode.UserID, oAuth2AuthorizationCode.ClientID, oAuth2AuthorizationCode.RedirectURI, oAuth2AuthorizationCode.Scope, oAuth2AuthorizationCode.CodeChallenge, oAuth2AuthorizationCode.CodeChallengeMethod, nil
// }

// func (p *Postgres_SDK) DeleteOAuth2AuthorizationCode(oAuth2AuthorizationCodeId string) error {
// 	// Delete the OAuth2 authorization code model from the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Delete(&OAuth2AuthorizationCodeModel{}, oAuth2AuthorizationCodeId).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (p *Postgres_SDK) DeleteAllOAuth2AuthorizationCode() error {
// 	// Delete the OAuth2 authorization code models from the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Delete(&OAuth2AuthorizationCodeModel{}).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (p *Postgres_SDK) CreateOAuth2AccessToken(userId string, clientID string, scope string) (string, error) {
// 	// Create a new OAuth2 access token model
// 	oAuth2AccessToken := OAuth2AccessTokenModel{
// 		ID:       uuid.NewString(),
// 		UserID:   userId,
// 		ClientID: clientID,
// 		Scope:    scope,
// 	}

// 	// Save the OAuth2 access token model to the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Create(&oAuth2AccessToken).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return "", err
// 	}

// 	return oAuth2AccessToken.ID, nil
// }

// func (p *Postgres_SDK) VerifyOAuth2AccessToken(oAuth2AccessTokenId string) (string, string, string, error) {
// 	// Get the OAuth2 access token model from the database
// 	var oAuth2AccessToken OAuth2AccessTokenModel
// 	err := p.db.First(&oAuth2AccessToken, oAuth2AccessTokenId).Error
// 	if err != nil {
// 		return "", "", "", err
// 	}

// 	return oAuth2AccessToken.UserID, oAuth2AccessToken.ClientID, oAuth2AccessToken.Scope, nil
// }

// func (p *Postgres_SDK) DeleteOAuth2AccessToken(oAuth2AccessTokenId string) error {
// 	// Delete the OAuth2 access token model from the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Delete(&OAuth2AccessTokenModel{}, oAuth2AccessTokenId).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (p *Postgres_SDK) DeleteAllOAuth2AccessToken() error {
// 	// Delete the OAuth2 access token models from the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Delete(&OAuth2AccessTokenModel{}).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (p *Postgres_SDK) CreateOAuth2RefreshToken(userId string, clientID string, scope string) (string, error) {
// 	// Create a new OAuth2 refresh token model
// 	oAuth2RefreshToken := OAuth2RefreshTokenModel{
// 		ID:       uuid.NewString(),
// 		UserID:   userId,
// 		ClientID: clientID,
// 		Scope:    scope,
// 	}

// 	// Save the OAuth2 refresh token model to the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Create(&oAuth2RefreshToken).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return "", err
// 	}

// 	return oAuth2RefreshToken.ID, nil
// }

// func (p *Postgres_SDK) VerifyOAuth2RefreshToken(oAuth2RefreshTokenId string) (string, string, string, error) {
// 	// Get the OAuth2 refresh token model from the database
// 	var oAuth2RefreshToken OAuth2RefreshTokenModel
// 	err := p.db.First(&oAuth2RefreshToken, oAuth2RefreshTokenId).Error
// 	if err != nil {
// 		return "", "", "", err
// 	}

// 	return oAuth2RefreshToken.UserID, oAuth2RefreshToken.ClientID, oAuth2RefreshToken.Scope, nil
// }

// func (p *Postgres_SDK) DeleteOAuth2RefreshToken(oAuth2RefreshTokenId string) error {
// 	// Delete the OAuth2 refresh token model from the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Delete(&OAuth2RefreshTokenModel{}, oAuth2RefreshTokenId).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (p *Postgres_SDK) DeleteAllOAuth2RefreshToken() error {
// 	// Delete the OAuth2 refresh token models from the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Delete(&OAuth2RefreshTokenModel{}).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (p *Postgres_SDK) CreateOAuth2Client(clientID string, clientSecret string, redirectURI string) error {
// 	// Create a new OAuth2 client model
// 	oAuth2Client := OAuth2ClientModel{
// 		ClientID:     clientID,
// 		ClientSecret: clientSecret,
// 		RedirectURI:  redirectURI,
// 	}

// 	// Save the OAuth2 client model to the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Create(&oAuth2Client).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (p *Postgres_SDK) VerifyOAuth2Client(clientID string, clientSecret string) (string, error) {
// 	// Get the OAuth2 client model from the database
// 	var oAuth2Client OAuth2ClientModel
// 	err := p.db.First(&oAuth2Client, clientID).Error
// 	if err != nil {
// 		return "", err
// 	}

// 	// Check the client secret
// 	if oAuth2Client.ClientSecret != clientSecret {
// 		return "", errors.New("invalid client secret")
// 	}

// 	return oAuth2Client.RedirectURI, nil
// }

// func (p *Postgres_SDK) DeleteOAuth2Client(clientID string) error {
// 	// Delete the OAuth2 client model from the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Delete(&OAuth2ClientModel{}, clientID).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (p *Postgres_SDK) DeleteAllOAuth2Client() error {
// 	// Delete the OAuth2 client models from the database
// 	err := p.db.Transaction(func(tx *gorm.DB) error {
// 		err := tx.Delete(&OAuth2ClientModel{}).Error
// 		if err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }
