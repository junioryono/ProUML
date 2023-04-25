package types

const (
	ErrInvalidEmail           = "Invalid email."
	ErrEmailAlreadyExists     = "Email already exists."
	ErrInvalidEmailOrPassword = "Incorrect email or password."
	ErrInvalidPassword        = "Incorrect password."
	ErrNotAuthenticated       = "Not authenticated. Please login."
	ErrInternalServerError    = "Internal server error. Please try again later."
	ErrUserAlreadyExists      = "User already exists."
	ErrEmailAlreadyVerified   = "Email already verified."
	ErrInvalidToken           = "Invalid token."
	ErrTokenExpired           = "Token expired."
	ErrInvalidIssuer          = "Invalid issuer."
	ErrDiagramNotFound        = "Diagram not found."
	ErrProjectNotFound        = "Project not found."
	ErrUserNoAccess           = "User has no access to this diagram."
	ErrUserAlreadyAccess      = "User already has access to this diagram."
	ErrInvalidRole            = "Invalid role."
	ErrNotOwnerOrEditor       = "You are not the owner or editor of the diagram."
	ErrCannotChangeAsEditor   = "You cannot change a user's role from editor to viewer as an editor."
	ErrUserIsOwner            = "You cannot change the role of the owner."
	ErrUserSameRole           = "User already has this role."
	ErrCouldNotMarshalJSON    = "Internal Error. Could not marshal JSON."
	ErrUnsupportedLang        = "Unsupported language."
	ErrCouldNotFigureOutLang  = "Could not figure out language."
	ErrInvalidRequest         = "Invalid request."
)

type WrappedError struct {
	Err error
	Str string
}

func (w *WrappedError) Error() string {
	return w.Str
}

func Wrap(err error, str string) *WrappedError {
	return &WrappedError{
		Err: err,
		Str: str,
	}
}
