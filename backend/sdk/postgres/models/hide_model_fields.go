package models

import "time"

type DiagramModelHiddenContent struct {
	ID        string    `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Public    bool      `json:"public"`
	Name      string    `json:"name"`
}

type DiagramUsersRolesHiddenContent struct {
	UserId    string `json:"user_id"`
	Email     string `json:"email"`
	Role      string `json:"role"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Picture   string `json:"picture"`
}
