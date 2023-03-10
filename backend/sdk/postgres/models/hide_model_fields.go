package models

import "time"

type DiagramModelHiddenContent struct {
	ID         string    `json:"id"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
	Public     bool      `json:"public"`
	Name       string    `json:"name"`
	Image      string    `json:"image,omitempty"`
	HasProject bool      `json:"has_project,omitempty"`
}

type DiagramUserRolesResponse struct {
	Users                  []DiagramUsersRolesHiddenContent `json:"users"`
	AllowEditorPermissions bool                             `json:"allowedToEdit,omitempty"`
}

type DiagramUsersRolesHiddenContent struct {
	UserId   string `json:"user_id"`
	Email    string `json:"email"`
	Role     string `json:"role"`
	FullName string `json:"full_name"`
	Picture  string `json:"picture"`
}

type DiagramUsersHiddenContent struct {
	UserId   string `json:"user_id"`
	Email    string `json:"email"`
	FullName string `json:"full_name"`
	Picture  string `json:"picture"`
}

type ProjectModelWithDiagrams struct {
	ID        string                      `json:"id"`
	CreatedAt time.Time                   `json:"created_at"`
	UpdatedAt time.Time                   `json:"updated_at"`
	Name      string                      `json:"name"`
	Diagrams  []DiagramModelHiddenContent `gorm:"-" json:"diagrams"`
}
