package java

import (
	"bytes"
	"regexp"

	"github.com/junioryono/ProUML/backend/transpiler/types"
)

var (
	NoQuote           byte = 0
	SingleQuote       byte = '\''
	DoubleQuote       byte = '"'
	TickerQuote       byte = '`'
	OpenParenthesis   byte = '('
	ClosedParenthesis byte = ')'
	OpenCurly         byte = '{'
	ClosedCurly       byte = '}'
	LeftArrow         byte = '<'
	RightArrow        byte = '>'
	SemiColon         byte = ';'
	EqualSign         byte = '='
	SingleLineComment byte = '/'
	MultiLineComment  byte = '*'
	Comma             byte = ','
	Space             byte = ' '
	Asperand          byte = '@'
)

func parseFile(file types.File) (types.FileResponse, error) {
	var (
		response   = types.FileResponse{}
		parsedText = file.Code
	)

	if len(parsedText) == 0 {
		return response, &types.CannotParseText{}
	}

	parsedText = removeComments(parsedText)
	parsedText = removeSpacing(parsedText)
	parsedText = removeAnnotations(parsedText)
	packageName, err := getPackageName(parsedText)
	if err != nil {
		return response, err
	}

	classes := getFileClasses(file.Name, parsedText)
	if err != nil {
		return response, err
	}

	response.Package = packageName
	response.Data = append(response.Data, classes...)

	return response, nil
}

// Remove all comments that are not inside of quotations from code
func removeComments(text []byte) []byte {
	var (
		startCommentIndex int  = 0
		currentStyle      byte = NoQuote
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

	return text
}

// Remove all extra spacing from code
func removeSpacing(text []byte) []byte {
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

	// Remove all spaces before and after @
	REGEX_AsperandSpace := regexp.MustCompile(`\s*@\s*`)
	text = REGEX_AsperandSpace.ReplaceAll(text, []byte("@"))

	// Remove all spaces before and after [
	REGEX_OpenBracketSpace := regexp.MustCompile(`\s*\[\s*`)
	text = REGEX_OpenBracketSpace.ReplaceAll(text, []byte("["))

	// Remove all spaces before ]
	REGEX_ClosedBracketSpace := regexp.MustCompile(`\s*\]`)
	text = REGEX_ClosedBracketSpace.ReplaceAll(text, []byte("]"))

	// Remove all spaces before and after {
	REGEX_OpenCurlySpace := regexp.MustCompile(`\s*{\s*`)
	text = REGEX_OpenCurlySpace.ReplaceAll(text, []byte("{"))

	// Remove all spaces before and after }
	REGEX_ClosedCurlySpace := regexp.MustCompile(`\s*}\s*`)
	text = REGEX_ClosedCurlySpace.ReplaceAll(text, []byte("}"))

	// Remove all spaces before and after (
	REGEX_OpenParenthesisSpace := regexp.MustCompile(`\s*\(\s*`)
	text = REGEX_OpenParenthesisSpace.ReplaceAll(text, []byte("("))

	// Remove all spaces before and after )
	REGEX_ClosedParenthesisSpace := regexp.MustCompile(`\s*\)\s*`)
	text = REGEX_ClosedParenthesisSpace.ReplaceAll(text, []byte(")"))

	// Remove all spaces before and after <
	REGEX_LeftArrowSpace := regexp.MustCompile(`\s*\<\s*`)
	text = REGEX_LeftArrowSpace.ReplaceAll(text, []byte("<"))

	// Remove all spaces before and after >
	REGEX_RightArrowSpace := regexp.MustCompile(`\s*\>\s*`)
	text = REGEX_RightArrowSpace.ReplaceAll(text, []byte(">"))

	// Replace all double semicolons with just one
	REGEX_DoubleSemiColon := regexp.MustCompile(`;{2,}`)
	text = REGEX_DoubleSemiColon.ReplaceAll(text, []byte(";"))

	// Replace all "=", " =", and "= " with " = "
	REGEX_EqualSpace := regexp.MustCompile(`[\s]*=[\s]*`)
	text = REGEX_EqualSpace.ReplaceAll(text, []byte(" = "))

	// Trim left and right spacing
	text = bytes.TrimSpace(text)

	return text
}

func removeAnnotations(text []byte) []byte {
	var (
		activeAsperand              bool = false
		activeAsperandIndex         int  = 0
		currentStyle                byte = NoQuote
		currentAsperandBracket      byte = NoQuote
		currentAsperandBracketCount int  = 1
	)

	removeText := func(i int) {
		text = append(text[:activeAsperandIndex], text[i+1:]...)
		activeAsperand = false
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
			} else if text[i] == Asperand {
				activeAsperand = true
				activeAsperandIndex = i
			} else if activeAsperand {
				if currentAsperandBracket == NoQuote && (text[i] == OpenParenthesis || text[i] == OpenCurly) {
					currentAsperandBracket = text[i]
				} else if (currentAsperandBracket == OpenParenthesis && text[i] == OpenParenthesis) || (currentAsperandBracket == OpenCurly && text[i] == OpenCurly) {
					currentAsperandBracketCount++
				} else if (currentAsperandBracket == OpenParenthesis && text[i] == ClosedParenthesis) ||
					(currentAsperandBracket == OpenCurly && text[i] == ClosedCurly) {
					currentAsperandBracketCount--

					if currentAsperandBracketCount == 0 {
						removeText(i)
					}
				} else if currentAsperandBracket == NoQuote && text[i] == Space {
					removeText(i)
				}
			}
		}
	}

	return text
}

// Get package name from code if one exists
func getPackageName(text []byte) ([]byte, error) {
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

func getFileClasses(fileName string, text []byte) []any {
	// Search for file name
	// Example return: "public class Test5"
	var (
		classesText   = make([]types.JavaClassText, 0)
		classesStruct = make([]any, 0)
	)

	getInnerClasses(&classesText, text, false)

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

		if enumIndex != -1 {
			classesStruct = append(classesStruct, types.JavaEnum{
				DefinedWithin: classesText[i].DefinedWithin,
				Name:          textSplit[enumIndex+1],
				Declarations:  getEnumDeclarations(classesText[i].Inside),
			})
			continue
		}

		if classIndex == -1 && interfaceIndex == -1 {
			continue
		}

		Variables, Methods := getVariablesAndMethods(classesText[i].Inside)
		Associations := getClassAssociations(Variables, Methods)

		var Extends [][]byte
		extendsIndex := findIndex("extends", textSplit)
		if extendsIndex != -1 {
			Extends = bytes.Split(textSplit[extendsIndex+1], []byte(","))
		}

		if interfaceIndex != -1 {
			classesStruct = append(classesStruct, types.JavaInterface{
				DefinedWithin: classesText[i].DefinedWithin,
				Name:          textSplit[interfaceIndex+1],
				Extends:       Extends,
				Variables:     Variables,
				Methods:       Methods,
				Associations:  Associations,
			})
			continue
		}

		var Implements [][]byte
		implementsIndex := findIndex("implements", textSplit)
		if implementsIndex != -1 {
			Implements = bytes.Split(textSplit[implementsIndex+1], []byte(","))
		}

		if abstractIndex != -1 {
			classesStruct = append(classesStruct, types.JavaAbstract{
				DefinedWithin: classesText[i].DefinedWithin,
				Name:          textSplit[classIndex+1],
				Implements:    Implements,
				Extends:       Extends,
				Variables:     Variables,
				Methods:       Methods,
				Associations:  Associations,
			})
			continue
		}

		classesStruct = append(classesStruct, types.JavaClass{
			DefinedWithin: classesText[i].DefinedWithin,
			Name:          textSplit[classIndex+1],
			Implements:    Implements,
			Extends:       Extends,
			Variables:     Variables,
			Methods:       Methods,
			Associations:  Associations,
		})
	}

	return classesStruct
}

func getEnumDeclarations(text []byte) [][]byte {
	var (
		response              [][]byte
		currentStyle          byte = NoQuote
		parenthesisScope      int  = 0
		lastCommaPlusOneIndex int  = 0
	)

	for i := 0; i < len(text); i++ {
		if currentStyle == SingleQuote && text[i] == SingleQuote ||
			currentStyle == DoubleQuote && text[i] == DoubleQuote ||
			currentStyle == TickerQuote && text[i] == TickerQuote {
			currentStyle = NoQuote
		} else if currentStyle == NoQuote {
			if text[i] == OpenParenthesis {
				parenthesisScope++
			} else if text[i] == ClosedParenthesis {
				parenthesisScope--
			}

			if parenthesisScope == 0 {
				response = append(response, text[lastCommaPlusOneIndex:i])
				lastCommaPlusOneIndex = i + 1
			}
		}
	}

	for i := 0; i < len(text); i++ {

	}

	return response
}

func getInnerClasses(classesText *[]types.JavaClassText, text []byte, isNested bool) {
	var (
		startScopeIndex int  = 0
		currentStyle    byte = NoQuote
		currentScope    int  = 0
	)

	isClassDeclaration := func(word1, word2 []byte) bool {
		return (bytes.Equal(word1, []byte("abstract")) && bytes.Equal(word2, []byte("class"))) || bytes.Equal(word1, []byte("class")) || bytes.Equal(word1, []byte("interface")) || bytes.Equal(word1, []byte("enum"))
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
								innerText     []byte
							)
							outerText = append(outerText, text[j:startScopeIndex]...)
							outerTextSplit := bytes.Split(outerText, []byte(" "))
							innerText = append(innerText, text[startScopeIndex+1:i]...)

							if len(outerTextSplit) > 5 && isClassDeclaration(outerTextSplit[4], outerTextSplit[5]) ||
								len(outerTextSplit) > 4 && isClassDeclaration(outerTextSplit[3], outerTextSplit[4]) ||
								len(outerTextSplit) > 3 && isClassDeclaration(outerTextSplit[2], outerTextSplit[3]) ||
								len(outerTextSplit) > 2 && isClassDeclaration(outerTextSplit[1], outerTextSplit[2]) ||
								len(outerTextSplit) > 1 && isClassDeclaration(outerTextSplit[0], outerTextSplit[1]) {

								if isNested {
									previousInnerText := (*classesText)[len(*classesText)-1].Inside

									if text[i] == SemiColon {
										innerText = text[startScopeIndex+1 : i-1]
									}

									index := bytes.Index(previousInnerText, outerText)
									if index != -1 {
										var (
											currentInnerStyle byte = NoQuote
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

								*classesText = append(*classesText, types.JavaClassText{
									DefinedWithin: definedWithin,
									Outside:       outerText,
									Inside:        innerText,
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

func getVariablesAndMethods(text []byte) ([]types.JavaVariable, []types.JavaMethod) {
	var (
		linesSplit = splitVariablesAndMethods(text) // Split by line of execution
		variables  []types.JavaVariable
		methods    []types.JavaMethod
	)

	// get variables or method
	// push to this variables and methods
	for i := 0; i < len(linesSplit); i++ {
		v, m := getVariablesOrMethod(linesSplit[i])
		variables = append(variables, v...)

		if !bytes.Equal(m.Name, []byte("")) {
			methods = append(methods, m)
		}
	}

	return variables, methods
}

func splitVariablesAndMethods(t []byte) [][]byte {
	var (
		text         = make([]byte, len(t))
		response     [][]byte
		currentStyle byte = NoQuote
		currentScope int  = 0
	)
	copy(text, t)

	removeAndAppendText := func(i int) {
		temp := make([]byte, len(text))
		copy(temp, text)
		temp = append([]byte(nil), temp[0:i+1]...)

		response = append(response, temp)

		text = append(text[:0], text[i+1:]...)
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
			} else if text[i] == OpenCurly {
				currentScope++
			} else if text[i] == ClosedCurly {
				currentScope--

				if currentScope == 0 {
					if i+1 < len(text) && text[i+1] == SemiColon {
						i++
					}

					removeAndAppendText(i)
					i = 0
				}
			} else if text[i] == SemiColon && currentScope == 0 {
				removeAndAppendText(i)
				i = 0
			}
		}
	}

	return response
}

func getVariablesOrMethod(text []byte) ([]types.JavaVariable, types.JavaMethod) {
	var (
		variables []types.JavaVariable
		method    types.JavaMethod
	)

	isVar, openParamIndex := isVariable(text)

	if isVar {
		var (
			Type           []byte
			AccessModifier []byte
			Static         bool
			Final          bool
		)

		var variablesStartIndex int

		if bytes.HasPrefix(text, []byte("public static final")) {
			AccessModifier = []byte("public")
			Static = true
			Final = true
		} else if bytes.HasPrefix(text, []byte("public static")) {
			AccessModifier = []byte("public")
			Static = true
		} else if bytes.HasPrefix(text, []byte("public final")) {
			AccessModifier = []byte("public")
			Final = true
		} else if bytes.HasPrefix(text, []byte("protected static final")) {
			AccessModifier = []byte("protected")
			Static = true
			Final = true
		} else if bytes.HasPrefix(text, []byte("protected static")) {
			AccessModifier = []byte("protected")
			Static = true
		} else if bytes.HasPrefix(text, []byte("protected final")) {
			AccessModifier = []byte("protected")
			Final = true
		} else if bytes.HasPrefix(text, []byte("private static final")) {
			AccessModifier = []byte("private")
			Static = true
			Final = true
		} else if bytes.HasPrefix(text, []byte("private static")) {
			AccessModifier = []byte("private")
			Static = true
		} else if bytes.HasPrefix(text, []byte("private final")) {
			AccessModifier = []byte("private")
			Final = true
		} else if bytes.HasPrefix(text, []byte("static final")) {
			Static = true
			Final = true
		} else if bytes.HasPrefix(text, []byte("public")) {
			AccessModifier = []byte("public")
		} else if bytes.HasPrefix(text, []byte("protected")) {
			AccessModifier = []byte("protected")
		} else if bytes.HasPrefix(text, []byte("private")) {
			AccessModifier = []byte("private")
		} else if bytes.HasPrefix(text, []byte("static")) {
			Static = true
		} else if bytes.HasPrefix(text, []byte("final")) {
			Final = true
		}

		if len(AccessModifier) != 0 {
			variablesStartIndex += len(AccessModifier) + 1
		}
		if Static {
			variablesStartIndex += 6 + 1
		}
		if Final {
			variablesStartIndex += 5 + 1
		}

		vSText := text[variablesStartIndex:]
		Type, _, _ = bytes.Cut(vSText, []byte(" "))
		vSText = vSText[len(Type)+1:]

		var (
			currentStyle         byte = NoQuote
			nameStartIndex       int  = 0
			currentName          []byte
			currentlyFindingName bool = true
			valueStartIndex      int  = 0
		)

		// Example inputs:
		// var1;
		// var2 = "Hello";
		// var3 = "Hello",var4;
		// var5 = "Hello",var6 = "Hello",var7;

		for i := 0; i < len(vSText); i++ {
			if currentStyle == SingleQuote && vSText[i] == SingleQuote ||
				currentStyle == DoubleQuote && vSText[i] == DoubleQuote ||
				currentStyle == TickerQuote && vSText[i] == TickerQuote {
				currentStyle = NoQuote
			} else if currentStyle == NoQuote {
				if vSText[i] == SingleQuote {
					currentStyle = SingleQuote
				} else if vSText[i] == DoubleQuote {
					currentStyle = DoubleQuote
				} else if vSText[i] == TickerQuote {
					currentStyle = TickerQuote
				} else if vSText[i] == Comma || vSText[i] == SemiColon {
					var currentValue []byte
					if valueStartIndex != 0 {
						currentValue = vSText[valueStartIndex:i]
					}
					if currentlyFindingName {
						currentName = vSText[nameStartIndex:i]
					}

					variables = append(variables, types.JavaVariable{
						Type:           Type,
						Name:           currentName,
						Value:          currentValue,
						AccessModifier: AccessModifier,
						Static:         Static,
						Final:          Final,
					})

					if vSText[i] == Comma {
						nameStartIndex = i + 1
						valueStartIndex = 0
						currentlyFindingName = true
					}

				} else if vSText[i] == EqualSign {
					valueStartIndex = i + 2
				} else if vSText[i] == Space && currentlyFindingName {
					currentName = vSText[nameStartIndex:i]
					currentlyFindingName = false
				}
			}
		}

		return variables, method
	}

	var (
		methodDeclaration = text[0:openParamIndex]
		paramDeclarations []byte
		closedParamIndex  int  = 0
		currentStyle      byte = NoQuote
	)

	for i := openParamIndex; i < len(text); i++ {
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
			} else if text[i] == ClosedParenthesis {
				closedParamIndex = i
				paramDeclarations = append(paramDeclarations, text[openParamIndex+1:closedParamIndex]...)
				break
			}
		}
	}

	if closedParamIndex+2 < len(text) && text[closedParamIndex+1] != SemiColon {
		if text[len(text)-1] == SemiColon {
			method.Functionality = append(method.Functionality, text[closedParamIndex+2:len(text)-2]...)
		} else {
			method.Functionality = append(method.Functionality, text[closedParamIndex+2:len(text)-1]...)
		}
	}

	declarationSplit := bytes.Split(methodDeclaration, []byte(" "))

	var (
		allParamsSplit        [][]byte
		arrowScope            int = 0
		lastCommaPlusOneIndex int = 0
	)

	if len(paramDeclarations) != 0 {
		for i := 0; i < len(paramDeclarations); i++ {
			if paramDeclarations[i] == LeftArrow {
				arrowScope++
			} else if paramDeclarations[i] == RightArrow {
				arrowScope--
			} else if paramDeclarations[i] == Comma && arrowScope == 0 {
				allParamsSplit = append(allParamsSplit, paramDeclarations[lastCommaPlusOneIndex:i])
				lastCommaPlusOneIndex = i + 1
				i = lastCommaPlusOneIndex
			}
		}
		allParamsSplit = append(allParamsSplit, paramDeclarations[lastCommaPlusOneIndex:])

		for _, param := range allParamsSplit {
			Type, Name, found := bytes.Cut(param, []byte(" "))
			if !found {
				continue
			}

			method.Parameters = append(method.Parameters, types.JavaMethodParameter{
				Type: Type,
				Name: Name,
			})
		}
	}

	if bytes.Equal(declarationSplit[0], []byte("public")) || bytes.Equal(declarationSplit[0], []byte("protected")) || bytes.Equal(declarationSplit[0], []byte("private")) {
		method.AccessModifier = declarationSplit[0]
	}

	if (len(declarationSplit) == 4 && bytes.Equal(declarationSplit[1], []byte("abstract"))) ||
		(len(declarationSplit) == 3 && bytes.Equal(declarationSplit[0], []byte("abstract"))) {
		method.Abstract = true
	}

	if (len(declarationSplit) == 5 || len(declarationSplit) == 4) && bytes.Equal(declarationSplit[1], []byte("static")) ||
		(len(declarationSplit) == 4 || len(declarationSplit) == 3) && bytes.Equal(declarationSplit[0], []byte("static")) {
		method.Static = true
	}

	if (len(declarationSplit) == 5 && bytes.Equal(declarationSplit[2], []byte("final"))) ||
		(len(declarationSplit) == 4 && bytes.Equal(declarationSplit[1], []byte("final"))) ||
		(len(declarationSplit) == 3 && bytes.Equal(declarationSplit[0], []byte("final"))) {
		method.Final = true
	}

	method.Type = declarationSplit[len(declarationSplit)-2]
	method.Name = declarationSplit[len(declarationSplit)-1]

	return nil, method
}

// Determine whether the line of text is a variable or method.
// If it is a method, return OpenParenthesis index
func isVariable(text []byte) (bool, int) {
	var i int = 0

	for ; i < len(text); i++ {
		if text[i] == EqualSign {
			return true, 0
		} else if text[i] == OpenParenthesis {
			return false, i
		}
	}

	return i == len(text), 0
}

func getClassAssociations(variables []types.JavaVariable, methods []types.JavaMethod) [][]byte {
	var (
		response [][]byte
	)

	// Include all types... even if it is int, char, etc.
	// If String[], do not include [], etc. Could be anything, not just 'String'. // Only include the exact type name
	// If List<ClassName>, include List and ClassName in response
	// Possible inputs to watch for:
	// ClassName[] array;
	// List<ClassName> list; <<< Could be anything, not just 'List', so use '<'
	// List1<List2<ClassName>> list;
	// List1<List2<List3<ClassName>>> list;
	// List<ClassName1,ClassName2> list;
	// List<ClassName1,ClassName2,ClassName3> list;
	// ClassIF varName = new Class1(); <<< Include ClassIF and Class1
	// Class1 varName = new Class1(new Class2); <<< Include Class1 and Class2
	// Class1 varName = new Class1(new Class2(new Class 3)); <<< Include Class1, Class2, and Class3
	// Need to watch out for quotations because they could be included in new Class parameters
	// The variable 'Type', method 'Type' and method parameters 'Type' will all have the same functionality

	return response
}
