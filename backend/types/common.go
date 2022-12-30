package types

type Status struct {
	Success  bool   `json:"success"`
	Reason   string `json:"reason,omitempty"`
	Response any    `json:"response,omitempty"`
}
