package models

type DiagramContentUpdate struct {
	Event string `json:"event"`
	Cell  any    `json:"cell"`
}
