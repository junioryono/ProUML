package java

import (
	"bytes"
	"regexp"

	"github.com/junioryono/ProUML/backend/transpiler/types"
)

const (
	NoQuote           byte = 0
	SingleQuote       byte = '\''
	DoubleQuote       byte = '"'
	TickerQuote       byte = '`'
	OpenParenthesis   byte = '('
	ClosedParenthesis byte = ')'
	OpenCurly         byte = '{'
	ClosedCurly       byte = '}'
	OpenBracket       byte = '['
	ClosedBracket     byte = ']'
	LeftArrow         byte = '<'
	RightArrow        byte = '>'
	Colon             byte = ':'
	SemiColon         byte = ';'
	EqualSign         byte = '='
	Slash             byte = '/'
	Backslash         byte = '\\'
	Asterisk          byte = '*'
	Comma             byte = ','
	Period            byte = '.'
	Space             byte = ' '
	Asperand          byte = '@'
	AndCondition      byte = '&'
	OrCondition       byte = '|'
	ExclamationMark   byte = '!'
	QuestionMark      byte = '?'
	PlusSign          byte = '+'
	Hyphen_MinusSign  byte = '-'
	Tilde             byte = '~'
	Percent           byte = '%'
	Caret             byte = '^'
	NewLine           byte = '\n'
	Tab               byte = '\t'
)

func parseFile(file types.File) types.FileResponse {
	var (
		response   = types.FileResponse{}
		parsedText = file.Code
	)

	if len(parsedText) == 0 {
		return response
	}

	parsedText = removeComments(parsedText)
	parsedText = removeSpacing(parsedText)
	parsedText = removeAnnotations(parsedText)

	response.Package = getPackageName(parsedText)
	response.Imports = getPackageImports(parsedText)
	response.Data = append(response.Data, getFileClasses(parsedText, response.Package)...)

	return response
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

	for i, f := 0, ignoreQuotes(&text); i < len(text); i++ {
		isInsideQuotation := f(i)
		if isInsideQuotation {
			continue
		}

		if currentStyle == NoQuote {
			if text[i] == Slash && text[i+1] == Slash {
				currentStyle = Slash
				startCommentIndex = i
			} else if text[i] == Slash && text[i+1] == Asterisk {
				currentStyle = Asterisk
				startCommentIndex = i
			}
		} else if currentStyle == Slash && text[i] == NewLine {
			removeText(i - 1)
			i = startCommentIndex
		} else if currentStyle == Asterisk && text[i] == Asterisk && i+1 < len(text) && text[i+1] == Slash {
			removeText(i + 1)
			i = startCommentIndex
		}
	}

	return text
}

// Remove all extra spacing from code
func removeSpacing(text []byte) []byte {
	// Replace all \r. Needed for Windows files
	REGEX_NewLine := regexp.MustCompile(`\r`)
	text = REGEX_NewLine.ReplaceAll(text, []byte(""))

	needsSpace := func(b byte) bool {
		if b == EqualSign || b == AndCondition || b == OrCondition || b == Colon {
			return true
		}

		return false
	}

	isSpace := func(b byte) bool {
		if b == Space || b == Tab || b == NewLine {
			return true
		}

		return false
	}

	replaceWithSpaceOrRemove := func(i *int, b byte) bool {
		if text[*i] == b {
			if (*i > 0 && text[*i-1] == Space && !(*i > 1 && needsSpace(text[*i-2]))) || (*i+1 < len(text) && isSpace(text[*i+1])) {
				text = append(text[:*i], text[*i+1:]...)
				*i--
			} else {
				text[*i] = Space
			}

			return true
		}

		return false
	}

	replaceRepeatingWithSingleByte := func(i *int, b byte) bool {
		if text[*i] == b {
			endSpaceIndex := *i

			for j := *i + 1; j < len(text); j++ {
				if text[j] != b {
					break
				}

				endSpaceIndex++
			}

			if *i != endSpaceIndex {
				text = append(text[:*i+1], text[endSpaceIndex+1:]...)
				*i--
				return true
			}
		}

		return false
	}

	removeSpaceBeforeAndAfterByte := func(i *int, b byte) bool {
		if text[*i] == b {
			changed := false

			if *i > 0 && text[*i-1] == Space && !(*i > 1 && needsSpace(text[*i-2])) {
				text = append(text[:*i-1], text[*i:]...)
				changed = true
				*i--
			}

			if *i+1 < len(text) && isSpace(text[*i+1]) {
				text = append(text[:*i+1], text[*i+2:]...)
				changed = true
				*i--
			}

			if changed {
				return true
			}
		}

		return false
	}

	removeSpaceBefore := func(i *int, b byte) bool {
		if text[*i] == b && *i > 0 && text[*i-1] == Space && !(*i > 1 && needsSpace(text[*i-2])) {
			text = append(text[:*i-1], text[*i:]...)
			*i--
			return true
		}

		return false
	}

	removeWord := func(i *int, s string) bool {
		b := []byte(s)
		b = append([]byte{Space}, b...)
		b = append(b, Space)

		if *i+len(b)-1 < len(text) && bytes.Equal(text[*i:*i+len(b)], b) {
			text = append(text[:*i], text[*i+len(b)-1:]...)
			return true
		}

		return false
	}

	replaceInstanceOfWithAndCondition := func(i *int) bool {
		b := []byte(" instanceof ")

		if *i+len(b)-1 < len(text) && bytes.Equal(text[*i:*i+len(b)], b) {
			text = append(text[:*i+1], text[*i+len(b)-1:]...)
			text[*i] = AndCondition
			text[*i+1] = AndCondition
			return true
		}

		return false
	}

	// Remove all exception throws: public void writeList()throws IOException,IndexOutOfBoundsException{
	removeMethodThrowsExceptions := func(i *int) bool {
		if *i+1 < len(text) && *i > 5 && text[*i-1] == ClosedParenthesis && text[*i] == 't' && text[*i+1] == 'h' && text[*i+2] == 'r' && text[*i+3] == 'o' && text[*i+4] == 'w' && text[*i+5] == 's' && text[*i+6] == Space {

			for closingCurlyIndex := *i + 7; closingCurlyIndex < len(text); closingCurlyIndex++ {
				if text[closingCurlyIndex] == OpenCurly || text[closingCurlyIndex] == SemiColon {
					text = append(text[:*i], text[closingCurlyIndex:]...)
					break
				}
			}
		}

		return false
	}

	for i, f := 0, ignoreQuotes(&text); i < len(text); i++ {
		isInsideQuotation := f(i)
		if isInsideQuotation {
			continue
		}

		// Replace all tabs with a space
		ok := replaceWithSpaceOrRemove(&i, Tab)
		if ok {
			continue
		}

		// Replace all repeating spaces with just one
		ok = replaceRepeatingWithSingleByte(&i, Space)
		if ok {
			continue
		}

		// Replace all repeating semicolons with just one
		ok = replaceRepeatingWithSingleByte(&i, SemiColon)
		if ok {
			continue
		}

		// Remove space before and after *
		ok = removeSpaceBeforeAndAfterByte(&i, Asterisk)
		if ok {
			continue
		}

		// Remove space before and after ,
		ok = removeSpaceBeforeAndAfterByte(&i, Comma)
		if ok {
			continue
		}

		// Remove space before and after .
		ok = removeSpaceBeforeAndAfterByte(&i, Period)
		if ok {
			continue
		}

		// Remove space before and after =
		ok = removeSpaceBeforeAndAfterByte(&i, EqualSign)
		if ok {
			continue
		}

		// Remove space before and after :
		ok = removeSpaceBeforeAndAfterByte(&i, Colon)
		if ok {
			continue
		}

		// Remove space before and after ;
		ok = removeSpaceBeforeAndAfterByte(&i, SemiColon)
		if ok {
			continue
		}

		// Remove all spaces before and after @
		ok = removeSpaceBeforeAndAfterByte(&i, Asperand)
		if ok {
			continue
		}

		// Remove all spaces before and after [
		ok = removeSpaceBeforeAndAfterByte(&i, OpenBracket)
		if ok {
			continue
		}

		// Remove all spaces before and after {
		ok = removeSpaceBeforeAndAfterByte(&i, OpenCurly)
		if ok {
			continue
		}

		// Remove all spaces before and after }
		ok = removeSpaceBeforeAndAfterByte(&i, ClosedCurly)
		if ok {
			continue
		}

		// Remove all spaces before and after (
		ok = removeSpaceBeforeAndAfterByte(&i, OpenParenthesis)
		if ok {
			continue
		}

		// Remove all spaces before and after )
		ok = removeSpaceBeforeAndAfterByte(&i, ClosedParenthesis)
		if ok {
			continue
		}

		// Remove all spaces before and after <
		ok = removeSpaceBeforeAndAfterByte(&i, LeftArrow)
		if ok {
			continue
		}

		// Remove all spaces before and after >
		ok = removeSpaceBeforeAndAfterByte(&i, RightArrow)
		if ok {
			continue
		}

		// Remove space before and after -
		ok = removeSpaceBeforeAndAfterByte(&i, Hyphen_MinusSign)
		if ok {
			continue
		}

		// Remove space before and after +
		ok = removeSpaceBeforeAndAfterByte(&i, PlusSign)
		if ok {
			continue
		}

		// Remove space before and after ~
		ok = removeSpaceBeforeAndAfterByte(&i, Tilde)
		if ok {
			continue
		}

		// Remove space before and after !
		ok = removeSpaceBeforeAndAfterByte(&i, ExclamationMark)
		if ok {
			continue
		}

		// Remove space before and after ?
		ok = removeSpaceBeforeAndAfterByte(&i, QuestionMark)
		if ok {
			continue
		}

		// Remove space before and after |
		ok = removeSpaceBeforeAndAfterByte(&i, OrCondition)
		if ok {
			continue
		}

		// Remove space before and after /
		ok = removeSpaceBeforeAndAfterByte(&i, Slash)
		if ok {
			continue
		}

		// Remove space before and after %
		ok = removeSpaceBeforeAndAfterByte(&i, Percent)
		if ok {
			continue
		}

		// Remove space before and after ^
		ok = removeSpaceBeforeAndAfterByte(&i, Caret)
		if ok {
			continue
		}

		// Remove space before and after &
		ok = removeSpaceBeforeAndAfterByte(&i, AndCondition)
		if ok {
			continue
		}

		// Remove all spaces before ]
		ok = removeSpaceBefore(&i, ClosedBracket)
		if ok {
			continue
		}

		// Remove all "native"
		ok = removeWord(&i, "native")
		if ok {
			continue
		}

		// Remove all "strictfp"
		ok = removeWord(&i, "strictfp")
		if ok {
			continue
		}

		// Remove all "synchronized"
		ok = removeWord(&i, "synchronized")
		if ok {
			continue
		}

		// Remove all "transient"
		ok = removeWord(&i, "transient")
		if ok {
			continue
		}

		// Remove all "volatile"
		ok = removeWord(&i, "volatile")
		if ok {
			continue
		}

		// Replace all "instanceof" with "&&"
		ok = replaceInstanceOfWithAndCondition(&i)
		if ok {
			continue
		}

		removeMethodThrowsExceptions(&i)
	}

	// Trim left and right spacing
	text = bytes.TrimSpace(text)

	return text
}

// Remove annotations from code
func removeAnnotations(text []byte) []byte {
	var (
		activeAsperand              bool = false
		activeAsperandIndex         int  = 0
		currentAsperandBracket      byte = NoQuote
		currentAsperandBracketCount int  = 1
	)

	removeText := func(i int) {
		text = append(text[:activeAsperandIndex], text[i+1:]...)
		activeAsperand = false
	}

	for i, f := 0, ignoreQuotes(&text); i < len(text); i++ {
		isInsideQuotation := f(i)
		if isInsideQuotation {
			continue
		}

		if text[i] == Asperand {
			activeAsperand = true
			activeAsperandIndex = i
			continue
		}

		if !activeAsperand {
			continue
		}

		if currentAsperandBracket == NoQuote && (text[i] == OpenParenthesis || text[i] == OpenCurly) {
			currentAsperandBracket = text[i]
		} else if (currentAsperandBracket == OpenParenthesis && text[i] == OpenParenthesis) || (currentAsperandBracket == OpenCurly && text[i] == OpenCurly) {
			currentAsperandBracketCount++
		} else if (currentAsperandBracket == OpenParenthesis && text[i] == ClosedParenthesis) || (currentAsperandBracket == OpenCurly && text[i] == ClosedCurly) {
			currentAsperandBracketCount--

			if currentAsperandBracketCount == 0 {
				removeText(i)
			}
		} else if currentAsperandBracket == NoQuote && text[i] == Space {
			removeText(i)
		}
	}

	return text
}

// Get all package imports declare in file
func getPackageImports(text []byte) [][]byte {
	var (
		response             [][]byte
		importNameStartIndex int = -1
	)

	for i := 0; i < len(text); i++ {
		if text[i] == OpenCurly {
			break
		}

		if importNameStartIndex != -1 && text[i] == SemiColon {
			response = append(response, text[importNameStartIndex:i])
			continue
		}

		if i+7 < len(text) &&
			(i == 0 || text[i-1] == SemiColon) &&
			text[i] == 'i' &&
			text[i+1] == 'm' &&
			text[i+2] == 'p' &&
			text[i+3] == 'o' &&
			text[i+4] == 'r' &&
			text[i+5] == 't' &&
			text[i+6] == Space {
			importNameStartIndex = i + 7
		}
	}

	return response
}

// Get package name from code if one exists
func getPackageName(text []byte) []byte {
	var packageNameStartIndex int = -1

	for i := 0; i < len(text); i++ {
		if text[i] == OpenCurly {
			break
		}

		if packageNameStartIndex != -1 && text[i] == SemiColon {
			return text[packageNameStartIndex:i]
		}

		if i+8 < len(text) &&
			text[i] == 'p' &&
			text[i+1] == 'a' &&
			text[i+2] == 'c' &&
			text[i+3] == 'k' &&
			text[i+4] == 'a' &&
			text[i+5] == 'g' &&
			text[i+6] == 'e' &&
			text[i+7] == Space {
			packageNameStartIndex = i + 8
		}
	}

	return []byte("default")
}

// Get all classes declared in the file
func getFileClasses(text []byte, packageName []byte) []any {
	var (
		classesText   = getNestedClasses(text, nil)
		classesStruct = make([]any, 0)
	)

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
				Package:       packageName,
				Name:          textSplit[enumIndex+1],
				Declarations:  getEnumDeclarations(classesText[i].Inside),
			})
			continue
		}

		if classIndex == -1 && interfaceIndex == -1 {
			continue
		}

		Variables, Methods := getVariablesAndMethods(classesText[i].Inside)

		var ExtendsTemp [][]byte
		var ExtendsCustom []types.CustomByteSlice
		extendsIndex := findIndex("extends", textSplit)
		if extendsIndex != -1 {
			ExtendsTemp = bytes.Split(textSplit[extendsIndex+1], []byte(","))
			for _, v := range ExtendsTemp {
				ExtendsCustom = append(ExtendsCustom, bytes.Trim(v, " "))
			}
		}

		if interfaceIndex != -1 {
			classesStruct = append(classesStruct, types.JavaInterface{
				DefinedWithin: classesText[i].DefinedWithin,
				Package:       packageName,
				Name:          textSplit[interfaceIndex+1],
				Extends:       ExtendsCustom,
				Variables:     Variables,
				Methods:       Methods,
			})
			continue
		}

		var implementsTemp [][]byte
		var ImplementsCustom []types.CustomByteSlice
		implementsIndex := findIndex("implements", textSplit)
		if implementsIndex != -1 {
			implementsTemp = bytes.Split(textSplit[implementsIndex+1], []byte(","))
			for _, v := range implementsTemp {
				ImplementsCustom = append(ImplementsCustom, types.CustomByteSlice(v))
			}
		}

		if abstractIndex != -1 {
			classesStruct = append(classesStruct, types.JavaAbstract{
				DefinedWithin: classesText[i].DefinedWithin,
				Package:       packageName,
				Name:          textSplit[classIndex+1],
				Implements:    ImplementsCustom,
				Extends:       ExtendsCustom,
				Variables:     Variables,
				Methods:       Methods,
			})
			continue
		}

		classesStruct = append(classesStruct, types.JavaClass{
			DefinedWithin: classesText[i].DefinedWithin,
			Package:       packageName,
			Name:          textSplit[classIndex+1],
			Implements:    ImplementsCustom,
			Extends:       ExtendsCustom,
			Variables:     Variables,
			Methods:       Methods,
		})
	}

	return classesStruct
}

// Get all nested classes declared in file | ..Recursive..
func getNestedClasses(text []byte, previousClass *types.JavaClassText) []types.JavaClassText {
	var (
		classes         []types.JavaClassText
		startScopeIndex int = 0
		currentScope    int = 0
	)

	isClassDeclaration := func(word1, word2 []byte) bool {
		return (bytes.Equal(word1, []byte("abstract")) && bytes.Equal(word2, []byte("class"))) || bytes.Equal(word1, []byte("class")) || bytes.Equal(word1, []byte("interface")) || bytes.Equal(word1, []byte("enum"))
	}

	for i, f := 0, ignoreQuotes(&text); i < len(text); i++ {
		isInsideQuotation := f(i)
		if isInsideQuotation {
			continue
		}

		if text[i] == OpenCurly {
			if currentScope == 0 {
				startScopeIndex = i
			}

			currentScope++
		}

		if text[i] != ClosedCurly {
			continue
		}

		currentScope--

		if startScopeIndex == 0 || currentScope != 0 {
			continue
		}

		if i+1 < len(text) && text[i+1] == SemiColon {
			i++
		}

		for j := startScopeIndex; j >= 0; j-- {
			if !(j == 0 || text[j-1] == SemiColon || text[j-1] == ClosedCurly) {
				continue
			}

			var (
				outerText []byte
				innerText []byte
			)

			outerText = append(outerText, text[j:startScopeIndex]...)
			outerTextSplit := bytes.Split(outerText, []byte(" "))
			innerText = append(innerText, text[startScopeIndex+1:i]...)

			if !(len(outerTextSplit) > 5 && isClassDeclaration(outerTextSplit[4], outerTextSplit[5]) ||
				len(outerTextSplit) > 4 && isClassDeclaration(outerTextSplit[3], outerTextSplit[4]) ||
				len(outerTextSplit) > 3 && isClassDeclaration(outerTextSplit[2], outerTextSplit[3]) ||
				len(outerTextSplit) > 2 && isClassDeclaration(outerTextSplit[1], outerTextSplit[2]) ||
				len(outerTextSplit) > 1 && isClassDeclaration(outerTextSplit[0], outerTextSplit[1])) {
				break
			}

			addCurrentAndCheckForNext := func(DefinedWithin, Outside, Inside []byte) {
				classes = append(classes, types.JavaClassText{
					DefinedWithin: DefinedWithin,
					Outside:       Outside,
					Inside:        Inside,
				})
				classes = append(classes, getNestedClasses(Inside, &classes[len(classes)-1])...)
			}

			if previousClass == nil {
				addCurrentAndCheckForNext(nil, outerText, innerText)
				break
			}

			if text[i] == SemiColon {
				innerText = text[startScopeIndex+1 : i-1]
			}

			index := bytes.Index(previousClass.Inside, outerText)
			if index == -1 {
				addCurrentAndCheckForNext(nil, outerText, innerText)
				break
			}

			var (
				innerScopeNumber int = 0
				endingIndex      int = len(previousClass.Inside) - 1
			)

			for i2, f2 := 0, ignoreQuotes(&previousClass.Inside); i2 < len(previousClass.Inside); i2++ {
				isInsideQuotation2 := f2(i2)
				if isInsideQuotation2 {
					continue
				}

				if previousClass.Inside[i2] == OpenCurly {
					innerScopeNumber++
				} else if previousClass.Inside[i2] == ClosedCurly {
					innerScopeNumber--

					if i2+1 < len(previousClass.Inside) && previousClass.Inside[i2+1] == SemiColon {
						i2++
					}

					if innerScopeNumber == 0 {
						endingIndex = i2
						break
					}
				}
			}

			previousClass.Inside = append(previousClass.Inside[0:index], previousClass.Inside[endingIndex+1:]...)
			previousOuterTextSplit := bytes.Split(previousClass.Outside, []byte(" "))
			definedWithin := previousOuterTextSplit[len(previousOuterTextSplit)-1]

			addCurrentAndCheckForNext(definedWithin, outerText, innerText)
			break
		}

		startScopeIndex = 0
	}

	return classes
}

// Get all enumeration constant types
func getEnumDeclarations(text []byte) []types.CustomByteSlice {
	var (
		response               []types.CustomByteSlice
		parenthesisScope       int  = 0
		textLength             int  = len(text)
		startDeclarationIndex  int  = 0
		sectionUsedParenthesis bool = false
	)

	for i, f := 0, ignoreQuotes(&text); i < len(text); i++ {
		isInsideQuotation := f(i)
		if isInsideQuotation {
			continue
		}

		if text[i] == ClosedParenthesis {
			parenthesisScope--
		} else if sectionUsedParenthesis {
			if text[i] == Comma {
				sectionUsedParenthesis = false
				startDeclarationIndex = i + 1
			} else if text[i] == SemiColon {
				break
			}
		} else if parenthesisScope == 0 && (text[i] == OpenParenthesis || text[i] == Comma || text[i] == SemiColon) {
			response = append(response, text[startDeclarationIndex:i])

			if text[i] == SemiColon {
				break
			} else if text[i] == OpenParenthesis {
				parenthesisScope++
				sectionUsedParenthesis = true
			} else if text[i] == Comma {
				startDeclarationIndex = i + 1
			}
		}
	}

	if textLength > 1 &&
		text[textLength-1] != ClosedCurly &&
		text[textLength-1] != SemiColon &&
		text[textLength-1] != Comma {
		response = append(response, text[startDeclarationIndex:])
	}

	return response
}

// Get all variables and methods that belong in a class
func getVariablesAndMethods(text []byte) ([]types.JavaVariable, []types.JavaMethod) {
	var (
		linesSplit = splitVariablesAndMethods(text)
		variables  []types.JavaVariable
		methods    []types.JavaMethod
	)

	for i := 0; i < len(linesSplit); i++ {
		v, m := getVariablesOrMethod(linesSplit[i])
		variables = append(variables, v...)

		if !bytes.Equal(m.Name, []byte("")) {
			methods = append(methods, m)
		}
	}

	return variables, methods
}

// Split text into lines of execution
func splitVariablesAndMethods(text []byte) [][]byte {
	var (
		response                [][]byte
		currentCurlyScope       int = 0
		currentParenthesisScope int = 0
		appendStartIndex        int = 0
	)

	for i, f := 0, ignoreQuotes(&text); i < len(text); i++ {
		isInsideQuotation := f(i)
		if isInsideQuotation {
			continue
		}

		if text[i] == OpenParenthesis {
			currentParenthesisScope++
		} else if text[i] == ClosedParenthesis {
			currentParenthesisScope--
		} else if text[i] == OpenCurly {
			currentCurlyScope++
		} else if text[i] == ClosedCurly {
			currentCurlyScope--

			if currentCurlyScope != 0 {
				continue
			}

			if i+1 < len(text) {
				if text[i+1] == ClosedParenthesis || text[i+1] == Comma {
					// This is to prevent:
					// System.out.println(new int[][] {{20}, {40}});
					//                                     ^
					// from appending an extra value
					continue
				}

				if text[i+1] == SemiColon {
					i++
				}
			}

			response = append(response, text[appendStartIndex:i+1])
			appendStartIndex = i + 1
		} else if currentCurlyScope == 0 && currentParenthesisScope == 0 && text[i] == SemiColon {
			response = append(response, text[appendStartIndex:i+1])
			appendStartIndex = i + 1
		}
	}

	return response
}

// Get all variables in one line of execution, or one method
func getVariablesOrMethod(text []byte) ([]types.JavaVariable, types.JavaMethod) {
	var (
		variables []types.JavaVariable
		method    types.JavaMethod
	)

	// Determine whether the line of text is a variable or method.
	// If it is a method, return OpenParenthesis index
	isVariable := func(text []byte) (bool, int) {
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

		hasArrow := false
		numberOfLeftArrows := 0
		for i := 0; i < len(vSText); i++ {
			if vSText[i] == Space {
				Type = vSText[:i]
				break
			} else if vSText[i] == LeftArrow {
				numberOfLeftArrows++
			} else if vSText[i] == RightArrow {
				numberOfLeftArrows--

				if numberOfLeftArrows == 0 {
					Type = vSText[:i+1]
					hasArrow = true
					break
				}
			}
		}

		if hasArrow {
			vSText = vSText[len(Type):]
		} else {
			vSText = vSText[len(Type)+1:]
		}

		// Example inputs:
		// Type var1;
		// Type var2 = "Hello";
		// Type var3 = "Hello",var4;
		// Type var5 = "Hello",var6 = "Hello",var7;
		// Type var8 = true == true
		// Type var9 = (true == true) || (true == false)

		var (
			nameStartIndex       int = 0
			currentName          []byte
			currentlyFindingName bool = true
			valueStartIndex      int  = 0
			numberOfParenthesis  int  = 0
		)

		for i, f := 0, ignoreQuotes(&vSText); i < len(vSText); i++ {
			isInsideQuotation := f(i)
			if isInsideQuotation {
				continue
			}

			// If open parenthesis is found, we need to ignore commas until the parenthesis is closed
			if vSText[i] == OpenParenthesis {
				numberOfParenthesis++
				continue
			} else if vSText[i] == ClosedParenthesis {
				numberOfParenthesis--
				continue
			}

			if (vSText[i] == Comma && numberOfParenthesis == 0) || vSText[i] == SemiColon {
				var currentValue []byte
				if valueStartIndex != 0 {
					currentValue = vSText[valueStartIndex:i]
				}
				if currentlyFindingName {
					currentName = vSText[nameStartIndex:i]
				}

				t := types.JavaVariable{
					Type:           Type,
					Name:           currentName,
					Value:          currentValue,
					AccessModifier: AccessModifier,
					Static:         Static,
					Final:          Final,
				}

				variables = append(variables, t)

				if vSText[i] == Comma {
					nameStartIndex = i + 1
					valueStartIndex = 0
					currentlyFindingName = true
				}

			} else if currentlyFindingName && vSText[i] == EqualSign {
				currentName = vSText[nameStartIndex:i]
				currentlyFindingName = false
				valueStartIndex = i + 1
			}
		}

		return variables, method
	}

	var (
		methodDeclaration = make([]byte, openParamIndex)
		paramDeclarations []byte
		closedParamIndex  int = 0
	)

	copy(methodDeclaration, text[0:openParamIndex])

	for i, f := 0, ignoreQuotes(&text); i < len(text); i++ {
		isInsideQuotation := f(i)
		if isInsideQuotation {
			continue
		}

		if text[i] == ClosedParenthesis {
			closedParamIndex = i
			paramDeclarations = append(paramDeclarations, text[openParamIndex+1:closedParamIndex]...)
			break
		}
	}

	if closedParamIndex+2 < len(text) && text[closedParamIndex+1] != SemiColon {
		if text[len(text)-1] == SemiColon {
			method.Functionality = append(method.Functionality, text[closedParamIndex+2:len(text)-2]...)
		} else {
			method.Functionality = append(method.Functionality, text[closedParamIndex+2:len(text)-1]...)
		}
	}

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

	numberOfLeftArrows := 0
	for i := 0; i < len(methodDeclaration); i++ {
		if methodDeclaration[i] == LeftArrow {
			numberOfLeftArrows++
		} else if methodDeclaration[i] == RightArrow {
			numberOfLeftArrows--

			if numberOfLeftArrows == 0 {
				methodDeclaration = append(methodDeclaration[:i+1], append([]byte(" "), methodDeclaration[i+1:]...)...)
				break
			}
		}
	}

	declarationSplit := bytes.Split(methodDeclaration, []byte(" "))
	if bytes.Equal(declarationSplit[0], []byte("public")) ||
		bytes.Equal(declarationSplit[0], []byte("protected")) ||
		bytes.Equal(declarationSplit[0], []byte("private")) {
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

	if len(declarationSplit) > 1 {
		method.Type = declarationSplit[len(declarationSplit)-2]
	}
	if len(declarationSplit) > 0 {
		method.Name = declarationSplit[len(declarationSplit)-1]
	}

	return nil, method
}

// Returns isInsideQuotation
func ignoreQuotes(text *[]byte) func(i int) bool {
	var currentStyle byte = NoQuote

	return func(i int) (isInsideQuotation bool) {
		if (currentStyle == SingleQuote && (*text)[i] == SingleQuote ||
			currentStyle == DoubleQuote && (*text)[i] == DoubleQuote ||
			currentStyle == TickerQuote && (*text)[i] == TickerQuote) &&
			(i == 0 || (*text)[i-1] != Backslash) {
			currentStyle = NoQuote
			return true
		}

		if (*text)[i] == SingleQuote {
			currentStyle = SingleQuote
			return true
		} else if (*text)[i] == DoubleQuote {
			currentStyle = DoubleQuote
			return true
		} else if (*text)[i] == TickerQuote {
			currentStyle = TickerQuote
			return true
		}

		return currentStyle != NoQuote
	}
}

// // Returns isInsideQuotation
// func ignoreQuotesCustomByte(text *types.CustomByteSlice) func(i int) bool {
// 	var currentStyle byte = NoQuote

// 	return func(i int) (isInsideQuotation bool) {
// 		if (currentStyle == SingleQuote && (*text)[i] == SingleQuote ||
// 			currentStyle == DoubleQuote && (*text)[i] == DoubleQuote ||
// 			currentStyle == TickerQuote && (*text)[i] == TickerQuote) &&
// 			(i == 0 || (*text)[i-1] != Backslash) {
// 			currentStyle = NoQuote
// 			return true
// 		}

// 		if (*text)[i] == SingleQuote {
// 			currentStyle = SingleQuote
// 			return true
// 		} else if (*text)[i] == DoubleQuote {
// 			currentStyle = DoubleQuote
// 			return true
// 		} else if (*text)[i] == TickerQuote {
// 			currentStyle = TickerQuote
// 			return true
// 		}

// 		return currentStyle != NoQuote
// 	}
// }
