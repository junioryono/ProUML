package models

import (
	"crypto/rsa"
	"time"

	"gorm.io/datatypes"
)

type UserModel struct {
	ID            string `gorm:"uniqueIndex" json:"user_id"`
	Email         string `gorm:"uniqueIndex" json:"email"`
	EmailVerified bool   `gorm:"default:false" json:"email_verified"`
	Password      string `json:"-"`
	CreatedAt     int64  `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt     int64  `gorm:"autoUpdateTime" json:"updated_at"`
	LastLogin     int64  `gorm:"autoCreateTime" json:"last_login"`
	LastIP        string `json:"last_ip"`
	LoginsCount   int    `json:"logins_count"`
	FullName      string `gorm:"default:'John Doe'" json:"full_name"`
	Picture       string `json:"picture"`
	Locale        string `gorm:"default:'en-us'" json:"locale"`
	Role          string `gorm:"default:'user'" json:"role"`
	Disabled      bool   `gorm:"default:false" json:"disabled"`
}

type DiagramModel struct {
	ID        string         `gorm:"uniqueIndex" json:"id"`
	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	Public    bool           `gorm:"default:false" json:"public"`
	Name      string         `gorm:"default:'Untitled Diagram'" json:"name"`
	Content   datatypes.JSON `json:"content"`
}

type DiagramUserRoleModel struct {
	UserID    string       `gorm:"primaryKey" json:"-"`
	DiagramID string       `gorm:"primaryKey" json:"-"`
	User      UserModel    `gorm:"foreignKey:UserID;references:ID" json:"user"`
	Diagram   DiagramModel `gorm:"foreignKey:DiagramID;references:ID" json:"diagram"`
	Role      string       `gorm:"default:'viewer'" json:"role"`
}

type EmailVerificationTokenModel struct {
	Token     string    `gorm:"primaryKey" json:"token"`
	UserID    string    `json:"user_id"`
	User      UserModel `gorm:"foreignKey:UserID;references:ID" json:"user"`
	ExpiresAt int64     `json:"expires_at"`
}

type PasswordResetTokenModel struct {
	Token     string    `gorm:"primaryKey" json:"token"`
	UserID    string    `json:"user_id"`
	User      UserModel `gorm:"foreignKey:UserID;references:ID" json:"user"`
	ExpiresAt int64     `json:"expires_at"`
}

type JWTModel struct {
	ID             string          `gorm:"primaryKey" json:"id"`
	CreatedAt      time.Time       `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt      time.Time       `gorm:"autoUpdateTime" json:"updated_at"`
	PrivateKey     []byte          `json:"private_key"`
	PublicKey      []byte          `json:"public_key"`
	PrivateKeyCert *rsa.PrivateKey `gorm:"-" json:"-"`
	PublicKeyCert  *rsa.PublicKey  `gorm:"-" json:"-"`
	Active         bool            `gorm:"default:true" json:"active"`
}
