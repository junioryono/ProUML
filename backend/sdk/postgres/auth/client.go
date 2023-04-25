package auth

import (
	"errors"
	"fmt"
	"regexp"
	"strings"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/postgres/jwk"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/sdk/sendgrid"
	"github.com/junioryono/ProUML/backend/types"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type client_SDK struct {
	auth     *Auth_SDK
	getDb    func() *gorm.DB
	jwk      *jwk.JWK_SDK
	sendgrid *sendgrid.SendGrid_SDK
}

// Function that will authenticate the user
// Returns the users id token and refresh token
func (clientSDK *client_SDK) AuthenticateUser(userIPAddress, email, password string) (models.UserModel, string, string, *types.WrappedError) {
	if email == "" || password == "" {
		return models.UserModel{}, "", "", types.Wrap(errors.New("email or password is empty"), types.ErrInvalidEmailOrPassword)
	}

	// Get the user from the database
	var user models.UserModel
	if err := clientSDK.getDb().Where("email = ?", email).First(&user).Error; err != nil {
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

	if err := clientSDK.getDb().Save(&user).Error; err != nil {
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
	if email == "" || password == "" {
		return models.UserModel{}, "", "", types.Wrap(errors.New("email or password is empty"), types.ErrInvalidEmailOrPassword)
	}

	if !isValidEmail(email) {
		return models.UserModel{}, "", "", types.Wrap(errors.New("invalid email"), types.ErrInvalidEmail)
	}

	// Check if the user already exists
	var user models.UserModel
	if err := clientSDK.getDb().Where("email = ?", email).First(&user).Error; err == nil {
		return user, "", "", types.Wrap(err, types.ErrUserAlreadyExists)
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return user, "", "", types.Wrap(err, types.ErrInternalServerError)
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
	if err := clientSDK.getDb().Create(&user).Error; err != nil {
		return user, "", "", types.Wrap(err, types.ErrInternalServerError)
	}

	// Create the user's id token, access token, and refresh token using postgres
	idToken, refreshToken, err := clientSDK.auth.createUserTokens(user)
	if err != nil {
		return user, "", "", types.Wrap(err, types.ErrInternalServerError)
	}

	// Send the user an email to verify their email address in a separate goroutine
	go func() {
		err := clientSDK.SendEmailVerificationEmail(user)
		fmt.Println("SendEmailVerificationEmail error:", err)
	}()

	return user, idToken, refreshToken, nil
}

// Function that will delete a user from the database
func (clientSDK *client_SDK) DeleteUser(idToken string) *types.WrappedError {
	// Get the user id from the access token
	userId, err := clientSDK.GetUserId(idToken)
	if err != nil {
		return types.Wrap(err, types.ErrNotAuthenticated)
	}

	tx := clientSDK.getDb().Begin()

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

	// Use Join to delete all project_user_role_models where project_user_role_models.user_id = userId
	if err := tx.Table("project_user_role_models").
		Joins("JOIN user_models ON user_models.id = project_user_role_models.user_id").
		Where("project_user_role_models.user_id = ?", userId).
		Delete(&models.ProjectUserRoleModel{}).Error; err != nil {
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
	if err := clientSDK.getDb().Where("id = ?", userId).First(&user).Error; err != nil {
		return types.Wrap(err, types.ErrNotAuthenticated)
	}

	// Check if the user's email has already been verified
	if user.EmailVerified {
		return types.Wrap(err, types.ErrEmailAlreadyVerified)
	}

	// Send the user an email to verify their email address in a separate goroutine
	return clientSDK.SendEmailVerificationEmail(user)
}

// Function that will verify the user's email address
func (clientSDK *client_SDK) VerifyEmail(emailVerificationToken string) *types.WrappedError {
	// Get the email verification token from the database
	var emailVerificationTokenModel models.EmailVerificationTokenModel
	if err := clientSDK.getDb().Where("token = ?", emailVerificationToken).First(&emailVerificationTokenModel).Error; err != nil {
		return types.Wrap(err, types.ErrInvalidToken)
	}

	// Check if the email verification token has expired
	if emailVerificationTokenModel.ExpiresAt < time.Now().Unix() {
		return types.Wrap(errors.New("email token expired"), types.ErrTokenExpired)
	}

	// Get the user from the database
	var user models.UserModel
	if err := clientSDK.getDb().Where("id = ?", emailVerificationTokenModel.UserID).First(&user).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Update the user's email verified status
	user.EmailVerified = true

	if err := clientSDK.getDb().Save(&user).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Delete the email verification token from the database
	if err := clientSDK.getDb().Delete(&emailVerificationTokenModel).Error; err != nil {
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
	if err := clientSDK.getDb().Where("id = ?", userId).First(&user).Error; err != nil {
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	return &user, nil
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
	if err := clientSDK.getDb().Model(&models.UserModel{}).
		Where("id = ?", userId).
		Pluck("picture", &profilePicture).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// If the user's profile picture is the default profile picture, update it
	if strings.HasPrefix(profilePicture, "https://cdn.auth0.com/avatars/") {
		if err := clientSDK.getDb().Model(&models.UserModel{}).
			Where("id = ?", userId).
			Update("picture", getUserPictureURL(fullName)).Error; err != nil {
			return types.Wrap(err, types.ErrInternalServerError)
		}
	}

	if err := clientSDK.getDb().Model(&models.UserModel{}).
		Where("id = ?", userId).
		Update("full_name", fullName).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

// Function that will update a user's email in the database
func (clientSDK *client_SDK) UpdateUserEmail(idToken, newEmail string) *types.WrappedError {
	// Get the user id from the id token
	userId, err := clientSDK.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Validate the new email
	if !isValidEmail(newEmail) {
		return types.Wrap(errors.New("invalid email"), types.ErrInvalidRequest)
	}

	// Check if the user already exists
	var user models.UserModel
	if err := clientSDK.getDb().Where("email = ?", newEmail).First(&user).Error; err == nil {
		return types.Wrap(err, types.ErrUserAlreadyExists)
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Update the user's email in the database
	if err := clientSDK.getDb().Model(&models.UserModel{}).
		Where("id = ?", userId).
		Update("email", newEmail).Error; err != nil {
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
		SenderName     = "ProUML"
		SenderEmail    = "no-reply@prouml.com"
		Subject        = "ProUML Account Verification"
		ToAddressName  = user.FullName
		ToAddressEmail = user.Email
		TextBody       = "Verify your email by clicking this link: https://prouml.com/verify-email/" + emailVerificationToken
		HtmlBody       = "Click <a href=\"https://prouml.com/verify-email/" + emailVerificationToken + "\">here</a> to verify your email."
	)

	if _, err := clientSDK.sendgrid.SendEmail(SenderName, SenderEmail, Subject, ToAddressName, ToAddressEmail, TextBody, HtmlBody); err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

// Function that will create an email verification token
func (clientSDK *client_SDK) CreateEmailVerificationToken(user models.UserModel) (string, *types.WrappedError) {
	// Create the email verification token
	emailVerificationToken := uuid.New().String()

	// Create the email verification token in the database
	if err := clientSDK.getDb().Where("user_id = ?", user.ID).Delete(&models.EmailVerificationTokenModel{}).Error; err != nil {
		return "", types.Wrap(err, types.ErrInternalServerError)
	}

	if err := clientSDK.getDb().Create(&models.EmailVerificationTokenModel{
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
	if err := clientSDK.getDb().Where("id = ?", userId).First(&user).Error; err != nil {
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

func (clientSDK *client_SDK) ChangePassword(idToken, oldPassword, newPassword string) *types.WrappedError {
	// Get the user id from the id token
	userId, err := clientSDK.GetUserId(idToken)
	if err != nil {
		return err
	}

	// Get the user from the database
	var user models.UserModel
	if err := clientSDK.getDb().Where("id = ?", userId).First(&user).Error; err != nil {
		fmt.Println("err1", err)
		return types.Wrap(err, types.ErrInternalServerError)
	}

	if user.EmailVerified {
		// Users that have a verified email must change their password using the email verification token
		return types.Wrap(err, types.ErrInvalidRequest)
	}

	// Check if the old password is correct
	if !clientSDK.checkPasswordHash(oldPassword, user.Password) {
		return types.Wrap(err, types.ErrInvalidPassword)
	}

	// Hash the new password
	hashedPassword, err := clientSDK.hashPassword(newPassword)
	if err != nil {
		return err
	}

	// Update the user's password
	if err := clientSDK.getDb().Model(&user).Update("password", hashedPassword).Error; err != nil {
		fmt.Println("err2", err)
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (clientSDK *client_SDK) ForgotPassword(email string) *types.WrappedError {
	// Get the user from the database
	var user models.UserModel
	if err := clientSDK.getDb().Where("email = ?", email).First(&user).Error; err != nil {
		// We don't want to tell the user that the email doesn't exist
		return nil
	}

	// Delete any existing password reset tokens
	if err := clientSDK.getDb().Where("user_id = ?", user.ID).Delete(&models.PasswordResetTokenModel{}).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	// Create the password reset token
	passwordResetToken := uuid.New().String()

	// Create the password reset token in the database
	if err := clientSDK.getDb().Create(&models.PasswordResetTokenModel{
		Token:     passwordResetToken,
		UserID:    user.ID,
		ExpiresAt: time.Now().Add(time.Hour * 24 * 7).Unix(),
	}).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	var (
		SenderName     = "ProUML"
		SenderEmail    = "no-reply@prouml.com"
		Subject        = "ProUML Password Reset"
		ToAddressName  = user.FullName
		ToAddressEmail = user.Email
		TextBody       = "Reset your password by clicking this link: https://prouml.com/reset-password/" + passwordResetToken
		HtmlBody       = "Click <a href=\"https://prouml.com/reset-password/" + passwordResetToken + "\">here</a> to reset your password."
	)

	if _, err := clientSDK.sendgrid.SendEmail(SenderName, SenderEmail, Subject, ToAddressName, ToAddressEmail, TextBody, HtmlBody); err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

func (clientSDK *client_SDK) VerifyPasswordResetToken(passwordResetToken string) (*models.PasswordResetTokenModel, *types.WrappedError) {
	// Get the password reset token from the database
	var passwordResetTokenModel models.PasswordResetTokenModel
	if err := clientSDK.getDb().Where("token = ?", passwordResetToken).First(&passwordResetTokenModel).Error; err != nil {
		return nil, types.Wrap(err, types.ErrInternalServerError)
	}

	// Check if the password reset token has expired
	if passwordResetTokenModel.ExpiresAt < time.Now().Unix() {
		return nil, types.Wrap(errors.New("password reset token has expired"), types.ErrTokenExpired)
	}

	return &passwordResetTokenModel, nil
}

// Function that will reset the user's password
func (clientSDK *client_SDK) ResetPassword(passwordResetToken, newPassword string) *types.WrappedError {
	fmt.Println("Resetting password")
	passwordResetTokenModel, err := clientSDK.VerifyPasswordResetToken(passwordResetToken)
	if err != nil {
		return err
	}

	fmt.Println("Password reset token verified")
	// Hash the new password
	hashedPassword, err := clientSDK.hashPassword(newPassword)
	if err != nil {
		return err
	}

	fmt.Println("Password hashed")
	// Update the user's password
	if err := clientSDK.getDb().Model(&models.UserModel{}).Where("id = ?", passwordResetTokenModel.UserID).Update("password", hashedPassword).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	fmt.Println("Password updated")
	// Delete the password reset token
	if err := clientSDK.getDb().Where("token = ?", passwordResetToken).Delete(&models.PasswordResetTokenModel{}).Error; err != nil {
		return types.Wrap(err, types.ErrInternalServerError)
	}

	return nil
}

// Helper function to validate email format
func isValidEmail(email string) bool {
	emailRegex := `^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$`
	re := regexp.MustCompile(emailRegex)
	return re.MatchString(email)
}
