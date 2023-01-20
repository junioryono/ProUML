package templates

import (
	"errors"

	"github.com/junioryono/ProUML/backend/types"
)

func GetTemplate(name string) (*[]any, *types.WrappedError) {
	switch name {
	case "factory_method":
		return getFactoryMethod(), nil
	default:
		return nil, types.Wrap(errors.New("template not found"), types.ErrInvalidRequest)
	}
}
