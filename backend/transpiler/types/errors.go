package types

type CannotParseText struct{}

func (e *CannotParseText) Error() string {
	return "cannot parse text"
}
