package models

import (
	"crypto/rsa"
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

type ClusterModel struct {
	ID        string `gorm:"primaryKey" json:"id"`
	CreatedAt int64  `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt int64  `gorm:"autoUpdateTime" json:"updated_at"`
	Master    bool   `gorm:"default:false" json:"master"`
}

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

type ProjectModel struct {
	ID        string                 `gorm:"uniqueIndex" json:"id"`
	CreatedAt time.Time              `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time              `gorm:"autoUpdateTime" json:"updated_at"`
	Public    bool                   `gorm:"default:false" json:"public"`
	Name      string                 `gorm:"default:'Untitled Project'" json:"name"`
	Diagrams  []DiagramModel         `gorm:"foreignKey:ProjectID;references:ID" json:"diagrams"`
	UserRoles []ProjectUserRoleModel `gorm:"foreignKey:ProjectID;references:ID" json:"user_roles"`
}

type ProjectUserRoleModel struct {
	UserID    string       `gorm:"primaryKey" json:"-"`
	ProjectID string       `gorm:"primaryKey" json:"-"`
	User      UserModel    `gorm:"foreignKey:UserID;references:ID" json:"user"`
	Project   ProjectModel `gorm:"foreignKey:ProjectID;references:ID" json:"project"`
	Owner     bool         `gorm:"default:false" json:"owner"`
}

type DiagramModel struct {
	ID                     string                 `gorm:"uniqueIndex" json:"id"`
	CreatedAt              time.Time              `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt              time.Time              `gorm:"autoUpdateTime" json:"updated_at"`
	Public                 bool                   `gorm:"default:false" json:"public"`
	Name                   string                 `gorm:"default:'Untitled Diagram'" json:"name"`
	Image                  string                 `json:"image,omitempty"`
	Content                DiagramContent         `gorm:"type:jsonb;default:'[]';not null" json:"content"`
	ProjectID              string                 `gorm:"default:'default'" json:"project_id"`
	Project                *ProjectModel          `gorm:"foreignKey:ProjectID;references:ID" json:"project,omitempty"`
	BackgroundColor        string                 `gorm:"default:FFFFFF" json:"background_color"`
	ShowGrid               bool                   `gorm:"default:true" json:"show_grid"`
	AllowEditorPermissions bool                   `gorm:"default:true" json:"-"`
	UserRoles              []DiagramUserRoleModel `gorm:"foreignKey:DiagramID;references:ID" json:"user_roles"`
	Issues                 []IssueModel           `gorm:"foreignKey:DiagramID;references:ID" json:"issues"`
}

type DiagramContent json.RawMessage

// Scan scan value into Jsonb, implements sql.Scanner interface
func (d *DiagramContent) Scan(value interface{}) error {
	bytes, ok := value.([]byte)
	if !ok {
		return fmt.Errorf("failed to unmarshal JSONB value: %v", errors.New("type assertion .([]byte) failed"))
	}

	result := json.RawMessage{}
	err := json.Unmarshal(bytes, &result)
	*d = DiagramContent(result)
	return err
}

// Value return json value, implement driver.Valuer interface
func (d DiagramContent) Value() (driver.Value, error) {
	if len(d) == 0 {
		return nil, nil
	}
	return json.RawMessage(d).MarshalJSON()
}

func (d *DiagramContent) MarshalJSON() ([]byte, error) {
	return json.Marshal((*json.RawMessage)(d))
}

func (d *DiagramContent) UnmarshalJSON(data []byte) error {
	return json.Unmarshal(data, (*json.RawMessage)(d))
}

func (DiagramContent) GormDBDataType(db *gorm.DB, field *schema.Field) string {
	return "jsonb"
}

type DiagramUserRoleModel struct {
	UserID    string       `gorm:"primaryKey" json:"-"`
	DiagramID string       `gorm:"primaryKey" json:"-"`
	User      UserModel    `gorm:"foreignKey:UserID;references:ID" json:"user"`
	Diagram   DiagramModel `gorm:"foreignKey:DiagramID;references:ID" json:"diagram"`
	Role      string       `gorm:"default:'viewer'" json:"role"`
}

type IssueModel struct {
	ID             string         `gorm:"uniqueIndex" json:"id"`
	DiagramID      string         `json:"-"`
	Diagram        DiagramModel   `gorm:"foreignKey:DiagramID;references:ID" json:"diagram"`
	CreatedAt      time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt      time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	CreatedByID    string         `json:"-"`
	CreatedBy      UserModel      `gorm:"foreignKey:CreatedByID;references:ID" json:"created_by"`
	ConnectedCells pq.StringArray `gorm:"type:text[]" json:"connected_cells"`
	Title          string         `json:"title"`
	Description    string         `json:"description"`
	Image          string         `json:"image"`
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
