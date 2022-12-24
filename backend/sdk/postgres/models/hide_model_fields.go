package models

import "time"

type DiagramModelNoContent struct {
	ID        string    `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Public    bool      `json:"public"`
	Name      string    `json:"name"`
}
