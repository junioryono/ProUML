package auth

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt"
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
func (authSDK *Auth_SDK) AuthenticateUser(userIPAddress, email, password string) (models.UserModel, string, string, error) {
	// Get the user from the database
	var user models.UserModel
	err := authSDK.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		// If error is record not found, return incorrect email or password
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return user, "", "", fmt.Errorf("incorrect email or password")
		}

		return user, "", "", err
	}

	// Check if the user's email has been verified
	// if !user.EmailVerified {
	// 	return "", "", fmt.Errorf("email has not been verified")
	// }

	// Check if the user's password is correct
	if ok := authSDK.CheckPasswordHash(password, user.Password); !ok {
		return user, "", "", fmt.Errorf("incorrect email or password")
	}

	// Update the user's last ip address
	user.LastIP = userIPAddress

	err = authSDK.db.Save(&user).Error
	if err != nil {
		return user, "", "", err
	}

	// Create the user's id token, access token, and refresh token using postgres
	idToken, refreshToken, err := authSDK.createUserTokens(user)
	if err != nil {
		return user, "", "", err
	}

	return user, idToken, refreshToken, nil
}

// Function that will create a user in the database
// Returns the users access token, id token, and refresh token
func (authSDK *Auth_SDK) CreateUser(userIPAddress, email, password, fullName string) (models.UserModel, string, string, error) {
	// Check if the user already exists
	var user models.UserModel
	err := authSDK.db.Where("email = ?", email).First(&user).Error
	if err == nil {
		return user, "", "", fmt.Errorf("user already exists")
	}

	// Hash the password
	password, err = authSDK.hashPassword(password)
	if err != nil {
		return user, "", "", err
	}

	// Create the user
	user = models.UserModel{
		ID:       uuid.New().String(),
		Email:    email,
		Password: password,
		LastIP:   userIPAddress,
	}

	if fullName != "" {
		user.FullName = fullName
	}

	// Create the user in the database
	err = authSDK.db.Create(&user).Error
	if err != nil {
		return user, "", "", err
	}

	// Create the user's id token, access token, and refresh token using postgres
	idToken, refreshToken, err := authSDK.createUserTokens(user)
	if err != nil {
		return user, "", "", err
	}

	// Send the user an email to verify their email address in a separate goroutine
	go authSDK.SendEmailVerificationEmail(user)

	return user, idToken, refreshToken, nil
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

		// Use Join to delete all diagram_user_role_models where diagram_user_role_models.user_id = userId
		err = tx.Table("diagram_user_role_models").
			Joins("JOIN user_models ON user_models.id = diagram_user_role_models.user_id").
			Where("diagram_user_role_models.user_id = ?", userId).
			Delete(&models.DiagramUserRoleModel{}).Error

		if err != nil {
			return err
		}

		// Use Join to delete all email_verification_token_models where email_verification_token_models.user_id = userId
		err = tx.Table("email_verification_token_models").
			Joins("JOIN user_models ON user_models.id = email_verification_token_models.user_id").
			Where("email_verification_token_models.user_id = ?", userId).
			Delete(&models.EmailVerificationTokenModel{}).Error

		if err != nil {
			return err
		}

		// Use Join to delete all password_reset_token_models where password_reset_token_models.user_id = userId
		err = tx.Table("password_reset_token_models").
			Joins("JOIN user_models ON user_models.id = password_reset_token_models.user_id").
			Where("password_reset_token_models.user_id = ?", userId).
			Delete(&models.PasswordResetTokenModel{}).Error

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

// Function that will return a user from their id token
func (authSDK *Auth_SDK) GetUserFromToken(idToken string) (jwt.MapClaims, error) {
	return authSDK.jwk.ParseClaims(idToken)
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
func (authSDK *Auth_SDK) UpdateUser(idToken, email, fullName string) error {
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
	user.FullName = fullName

	return authSDK.db.Save(&user).Error
}

// Function that will update a user's full name in the database
func (authSDK *Auth_SDK) UpdateUserFullName(idToken, fullName string) error {
	// Get the user id from the id token
	userId, err := authSDK.GetUserIdFromToken(idToken)
	if err != nil {
		return err
	}

	return authSDK.db.Model(&models.UserModel{}).
		Where("id = ?", userId).
		Update("full_name", fullName).Error
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

// Function that will create a password reset token
func (authSDK *Auth_SDK) CreatePasswordResetToken(idToken string) (string, error) {
	// Get the user id from the id token
	userId, err := authSDK.GetUserIdFromToken(idToken)
	if err != nil {
		return "", err
	}

	// Create the password reset token
	passwordResetToken := uuid.New().String()

	// Create the password reset token in the database
	err = authSDK.db.Create(&models.PasswordResetTokenModel{
		Token:     passwordResetToken,
		UserID:    userId,
		ExpiresAt: time.Now().Add(time.Hour * 24 * 7).Unix(),
	}).Error
	if err != nil {
		return "", err
	}

	return passwordResetToken, nil
}

// Function that will reset the user's password
func (authSDK *Auth_SDK) ResetPassword(passwordResetToken, newPassword string) error {
	// Get the user id from the password reset token
	userId, err := authSDK.GetUserIdFromToken(passwordResetToken)
	if err != nil {
		return err
	}

	return authSDK.db.Transaction(func(tx *gorm.DB) error {
		// Get the user from the database
		var user models.UserModel
		err = authSDK.db.Where("id = ?", userId).First(&user).Error
		if err != nil {
			return err
		}

		// Hash the new password
		hashedPassword, err := authSDK.hashPassword(newPassword)
		if err != nil {
			return err
		}

		// Update the user's password
		err = authSDK.db.Model(&user).Update("password", hashedPassword).Error
		if err != nil {
			return err
		}

		// Delete the password reset token from the database
		return authSDK.db.Where("user_id = ?", userId).Delete(&models.PasswordResetTokenModel{}).Error
	})
}
