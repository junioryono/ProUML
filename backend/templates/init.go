package templates

import (
	"encoding/json"
	"errors"

	"github.com/junioryono/ProUML/backend/types"
)

func GetTemplate(name string) (*json.RawMessage, *types.WrappedError) {
	switch name {
	case "factory_method":
		response := getFactoryMethod()
		return &response, nil
	default:
		return nil, types.Wrap(errors.New("template not found"), types.ErrInvalidRequest)
	}
}
