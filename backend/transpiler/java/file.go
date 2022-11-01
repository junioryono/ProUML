package java

import (
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func parseFile(file *types.File) ([]byte, error) {
	var returnText []byte

	// Append string to byte slice
	returnText = append(returnText, ""...)

	// Remove all comments
	removeCommentsAndSpacing(&file.Code)

	// Get package name IF one exists

	return returnText, nil
}

func removeCommentsAndSpacing(text *[]byte) ([]byte, error) {
	var returnText []byte

	return returnText, nil
}
