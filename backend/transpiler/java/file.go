package java

import (
	"bytes"
	"regexp"

	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func parseFile(file types.File) (*types.FileResponse, error) {
	var (
		fileResponse = &types.FileResponse{Name: file.Name}
		parsedText   = file.Code
		packageName  []byte
	)

	parsedText, err := removeComments(parsedText)
	if err != nil {
		return fileResponse, err
	}

	packageName, err = getPackageName(parsedText)
	if err != nil {
		return fileResponse, err
	}
	fileResponse.Package = string(packageName)

	parsedText, err = removeSpacing(parsedText)
	if err != nil {
		return fileResponse, err
	}

	err = setFileTypeAndAssociations(fileResponse, parsedText)
	if err != nil {
		return fileResponse, err
	}

	// err = setVariablesAndMethods(fileResponse, parsedText)

	// EXAMPLE RESPONSE
	// types.FileResponse{
	//  Package: "",
	// 	Name: "FileName",
	// 	Data: types.JavaClass{
	// 		Implements: [][]byte{},
	// 		Extends:    [][]byte{},
	// 		Variables:  []types.JavaVariable{},
	// 		Methods:    []types.JavaMethod{},
	// 	},
	// }

	return fileResponse, nil
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

// Remove all comments that are not inside of quotations from code
func removeComments(text []byte) ([]byte, error) {
	if len(text) == 0 {
		return nil, &types.CannotParseText{}
	}

	var (
		NoQuote           byte = 0
		SingleQuote       byte = '\''
		DoubleQuote       byte = '"'
		TickerQuote       byte = '`'
		SingleLineComment byte = '/'
		MultiLineComment  byte = '*'
	)

	var (
		startCommentIndex int  = 0
		currentStyle      byte = 0
	)

	removeText := func(i int) {
		text = append(text[:startCommentIndex], text[i+1:]...)
		currentStyle = NoQuote
	}

	for i := 0; i < len(text); i++ {
		if currentStyle == SingleQuote && text[i] == SingleQuote ||
			currentStyle == DoubleQuote && text[i] == DoubleQuote ||
			currentStyle == TickerQuote && text[i] == TickerQuote {
			currentStyle = NoQuote
		} else if currentStyle == NoQuote {
			if text[i] == SingleQuote {
				currentStyle = SingleQuote
			} else if text[i] == DoubleQuote {
				currentStyle = DoubleQuote
			} else if text[i] == TickerQuote {
				currentStyle = TickerQuote
			} else if i+1 < len(text) {
				if text[i] == '/' && text[i+1] == '/' {
					currentStyle = SingleLineComment
					startCommentIndex = i
				} else if text[i] == '/' && text[i+1] == '*' {
					currentStyle = MultiLineComment
					startCommentIndex = i
				}
			}
		} else if currentStyle == SingleLineComment && text[i] == '\n' {
			removeText(i - 1)
			i = startCommentIndex
		} else if currentStyle == MultiLineComment && text[i] == '*' && i+1 < len(text) && text[i+1] == '/' {
			removeText(i + 1)
			i = startCommentIndex
		}
	}

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

func setFileTypeAndAssociations(fileResponse *types.FileResponse, text []byte) error {
	// Search for file name
	// Example return: "public class Test5"
	REGEX_FileName := regexp.MustCompile("[^;]+" + fileResponse.Name + "[^{]*")
	packageDeclarations := REGEX_FileName.Find(text)
	if packageDeclarations == nil {
		return &types.CannotParseText{}
	}

	textSplit := bytes.Split(packageDeclarations, []byte(" "))

	findIndex := func(sWord string) int {
		bWord := []byte(sWord)
		for i, w := range textSplit {
			if bytes.Equal(w, bWord) {
				return i
			}
		}

		return -1
	}

	abstractIndex := findIndex("abstract")
	classIndex := findIndex("class")
	interfaceIndex := findIndex("interface")
	enumIndex := findIndex("enum")

	if (classIndex != -1 && (interfaceIndex != -1 || enumIndex != -1)) ||
		(interfaceIndex != -1 && enumIndex != -1) ||
		(classIndex == -1 && interfaceIndex == -1 && enumIndex == -1) {
		return &types.CannotParseText{}
	}

	// Set enum data
	if enumIndex != -1 {
		fileResponse.Data = types.JavaEnum{}
		return nil
	}

	if classIndex != -1 || interfaceIndex != -1 {
		var extendsValue [][]byte
		extendsIndex := findIndex("extends")
		if extendsIndex != -1 {
			extendsValue = bytes.Split(textSplit[extendsIndex+1], []byte(","))
		}

		// Set class and abstract class data
		if classIndex != -1 {
			isAbstract := abstractIndex == 0 && classIndex == 1

			var implementsValue [][]byte
			implementsIndex := findIndex("implements")
			if implementsIndex != -1 {
				implementsValue = bytes.Split(textSplit[implementsIndex+1], []byte(","))
			}

			if isAbstract {
				fileResponse.Data = types.JavaAbstract{
					Implements: implementsValue,
					Extends:    extendsValue,
				}
				return nil
			}

			fileResponse.Data = types.JavaClass{
				Implements: implementsValue,
				Extends:    extendsValue,
			}
			return nil
		}

		// Set interface data
		fileResponse.Data = types.JavaInterface{
			Extends: extendsValue,
		}
		return nil
	}

	// If all else fails, return parsing error
	return &types.CannotParseText{}
}
