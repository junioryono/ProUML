package java

import (
	"bytes"
	"regexp"

	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func parseFile(file *types.File) ([]byte, error) {
	// Need to remove quotations from code to prevent removeComments() from breaking code
	text, err := removeQuotes(file.Code)
	if err != nil {
		return nil, err
	}

	text, err = removeComments(text)
	if err != nil {
		return nil, err
	}

	text, err = getPackageName(text)
	if err != nil {
		return nil, err
	}

	text, err = removeSpacing(text)
	if err != nil {
		return nil, err
	}

	_ = text

	return text, nil
}

// Remove all quotes from code
func removeQuotes(text []byte) ([]byte, error) {
	if len(text) == 0 {
		return nil, &types.CannotParseText{}
	}

	var (
		NoQuote     byte = 0
		SingleQuote byte = '\''
		DoubleQuote byte = '"'
		TickerQuote byte = '`'
	)

	var (
		lastQuoteIndex int  = 0
		currentQuote   byte = 0
	)

	removeText := func(i int) {
		text = append(text[:lastQuoteIndex], text[i+1:]...)
		currentQuote = NoQuote
	}

	for i := 0; i < len(text); i++ {
		if currentQuote == NoQuote {
			if text[i] == SingleQuote {
				currentQuote = SingleQuote
				lastQuoteIndex = i
			} else if text[i] == DoubleQuote {
				currentQuote = DoubleQuote
				lastQuoteIndex = i
			} else if text[i] == TickerQuote {
				currentQuote = TickerQuote
				lastQuoteIndex = i
			}
		} else if currentQuote == SingleQuote && text[i] == SingleQuote {
			removeText(i)
		} else if currentQuote == DoubleQuote && text[i] == DoubleQuote {
			removeText(i)
		} else if currentQuote == TickerQuote && text[i] == TickerQuote {
			removeText(i)
		}
	}

	return text, nil
}

// Get package name from code if one exists
func getPackageName(text []byte) ([]byte, error) {
	if len(text) == 0 {
		return nil, &types.CannotParseText{}
	}

	REGEX_FirstOpenCurly := regexp.MustCompile(`\{`)
	firstOpenCurlyIndex := REGEX_FirstOpenCurly.FindIndex(text)

	// Find package declaration
	// Example return: "  package   com.main.prouml  ;       "
	// Make sure when finding 'package' keyword, we are on the outside scope
	// If there is no scope increment in the code, return error
	// If there is a scope increment, but there's no package declaration, return nil byte slice with no error
	// If there is a scope increment, and there's a package declaration inside the scope, return nil byte slice with no error
	REGEX_PackageDeclaration := regexp.MustCompile(`[\s\S]*?package[\s\S][^;]*`)
	packageDeclarationIndex := REGEX_PackageDeclaration.FindIndex(text)

	if len(firstOpenCurlyIndex) == 0 {
		return nil, &types.CannotParseText{}
	}

	if len(packageDeclarationIndex) == 0 || packageDeclarationIndex[len(packageDeclarationIndex)-1] > firstOpenCurlyIndex[len(firstOpenCurlyIndex)-1] {
		return nil, nil
	}

	text = REGEX_PackageDeclaration.Find(text)

	// Remove package keyword and whitespacing
	// Example return: "com.main.prouml       "
	REGEX_PackageRemoval := regexp.MustCompile(`[\s]*package[\s]*`)
	text = REGEX_PackageRemoval.ReplaceAll(text, nil)

	// Remove package keyword and whitespacing
	// Example return: "com.main.prouml"
	REGEX_SemiColonRemoval := regexp.MustCompile(`[\s]*;[\s]*`)
	text = REGEX_SemiColonRemoval.ReplaceAll(text, nil)

	// Trim left and right spacing
	text = bytes.TrimSpace(text)

	return text, nil
}

// Remove all comments from code
func removeComments(text []byte) ([]byte, error) {
	if len(text) == 0 {
		return nil, &types.CannotParseText{}
	}

	// Replace all single line quotes with an empty string
	REGEX_SingleLine := regexp.MustCompile(`\/\/.*`)
	text = REGEX_SingleLine.ReplaceAll(text, nil)

	// Replace all multi line quotes with an empty string
	REGEX_MultiLine := regexp.MustCompile(`\/\*[\s\S]*?\*\/`)
	text = REGEX_MultiLine.ReplaceAll(text, nil)

	return text, nil
}

// Remove all extra spacing from code
func removeSpacing(text []byte) ([]byte, error) {
	if len(text) == 0 {
		return nil, &types.CannotParseText{}
	}

	// Remove package declaration
	REGEX_Package := regexp.MustCompile(`[\s\S]*?package[\s\S]*?;[\s]*`)
	text = REGEX_Package.ReplaceAll(text, nil)

	// Remove all imports
	REGEX_Imports := regexp.MustCompile(`[\s\S]*?import[\s\S]*?;[\s]*`)
	text = REGEX_Imports.ReplaceAll(text, []byte(" "))

	// Replace all new lines with a space
	REGEX_NewLine := regexp.MustCompile(`\r?\n|\r`)
	text = REGEX_NewLine.ReplaceAll(text, []byte(" "))

	// Replace all double spaces with a single space
	REGEX_DoubleSpace := regexp.MustCompile(`\s\s+`)
	text = REGEX_DoubleSpace.ReplaceAll(text, []byte(" "))

	// Remove all spaces before and after ,
	REGEX_CommaSpace := regexp.MustCompile(`\s*,\s*`)
	text = REGEX_CommaSpace.ReplaceAll(text, []byte(","))

	// Remove all spaces before and after ;
	REGEX_SemiColonSpace := regexp.MustCompile(`\s*;\s*`)
	text = REGEX_SemiColonSpace.ReplaceAll(text, []byte(";"))

	// Remove all spaces before and after {
	REGEX_OpenCurlySpace := regexp.MustCompile(`\s*{\s*`)
	text = REGEX_OpenCurlySpace.ReplaceAll(text, []byte("{"))

	// Remove all spaces before and after }
	REGEX_CloseCurlySpace := regexp.MustCompile(`\s*}\s*`)
	text = REGEX_CloseCurlySpace.ReplaceAll(text, []byte("}"))

	// Replace all "=", " =", and "= " with " = "
	REGEX_EqualSpace := regexp.MustCompile(`[\s]*=[\s]*`)
	text = REGEX_EqualSpace.ReplaceAll(text, []byte(" = "))

	// Trim left and right spacing
	text = bytes.TrimSpace(text)

	return text, nil
}
