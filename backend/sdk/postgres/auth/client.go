package auth

import (
	"errors"
	"strings"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/postgres/jwk"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/sdk/ses"
	"github.com/junioryono/ProUML/backend/types"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type client_SDK struct {
	auth *Auth_SDK
	db   *gorm.DB
	jwk  *jwk.JWK_SDK
	ses  *ses.SES_SDK
}

// Function that will authenticate the user
// Returns the users id token and refresh token
func (clientSDK *client_SDK) AuthenticateUser(userIPAddress, email, password string) (models.UserModel, string, string, *types.WrappedError) {
	if email == "" || password == "" {
		return models.UserModel{}, "", "", types.Wrap(errors.New("email or password is empty"), types.ErrInvalidEmailOrPassword)
	}

	// Get the user from the database
	var user models.UserModel
	if err := clientSDK.db.Where("email = ?", email).First(&user).Error; err != nil {
		// If error is record not found, return incorrect email or password
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return user, "", "", types.Wrap(err, types.ErrInvalidEmailOrPassword)
		}

		return user, "", "", types.Wrap(err, types.ErrInternalServerError)
	}

	// Check if the user's email has been verified
	// if !user.EmailVerified {
	// 	return "", "", fmt.Errorf("email has not been verified")
	// }

	// Check if the user's password is correct
	if ok := clientSDK.checkPasswordHash(password, user.Password); !ok {
		return user, "", "", types.Wrap(errors.New("invalid email or password"), types.ErrInvalidEmailOrPassword)
	}

	// Update the user's last ip address
	user.LastIP = userIPAddress

	if err := clientSDK.db.Save(&user).Error; err != nil {
		return user, "", "", types.Wrap(err, types.ErrInternalServerError)
	}

	// Create the user's id token, access token, and refresh token using postgres
	idToken, refreshToken, err := clientSDK.auth.createUserTokens(user)
	if err != nil {
		return user, "", "", types.Wrap(err, types.ErrInternalServerError)
	}

	return user, idToken, refreshToken, nil
}

// Function that will create a user in the database
// Returns the users access token, id token, and refresh token
func (clientSDK *client_SDK) CreateUser(userIPAddress, email, password, fullName string) (models.UserModel, string, string, *types.WrappedError) {
	// Check if the user already exists
	var user models.UserModel
	if err := clientSDK.db.Where("email = ?", email).First(&user).Error; err == nil {
		return user, "", "", types.Wrap(err, types.ErrUserAlreadyExists)
	}

	// Hash the password
	password, err := clientSDK.hashPassword(password)
	if err != nil {
		return user, "", "", types.Wrap(err, types.ErrInternalServerError)
	}

	// Create the user
	user = models.UserModel{
		ID:       uuid.New().String(),
		Email:    email,
		Password: password,
		LastIP:   userIPAddress,
		Picture:  getUserPictureURL(fullName),
	}

	if fullName != "" {
		user.FullName = fullName
	}

	// Create the user in the database
	if err := clientSDK.db.Create(&user).Error; err != nil {
		return user, "", "", types.Wrap(err, types.ErrInternalServerError)
	}

	// Create the user's id token, access token, and refresh token using postgres
	idToken, refreshToken, err := clientSDK.auth.createUserTokens(user)
	if err != nil {
		return user, "", "", types.Wrap(err, types.ErrInternalServerError)
	}

	// Send the user an email to verify their email address in a separate goroutine
	go clientSDK.SendEmailVerificationEmail(user)

	return user, idToken, refreshToken, nil
}

// Function that will delete a user from the database
func (clientSDK *client_SDK) DeleteUser(idToken string) *types.WrappedError {
	// Get the user id from the access token
	userId, err := clientSDK.GetUserId(idToken)
	if err != nil {
		return types.Wrap(err, types.ErrNotAuthenticated)
	}

	tx := clientSDK.db.Begin()

	// Use tx.Table and joins to select the diagram_user_role_models.diagram_id where diagram_user_role_models.user_id = userId and diagram_user_role_models.role = "owner" using joins
	diagramUserRoleModels := []models.DiagramUserRoleModel{}
	if err := tx.Table("diagram_user_role_models").
		Select("diagram_user_role_models.diagram_id").
		Joins("JOIN diagram_models ON diagram_models.id = diagram_user_role_models.diagram_id").
		Where("diagram_user_role_models.user_id = ? AND diagram_user_role_models.role = ?", userId, "owner").
		Find(&diagramUserRoleModels).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Create a slice of diagramIDs
	diagramIDs := make([]string, len(diagramUserRoleModels))
	for i, durm := range diagramUserRoleModels {
		diagramIDs[i] = durm.DiagramID
	}

	// Delete all diagram_user_role_models where diagram_user_role_models.diagram_id is in diagramIDs
	if err := tx.Where("diagram_id IN (?)", diagramIDs).Delete(&models.DiagramUserRoleModel{}).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Delete all diagram_models where diagram_models.id is in diagramIDs
	if err := tx.Where("id IN (?)", diagramIDs).Delete(&models.DiagramModel{}).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Use Join to delete all diagram_user_role_models where diagram_user_role_models.user_id = userId
	if err := tx.Table("diagram_user_role_models").
		Joins("JOIN user_models ON user_models.id = diagram_user_role_models.user_id").
		Where("diagram_user_role_models.user_id = ?", userId).
		Delete(&models.DiagramUserRoleModel{}).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Use Join to delete all email_verification_token_models where email_verification_token_models.user_id = userId
	if err := tx.Table("email_verification_token_models").
		Joins("JOIN user_models ON user_models.id = email_verification_token_models.user_id").
		Where("email_verification_token_models.user_id = ?", userId).
		Delete(&models.EmailVerificationTokenModel{}).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Use Join to delete all password_reset_token_models where password_reset_token_models.user_id = userId
	if err := tx.Table("password_reset_token_models").
		Joins("JOIN user_models ON user_models.id = password_reset_token_models.user_id").
		Where("password_reset_token_models.user_id = ?", userId).
		Delete(&models.PasswordResetTokenModel{}).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Delete the user
	if err := tx.Where("id = ?", userId).Delete(&models.UserModel{}).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

// Function to resend the user an email verification email
func (clientSDK *client_SDK) ResendEmailVerificationEmail(idToken string) *types.WrappedError {
	// Get the user id from the id token
	userId, err := clientSDK.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Check if the user exists
	var user models.UserModel
	if err := clientSDK.db.Where("id = ?", userId).First(&user).Error; err != nil {
		return types.Wrap(err, types.ErrNotAuthenticated)
	}

	// Check if the user's email has already been verified
	if user.EmailVerified {
		return types.Wrap(err, types.ErrEmailAlreadyVerified)
	}

	// Send the user an email to verify their email address in a separate goroutine
	go clientSDK.SendEmailVerificationEmail(user)

	return nil
}

// Function that will verify the user's email address
func (clientSDK *client_SDK) VerifyEmail(emailVerificationToken string) *types.WrappedError {
	// Get the email verification token from the database
	var emailVerificationTokenModel models.EmailVerificationTokenModel
	if err := clientSDK.db.Where("token = ?", emailVerificationToken).First(&emailVerificationTokenModel).Error; err != nil {
		return types.Wrap(err, types.ErrInvalidToken)
	}

	// Check if the email verification token has expired
	if emailVerificationTokenModel.ExpiresAt < time.Now().Unix() {
		return types.Wrap(errors.New("email token expired"), types.ErrTokenExpired)
	}

	// Get the user from the database
	var user models.UserModel
	if err := clientSDK.db.Where("id = ?", emailVerificationTokenModel.UserID).First(&user).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Update the user's email verified status
	user.EmailVerified = true

	if err := clientSDK.db.Save(&user).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Delete the email verification token from the database
	if err := clientSDK.db.Delete(&emailVerificationTokenModel).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

// Function that will return a user from their id token
func (clientSDK *client_SDK) GetUserClaims(idToken string) (jwt.MapClaims, *types.WrappedError) {
	if idToken == "" {
		return nil, types.Wrap(errors.New("id token is empty"), types.ErrNotAuthenticated)
	}

	return clientSDK.jwk.ParseClaims(idToken)
}

// Function that will get a user from the database
func (clientSDK *client_SDK) GetUser(idToken string) (*models.UserModel, *types.WrappedError) {
	// Get the user id from the id token
	userId, err := clientSDK.GetUserId(idToken)
	if err != nil {
		return nil, err
	}

	var user models.UserModel
	if err := clientSDK.db.Where("id = ?", userId).First(&user).Error; err != nil {
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	return &user, nil
}

// Function that will update a user in the database
func (clientSDK *client_SDK) UpdateUser(idToken, email, fullName string) *types.WrappedError {
	// Get the user id from the id token
	userId, err := clientSDK.GetUserId(idToken)
	if err != nil {
		return err
	}

	var user models.UserModel
	if err := clientSDK.db.Where("id = ?", userId).First(&user).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	user.Email = email
	user.FullName = fullName

	if err := clientSDK.db.Save(&user).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

// Function that will update a user's full name in the database
func (clientSDK *client_SDK) UpdateUserFullName(idToken, fullName string) *types.WrappedError {
	// Get the user id from the id token
	userId, err := clientSDK.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Get the user's current profile picture using pluck
	var profilePicture string
	if err := clientSDK.db.Model(&models.UserModel{}).
		Where("id = ?", userId).
		Pluck("picture", &profilePicture).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// If the user's profile picture is the default profile picture, update it
	if strings.HasPrefix(profilePicture, "https://cdn.auth0.com/avatars/") {
		if err := clientSDK.db.Model(&models.UserModel{}).
			Where("id = ?", userId).
			Update("picture", getUserPictureURL(fullName)).Error; err != nil {
			return types.Wrap(err, types.ErrInternalServerError)
		}
	}

	if err := clientSDK.db.Model(&models.UserModel{}).
		Where("id = ?", userId).
		Update("full_name", fullName).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

// Function that will send the user an email to verify their email address
func (clientSDK *client_SDK) SendEmailVerificationEmail(user models.UserModel) *types.WrappedError {
	// Create the email verification token
	emailVerificationToken, err := clientSDK.CreateEmailVerificationToken(user)
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

	if _, err := clientSDK.ses.SendEmail(Sender, Subject, HtmlBody, TextBody, ToAddresses, CcAddresses); err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

// Function that will create an email verification token
func (clientSDK *client_SDK) CreateEmailVerificationToken(user models.UserModel) (string, *types.WrappedError) {
	// Create the email verification token
	emailVerificationToken := uuid.New().String()

	// Create the email verification token in the database
	if err := clientSDK.db.Where("user_id = ?", user.ID).Delete(&models.EmailVerificationTokenModel{}).Error; err != nil {
		return "", types.Wrap(err, types.ErrInternalServerError)
	}

	if err := clientSDK.db.Create(&models.EmailVerificationTokenModel{
		Token:     emailVerificationToken,
		UserID:    user.ID,
		ExpiresAt: time.Now().Add(time.Hour * 24 * 7).Unix(),
	}).Error; err != nil {
		return "", types.Wrap(err, types.ErrInternalServerError)
	}

	return emailVerificationToken, nil
}

// Function that will parse the JWT access token and return the user ID
func (clientSDK *client_SDK) GetUserId(idToken string) (string, *types.WrappedError) {
	// Parse the JWT access token
	claims, err := clientSDK.jwk.ParseClaims(idToken)
	if err != nil {
		return "", err
	}

	// Get the user ID from the claims
	userId, ok := claims["sub"].(string)
	if !ok {
		return "", types.Wrap(err, types.ErrNotAuthenticated)
	}

	return userId, nil
}

// Function that will refresh the user's id token from the refresh token
func (clientSDK *client_SDK) RefreshIdToken(refreshToken string) (string, *types.WrappedError) {
	// Get the subject from the refresh token
	userId, err := clientSDK.GetUserId(refreshToken)
	if err != nil {
		return "", err
	}

	// Get the user from the database
	var user models.UserModel
	if err := clientSDK.db.Where("id = ?", userId).First(&user).Error; err != nil {
		return "", types.Wrap(err, types.ErrInternalServerError)
	}

	// Create a new id token
	idToken, err := clientSDK.jwk.CreateUserIdToken(user)
	if err != nil {
		return "", err
	}

	return idToken, nil
}

// Function that will hash the password and return the hashed password
func (clientSDK *client_SDK) hashPassword(password string) (string, *types.WrappedError) {
	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return "", types.Wrap(err, types.ErrInternalServerError)
	}

	return string(hashedPassword), nil
}

// Function that will check if the password is correct
func (clientSDK *client_SDK) checkPasswordHash(password, hashedPassword string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password)) == nil
}

// Function that will create a password reset token
func (clientSDK *client_SDK) CreatePasswordResetToken(idToken string) (string, *types.WrappedError) {
	// Get the user id from the id token
	userId, err := clientSDK.GetUserId(idToken)
	if err != nil {
		return "", err
	}

	// Create the password reset token
	passwordResetToken := uuid.New().String()

	// Create the password reset token in the database
	if err := clientSDK.db.Where("user_id = ?", userId).Delete(&models.PasswordResetTokenModel{}).Error; err != nil {
		return "", types.Wrap(err, types.ErrInternalServerError)
	}

	if err := clientSDK.db.Create(&models.PasswordResetTokenModel{
		Token:     passwordResetToken,
		UserID:    userId,
		ExpiresAt: time.Now().Add(time.Hour * 24 * 7).Unix(),
	}).Error; err != nil {
		return "", types.Wrap(err, types.ErrInternalServerError)
	}

	return passwordResetToken, nil
}

// Function that will reset the user's password
func (clientSDK *client_SDK) ResetPassword(passwordResetToken, newPassword string) *types.WrappedError {
	// Get the user id from the password reset token
	userId, err := clientSDK.GetUserId(passwordResetToken)
	if err != nil {
		return err
	}

	tx := clientSDK.db.Begin()

	// Get the user from the database
	var user models.UserModel
	if err := tx.Where("id = ?", userId).First(&user).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Hash the new password
	hashedPassword, err := clientSDK.hashPassword(newPassword)
	if err != nil {
		tx.Rollback()
		return err
	}

	// Update the user's password
	if err := tx.Model(&user).Update("password", hashedPassword).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// TODO
	// // Delete the password reset token from the database
	// if err := clientSDK.DeletePasswordResetToken(userId); err != nil {
	// 	tx.Rollback()
	// 	return err
	// }

	if err := clientSDK.db.Where("user_id = ?", userId).Delete(&models.PasswordResetTokenModel{}).Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}
