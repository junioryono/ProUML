package models

import "time"

type DiagramModelHiddenContent struct {
	ID                           string    `json:"id"`
	CreatedAt                    time.Time `json:"created_at"`
	UpdatedAt                    time.Time `json:"updated_at"`
	Public                       bool      `json:"public"`
	Name                         string    `json:"name"`
	Image                        string    `json:"image,omitempty"`
	IsSharedWithCurrentUser      bool      `json:"is_shared_with_current_user"`
	IsFromUnsharedProject        bool      `json:"is_from_unshared_project"`
	CurrentUserHasEditPermission bool      `json:"current_user_has_edit_permission"`
}

type DiagramUserRolesResponse struct {
	Users                    []DiagramUsersRolesHiddenContent `json:"users"`
	EditorPermissionsEnabled *bool                            `json:"editorPermissionsEnabled,omitempty"`
	AllowEditorPermissions   bool                             `json:"allowedToEdit,omitempty"`
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
