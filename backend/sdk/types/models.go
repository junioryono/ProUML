package types

import (
	"crypto/rsa"
	"time"

	"gorm.io/datatypes"
)

type UserModel struct {
	ID            string `gorm:"primaryKey" json:"user_id"`
	Email         string `gorm:"primaryKey" json:"email"`
	EmailVerified bool   `gorm:"default:false" json:"email_verified"`
	Password      string `json:"-"`
	CreatedAt     int64  `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt     int64  `gorm:"autoUpdateTime" json:"updated_at"`
	LastLogin     int64  `gorm:"autoCreateTime" json:"last_login"`
	LastIP        string `json:"last_ip"`
	LoginsCount   int    `json:"logins_count"`
	FirstName     string `gorm:"default:'John'" json:"first_name"`
	LastName      string `gorm:"default:'Doe'" json:"last_name"`
	Picture       string `gorm:"default:'https://cdn.auth0.com/avatars/jd.png'" json:"picture"`
	Locale        string `gorm:"default:'en-us'" json:"locale"`
	Role          string `gorm:"default:'user'" json:"role"`
	Disabled      bool   `gorm:"default:false" json:"disabled"`
}

type DiagramModel struct {
	ID        string         `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	Public    bool           `gorm:"default:false" json:"public"`
	Name      string         `gorm:"default:'Untitled Diagram'" json:"name"`
	Content   datatypes.JSON `json:"content"`
}

type DiagramUserRoleModel struct {
	UserID    string `gorm:"primaryKey" json:"user_id"`
	DiagramID string `gorm:"primaryKey" json:"diagram_id"`
	Role      string `gorm:"default:'viewer'" json:"role"`
}

type EmailVerificationTokenModel struct {
	Token     string `gorm:"primaryKey" json:"token"`
	UserID    string `json:"user_id"`
	ExpiresAt int64  `json:"expires_at"`
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
