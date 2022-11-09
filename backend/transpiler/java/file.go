package java

import (
	"bytes"
	"regexp"

	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func parseFile(file types.File) (*types.FileResponse, error) {
	var (
		response    = &types.FileResponse{Package: "", Data: make([]any, 0)}
		parsedText  = file.Code
		packageName []byte
	)

	parsedText, err := removeComments(parsedText)
	if err != nil {
		return nil, err
	}

	packageName, err = getPackageName(parsedText)
	if err != nil {
		return nil, err
	}

	parsedText, err = removeSpacing(parsedText)
	if err != nil {
		return nil, err
	}

	classes, err := getFileClasses(file.Name, parsedText)
	if err != nil {
		return nil, err
	}

	response.Package = string(packageName)
	response.Data = append(response.Data, classes...)

	// err = setVariablesAndMethods(fileResponse, parsedText)

	// EXAMPLE RESPONSE
	// types.FileResponse{
	//  	Package: "",
	// 		Data: [
	//			types.JavaClass{
	//				Name: "ClassName",
	// 				Implements: [][]byte{},
	// 				Extends:    [][]byte{},
	// 				Variables:  []types.JavaVariable{},
	// 				Methods:    []types.JavaMethod{},
	// 			},
	//		]
	// }

	return response, nil
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

func getFileClasses(fileName string, text []byte) ([]any, error) {
	// Search for file name
	// Example return: "public class Test5"
	var (
		classesText   = make([]types.ClassText, 0)
		classesStruct = make([]any, 0)
	)

	getInnerClasses(&classesText, text, false)

	if len(classesText) == 0 {
		return nil, &types.CannotParseText{}
	}

	findIndex := func(sWord string, dbArray [][]byte) int {
		bWord := []byte(sWord)
		for i, w := range dbArray {
			if bytes.Equal(w, bWord) {
				return i
			}
		}

		return -1
	}

	for i := 0; i < len(classesText); i++ {
		textSplit := bytes.Split(classesText[i].Outside, []byte(" "))

		abstractIndex := findIndex("abstract", textSplit)
		classIndex := findIndex("class", textSplit)
		interfaceIndex := findIndex("interface", textSplit)
		enumIndex := findIndex("enum", textSplit)

		if (classIndex != -1 && (interfaceIndex != -1 || enumIndex != -1)) ||
			(interfaceIndex != -1 && enumIndex != -1) ||
			(classIndex == -1 && interfaceIndex == -1 && enumIndex == -1) {
			continue
		}

		// Set enum data
		if enumIndex != -1 {
			classesStruct = append(classesStruct, types.JavaEnum{
				DefinedWithin: classesText[i].DefinedWithin,
				Name:          textSplit[enumIndex+1],
				Declarations:  classesText[i].Declarations,
			})
			continue
		}

		if classIndex == -1 && interfaceIndex == -1 {
			continue
		}

		var extendsValue [][]byte
		extendsIndex := findIndex("extends", textSplit)
		if extendsIndex != -1 {
			extendsValue = bytes.Split(textSplit[extendsIndex+1], []byte(","))
		}

		if interfaceIndex != -1 {
			classesStruct = append(classesStruct, types.JavaInterface{
				DefinedWithin: classesText[i].DefinedWithin,
				Name:          textSplit[interfaceIndex+1],
				Extends:       extendsValue,
				Variables:     classesText[i].Variables,
				Methods:       classesText[i].Methods,
			})
			continue
		}

		var implementsValue [][]byte
		implementsIndex := findIndex("implements", textSplit)
		if implementsIndex != -1 {
			implementsValue = bytes.Split(textSplit[implementsIndex+1], []byte(","))
		}

		if abstractIndex != -1 {
			classesStruct = append(classesStruct, types.JavaAbstract{
				DefinedWithin: classesText[i].DefinedWithin,
				Name:          textSplit[classIndex+1],
				Implements:    implementsValue,
				Extends:       extendsValue,
				Variables:     classesText[i].Variables,
				Methods:       classesText[i].Methods,
			})
			continue
		}

		classesStruct = append(classesStruct, types.JavaClass{
			DefinedWithin: classesText[i].DefinedWithin,
			Name:          textSplit[classIndex+1],
			Implements:    implementsValue,
			Extends:       extendsValue,
			Variables:     classesText[i].Variables,
			Methods:       classesText[i].Methods,
		})
	}

	return classesStruct, nil
}

func getInnerClasses(classesText *[]types.ClassText, text []byte, isNested bool) {
	var (
		NoQuote     byte = 0
		SingleQuote byte = '\''
		DoubleQuote byte = '"'
		TickerQuote byte = '`'
		OpenCurly   byte = '{'
		ClosedCurly byte = '}'
		SemiColon   byte = ';'
	)

	var (
		startScopeIndex int  = 0
		currentStyle    byte = 0
		currentScope    int  = 0
	)

	isClassDeclaration := func(word []byte) bool {
		return bytes.Equal(word, []byte("abstract")) || bytes.Equal(word, []byte("class")) || bytes.Equal(word, []byte("interface")) || bytes.Equal(word, []byte("enum"))
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
			} else if text[i] == OpenCurly {
				if currentScope == 0 {
					startScopeIndex = i
				}

				currentScope++
			} else if text[i] == ClosedCurly {
				currentScope--

				if startScopeIndex != 0 && currentScope == 0 {
					if i+1 < len(text) && text[i+1] == SemiColon {
						i++
					}

					for j := startScopeIndex; j >= 0; j-- {
						if j == 0 || text[j-1] == SemiColon || text[j-1] == ClosedCurly {
							var (
								definedWithin []byte
								outerText     []byte
							)
							outerText = append(outerText, text[j:startScopeIndex]...)
							outerTextSplit := bytes.Split(outerText, []byte(" "))
							innerText := text[startScopeIndex+1 : i]

							if len(outerTextSplit) > 5 && isClassDeclaration(outerTextSplit[4]) ||
								len(outerTextSplit) > 4 && isClassDeclaration(outerTextSplit[3]) ||
								len(outerTextSplit) > 3 && isClassDeclaration(outerTextSplit[2]) ||
								len(outerTextSplit) > 2 && isClassDeclaration(outerTextSplit[1]) ||
								len(outerTextSplit) > 1 && isClassDeclaration(outerTextSplit[0]) {

								if isNested {
									previousInnerText := (*classesText)[len(*classesText)-1].Inside

									if text[i] == SemiColon {
										innerText = text[startScopeIndex+1 : i-1]
									}

									index := bytes.Index(previousInnerText, outerText)
									if index != -1 {
										var (
											currentInnerStyle byte = 0
											innerScopeNumber  int  = 0
											endingIndex            = len(previousInnerText) - 1
										)

										for k := index; k < len(previousInnerText); k++ {
											if currentInnerStyle == SingleQuote && previousInnerText[k] == SingleQuote ||
												currentInnerStyle == DoubleQuote && previousInnerText[k] == DoubleQuote ||
												currentInnerStyle == TickerQuote && previousInnerText[k] == TickerQuote {
												currentInnerStyle = NoQuote
											} else if currentInnerStyle == NoQuote {
												if previousInnerText[k] == SingleQuote {
													currentInnerStyle = SingleQuote
												} else if previousInnerText[k] == DoubleQuote {
													currentInnerStyle = DoubleQuote
												} else if previousInnerText[k] == TickerQuote {
													currentInnerStyle = TickerQuote
												} else if previousInnerText[k] == OpenCurly {
													innerScopeNumber++
												} else if previousInnerText[k] == ClosedCurly {
													innerScopeNumber--

													if k+1 < len(previousInnerText) && previousInnerText[k+1] == SemiColon {
														k++
													}

													if innerScopeNumber == 0 {
														endingIndex = k
														break
													}
												}
											}
										}

										(*classesText)[len(*classesText)-1].Inside = append(previousInnerText[0:index], previousInnerText[endingIndex+1:]...)
										previousOuterText := (*classesText)[len(*classesText)-1].Outside
										previousOuterTextSplit := bytes.Split(previousOuterText, []byte(" "))
										definedWithin = previousOuterTextSplit[len(previousOuterTextSplit)-1]
									}
								}

								// ===============================================================================
								// required variables for struct
								var declarations [][]byte
								var variables []types.JavaVariable
								var methods []types.JavaMethod

								_ = declarations
								_ = variables
								_ = methods
								
								// getting variables and methods
								currentDeclarationScope := 0
								inMethod := false
								currentMethodScope := 0
							
								for m := 0; m < len(innerText); m++ {
									
									// once an open curly brace is found
									if !inMethod && innerText[m] == '{' {
										currentMethodScope = m + 1
							
										// indicate that we need to get all content until closed brace is found
										inMethod = true
							
									// once a closed curly brace is found
									} else if inMethod && innerText[m] == '}' {
										// get entire function declaration
										funcDeclaration := innerText[currentDeclarationScope : m-1]
										_ = funcDeclaration
							
										// get parameters in function (if they exist)
										openParenthesisIndex := bytes.Index(funcDeclaration, []byte("("))
										closedParenthesisIndex := bytes.Index(funcDeclaration, []byte(")"))
										// params only exist if these parenthesis are not next to each other
										if openParenthesisIndex != (closedParenthesisIndex + 1) {
											paramList := innerText[openParenthesisIndex+1 : closedParenthesisIndex-1]
											paramListSplit := bytes.Split(paramList, []byte(","))
											_ = paramListSplit

											// MOREE TOOO DOOOO !!!!
										}

										// MORE TO DOOOO !!!!!
										
										// store content inside function implementation
										funcImplementation := innerText[currentMethodScope : m-1]
										_ = funcImplementation
							
										// indicate that we are done getting stuff in the method
										inMethod = false

									// once a semi colon is found
									} else if !inMethod && innerText[m] == ';' {
										// get all stuff before the semicolon
										semiDeclaration := innerText[currentDeclarationScope : m-1]

										// if there's an "abstract" in the declaration, it's a method, not variable
										if bytes.Equal(semiDeclaration, []byte("abstract")) {
											// process method
											var method types.JavaMethod
											_ = method

											semiDeclarationSplit := bytes.Split(semiDeclaration, []byte(" "))
											_ = semiDeclarationSplit

											// MORE TO DOOOOOO!!!!!

											currentDeclarationScope = m + 1
							
										// otherwise, the declaration before the semicolon will always be a variable
										} else {
											var variable types.JavaVariable

											// if the variable is initialized, store the value
											if bytes.Equal(semiDeclaration, []byte(" = ")) {
												// get the stuff after the equal sign to the current semicolon index
												equalIndex := bytes.Index(semiDeclaration, []byte(" = "))
												variable.Value = innerText[equalIndex+1 : m-1]

												//get rid of value portion from declaration to process rest of variable
												semiDeclaration = innerText[currentDeclarationScope : equalIndex-1]
											}

											// get the type, name, access modifier, static, and final vals of variable
											semiDeclarationSplit := bytes.Split(semiDeclaration, []byte(" "))
											_ = semiDeclarationSplit

											// MOREEE TO DOO!!!!!!
							
											currentDeclarationScope = m + 1
										}
									}
								}

								// ===============================================================================

								*classesText = append(*classesText, types.ClassText{
									DefinedWithin: definedWithin,
									Outside:       outerText,
									Inside:        innerText,
									Declarations:  declarations,
									Variables: 	   variables,
									Methods: 	   methods,
								})

								getInnerClasses(classesText, innerText, true)
							}

							break
						}
					}

					startScopeIndex = 0
				}
			}
		}
	}
}
