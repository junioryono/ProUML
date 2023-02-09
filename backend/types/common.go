package types

import "github.com/junioryono/ProUML/backend/sdk/postgres/models"

type Status struct {
	Success  bool   `json:"success"`
	Reason   string `json:"reason,omitempty"`
	Response any    `json:"response,omitempty"`
}

type WebSocketBody struct {
	SessionId string `json:"sessionId,omitempty"`
	Events    string `json:"event"`

	Public bool                              `json:"public,omitempty"`
	Image  string                            `json:"image,omitempty"`
	Name   string                            `json:"name,omitempty"`
	Cell   map[string]interface{}            `json:"cell,omitempty"`
	User   *models.DiagramUsersHiddenContent `json:"user,omitempty"`
}
