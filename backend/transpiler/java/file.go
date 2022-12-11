package java

import (
	"bytes"
	"fmt"
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

// DONE
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
	response.Data = append(response.Data, getFileClasses(parsedText)...)

	return response
}

// DONE
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

// DONE
// Remove all extra spacing from code
func removeSpacing(text []byte) []byte {
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

		// Replace all new lines with a space
		ok := replaceWithSpaceOrRemove(&i, NewLine)
		if ok {
			continue
		}

		// Replace all tabs with a space
		ok = replaceWithSpaceOrRemove(&i, Tab)
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

// DONE
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

// DONE
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

// DONE
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

	return nil
}

// DONE
func getFileClasses(text []byte) []any {
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
				Name:          textSplit[enumIndex+1],
				Declarations:  getEnumDeclarations(classesText[i].Inside),
			})
			continue
		}

		if classIndex == -1 && interfaceIndex == -1 {
			continue
		}

		Variables, Methods := getVariablesAndMethods(classesText[i].Inside)
		Associations, Dependencies := getClassRelationTypes(Variables, Methods)

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
				Dependencies:  Dependencies,
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
				Dependencies:  Dependencies,
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
			Dependencies:  Dependencies,
		})
	}

	return classesStruct
}

// DONE
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

// DONE
func getEnumDeclarations(text []byte) [][]byte {
	var (
		response               [][]byte
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

// DONE
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

// DONE
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

// TODO Need to clean up
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
		Type, _, _ = bytes.Cut(vSText, []byte(" "))
		vSText = vSText[len(Type)+1:]

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
		)

		for i, f := 0, ignoreQuotes(&vSText); i < len(vSText); i++ {
			isInsideQuotation := f(i)
			if isInsideQuotation {
				continue
			}

			if vSText[i] == Comma || vSText[i] == SemiColon {
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

			} else if currentlyFindingName && vSText[i] == EqualSign {
				currentName = vSText[nameStartIndex:i]
				currentlyFindingName = false
				valueStartIndex = i + 1
			}
		}

		return variables, method
	}

	var (
		methodDeclaration = text[0:openParamIndex]
		paramDeclarations []byte
		closedParamIndex  int = 0
	)

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
		lastQuoteIndex int  = 0
		currentQuote   byte = 0
	)

	removeQuoteText := func(i int) {
		method.Functionality = append(method.Functionality[:lastQuoteIndex], method.Functionality[i+1:]...)
		currentQuote = NoQuote
	}

	// Remove quotes and text inside quotes
	// INPUT:
	// String str='A';String str2='A',str3='B';

	// OUTPUT:
	// String str;String str2,str3;
	for i := 0; i < len(method.Functionality); i++ {
		if currentQuote == NoQuote {
			if method.Functionality[i] == SingleQuote {
				currentQuote = SingleQuote
				lastQuoteIndex = i
			} else if method.Functionality[i] == DoubleQuote {
				currentQuote = DoubleQuote
				lastQuoteIndex = i
			} else if method.Functionality[i] == TickerQuote {
				currentQuote = TickerQuote
				lastQuoteIndex = i
			}

			if lastQuoteIndex > 0 && (method.Functionality[lastQuoteIndex-1] == EqualSign || method.Functionality[lastQuoteIndex-1] == Comma) {

				lastQuoteIndex--
			}
		} else if currentQuote == SingleQuote && method.Functionality[i] == SingleQuote {
			removeQuoteText(i)
		} else if currentQuote == DoubleQuote && method.Functionality[i] == DoubleQuote {
			removeQuoteText(i)
		} else if currentQuote == TickerQuote && method.Functionality[i] == TickerQuote {
			removeQuoteText(i)
		}
	}

	var (
		numberOfOpenParenthesis  int  = 0
		numberOfValidOpenCurlies int  = 0
		isInsideSwitch           bool = false
	)

	// Prevent scope incrementation. Change open curlies to semicolons.
	for i := 0; i < len(method.Functionality); i++ {
		if i+5 < len(method.Functionality) &&
			method.Functionality[i] == 'c' &&
			method.Functionality[i+1] == 'a' &&
			method.Functionality[i+2] == 't' &&
			method.Functionality[i+3] == 'c' &&
			method.Functionality[i+4] == 'h' &&
			method.Functionality[i+5] == OpenParenthesis &&
			(i == 0 || method.Functionality[i-1] == SemiColon) {
			// Input: catch(IOException|SQLException ex)
			// Outpt: (IOException|SQLException)

			// Input: catch(IOException ex)
			// Outpt: (IOException)

			// Input: catch(IOException)
			// Outpt: (IOException)

			// Input: catch()
			// Outpt: ()

			// Remove catch(
			method.Functionality = append(method.Functionality[:i], method.Functionality[i+5:]...)

			var spaceIndex int = -1
			for j := i; j < len(method.Functionality); j++ {
				if method.Functionality[j] == Space {
					spaceIndex = j
				} else if method.Functionality[j] == ClosedParenthesis {
					if spaceIndex == -1 {
						spaceIndex = j
					}

					method.Functionality = append(method.Functionality[:spaceIndex], method.Functionality[j:]...)
					break
				}
			}
		} else if i+6 < len(method.Functionality) &&
			method.Functionality[i] == 's' &&
			method.Functionality[i+1] == 'w' &&
			method.Functionality[i+2] == 'i' &&
			method.Functionality[i+3] == 't' &&
			method.Functionality[i+4] == 'c' &&
			method.Functionality[i+5] == 'h' &&
			method.Functionality[i+6] == OpenParenthesis &&
			(i == 0 || method.Functionality[i-1] == SemiColon) {
			isInsideSwitch = true
		} else if method.Functionality[i] == Colon &&
			((i+6 < len(method.Functionality) && (method.Functionality[i+1] == 'w' && method.Functionality[i+2] == 'h' && method.Functionality[i+3] == 'i' && method.Functionality[i+4] == 'l' && method.Functionality[i+5] == 'e' && method.Functionality[i+6] == OpenParenthesis)) ||
				(i+4 < len(method.Functionality) && (method.Functionality[i+1] == 'f' && method.Functionality[i+2] == 'o' && method.Functionality[i+3] == 'r' && method.Functionality[i+4] == OpenParenthesis))) {
			// Remove labels from for and while loops
			for j := i - 1; j >= 0; j-- {
				if method.Functionality[j] == OpenCurly || method.Functionality[j] == ClosedCurly || method.Functionality[j] == ClosedParenthesis || method.Functionality[j] == SemiColon {
					method.Functionality = append(method.Functionality[:j+1], method.Functionality[i+1:]...)
					break
				} else if j == 0 {
					method.Functionality = append(method.Functionality[:j], method.Functionality[i+1:]...)
				}
			}
		} else if method.Functionality[i] == Colon && isInsideSwitch {
			// Remove default and colon
			if i > 7 && method.Functionality[i-8] == SemiColon && method.Functionality[i-7] == 'd' && method.Functionality[i-6] == 'e' && method.Functionality[i-5] == 'f' && method.Functionality[i-4] == 'a' && method.Functionality[i-3] == 'u' && method.Functionality[i-2] == 'l' && method.Functionality[i-1] == 't' {
				method.Functionality = append(method.Functionality[:i-7], method.Functionality[i+1:]...)
				continue
			}

			// Remove case keyword and colon but keep type
			for j := i - 1; j > 4; j-- {
				if method.Functionality[j] == SemiColon {
					break
				} else if method.Functionality[j-5] == SemiColon &&
					method.Functionality[j-4] == 'c' &&
					method.Functionality[j-3] == 'a' &&
					method.Functionality[j-2] == 's' &&
					method.Functionality[j-1] == 'e' &&
					(method.Functionality[j] == Space || method.Functionality[j] == OpenParenthesis) {
					cutLimit := j
					if method.Functionality[j] == Space {
						cutLimit++
					}
					method.Functionality[i] = SemiColon
					method.Functionality = append(method.Functionality[:j-4], method.Functionality[cutLimit:]...)
					i = i - 5

					break
				}
			}
		} else if method.Functionality[i] == Hyphen_MinusSign && i+1 < len(method.Functionality) && method.Functionality[i+1] == RightArrow {
			if isInsideSwitch {
				// INPUT: case Type1->result=1;
				// OUTPT: case Type1;result=1;

				for j := i - 1; j > 4; j-- {
					if method.Functionality[j] == SemiColon {
						break
					} else if method.Functionality[j-5] == SemiColon &&
						method.Functionality[j-4] == 'c' &&
						method.Functionality[j-3] == 'a' &&
						method.Functionality[j-2] == 's' &&
						method.Functionality[j-1] == 'e' &&
						(method.Functionality[j] == Space || method.Functionality[j] == OpenParenthesis) {
						cutLimit := j
						if method.Functionality[j] == Space {
							method.Functionality[i] = SemiColon
							cutLimit++
						} else {
							method.Functionality[i+1] = SemiColon
						}

						method.Functionality[i] = SemiColon
						method.Functionality = append(method.Functionality[:j-4], method.Functionality[cutLimit:]...)
						i = i - 5

						break
					}
				}

				cutLimit := i + 2
				if i+2 < len(method.Functionality) && method.Functionality[i+2] == OpenCurly {
					cutLimit++
				}

				method.Functionality = append(method.Functionality[:i+1], method.Functionality[cutLimit:]...)
			} else if numberOfOpenParenthesis > 0 {
				// INPUT: String s=invoke(()->"Hello");
				// OUTPT: String s;invoke();"Hello";

				// INPUT: String s=invoke(()->{"Hello";"Hello2";});
				// OUTPT: String s;invoke();"Hello";"Hello2";

				// INPUT: btn.setOnAction(otherParam,event->System.out.println("Hello"))
				// OUTPT: btn.setOnAction(otherParam);event;System.out.println("Hello");

				method.Functionality = append(method.Functionality[:i], method.Functionality[i+2:]...)

				if i <= 0 {
					continue
				}

				if method.Functionality[i-1] != ClosedParenthesis {
					// Need to add closing parenthesis
					// Need to add opening parenthesis
					method.Functionality = append(method.Functionality[:i+1], method.Functionality[i:]...)
					method.Functionality[i] = ClosedParenthesis
					i++

					for j := i - 1; j >= 0; j-- {
						if method.Functionality[j] == OpenParenthesis || method.Functionality[j] == Comma {
							method.Functionality = append(method.Functionality[:j+1], method.Functionality[j:]...)
							method.Functionality[j+1] = OpenParenthesis
							i++
							break
						}
					}
				}

				// String s=invoke(());
				// We are here:     ^

				// INPUT: String s=invoke(()->System.out.println());
				// OUTPT: String s;invoke();System.out.println();

				// INPUT: String s=invoke((t)->System.out.println());
				// OUTPT: String s;invoke();t;System.out.println();

				// INPUT: String s=invoke(p,(t)->System.out.println());
				// OUTPT: String s;invoke(p);t;System.out.println();

				// Remove this: String s=invoke(p,(t)System.out.println());
				//                                  ^
				method.Functionality = append(method.Functionality[:i-1], method.Functionality[i:]...)
				i--

				// Find this: String s=invoke(p,(tSystem.out.println());
				//                              ^
				var (
					openParenthesisIndex int = 0
					numberOfParenthesis1 int = 0
				)
				for j := i - 1; j >= 0; j-- {
					if numberOfParenthesis1 == 0 && method.Functionality[j] == OpenParenthesis {
						openParenthesisIndex = j
						break
					} else if method.Functionality[j] == ClosedParenthesis {
						numberOfParenthesis1++
					} else if method.Functionality[j] == OpenParenthesis {
						numberOfParenthesis1--
					}
				}

				// Find this: String s=invoke(p,(tSystem.out.println());
				//                             ^
				if openParenthesisIndex-1 > 0 && method.Functionality[openParenthesisIndex-1] == Comma {
					// Remove this: String s=invoke(p,(tSystem.out.println());
					//                               ^
					method.Functionality = append(method.Functionality[:openParenthesisIndex-1], method.Functionality[openParenthesisIndex:]...)
					i--
				}

				// Remove this: String s=invoke(p(tSystem.out.println());
				//                               ^
				method.Functionality = append(method.Functionality[:openParenthesisIndex-1], method.Functionality[openParenthesisIndex:]...)
				i--

				// INPUT: test.filter(p->p.getGender()==Person.Sex.MALE&&p.getAge()>=18)
				// OUTPT: test.filter();p;p.getGender()==Person.Sex.MALE&&p.getAge()>=18;

				// INPUT: btn.setOnAction(event->System.out.println("Hello"))
				// OUTPT: btn.setOnAction();event;System.out.println("Hello");

				// Remove open and close brackets
				// INPUT: String s=invoke(p(t{System.out.println()});
				// OUTPT: String s=invoke(p(tSystem.out.println());
				if method.Functionality[i] == OpenCurly {
					method.Functionality = append(method.Functionality[:i], method.Functionality[i+1:]...)
					curlyScope := 0
					ccIndex := i + 1

					for j := ccIndex; j < len(method.Functionality); j++ {
						if curlyScope == 0 && method.Functionality[j] == ClosedCurly {
							ccIndex = j
							break
						} else if method.Functionality[j] == OpenCurly {
							curlyScope++
						} else if method.Functionality[j] == ClosedCurly {
							curlyScope--
						}
					}

					if ccIndex+1 < len(method.Functionality) && method.Functionality[ccIndex+1] == SemiColon {
						method.Functionality = append(method.Functionality[:ccIndex+1], method.Functionality[ccIndex+2:]...)
					}

					method.Functionality = append(method.Functionality[:ccIndex], method.Functionality[ccIndex+1:]...)
				}

				// Find this: String s=invoke(ptSystem.out.println());
				//                                                  ^
				var (
					closedParenthesisIndex int = 0
					numberOfParenthesis2   int = 0
				)
				for j := i + 1; j < len(method.Functionality); j++ {
					if numberOfParenthesis2 == 0 && method.Functionality[j] == ClosedParenthesis {
						closedParenthesisIndex = j
						break
					} else if method.Functionality[j] == OpenParenthesis {
						numberOfParenthesis2++
					} else if method.Functionality[j] == ClosedParenthesis {
						numberOfParenthesis2--
					}
				}

				insertAtIndex := closedParenthesisIndex + 2
				if insertAtIndex+1 < len(method.Functionality) && method.Functionality[insertAtIndex+1] == SemiColon {
					insertAtIndex++
				}

				// Move functionality from inside to outside
				// INPUT: String s=invoke(p(tSystem.out.println(););
				// OUTPT: String s=invoke(p(t);System.out.println();
				fLength := closedParenthesisIndex - i

				method.Functionality = append(method.Functionality, method.Functionality[i:i+fLength]...)

				// INPUT: String s=invoke(testint a,int bYes;System.out.println(););int c;Yes;System.out.println();
				// OUTPT: String s=invoke(test);int c;Yes;System.out.println();
				method.Functionality = append(method.Functionality[:openParenthesisIndex-1], method.Functionality[i+fLength:]...)
			} else {
				var equalSignIndex int = 0
				for j := i - 1; j >= 0; j-- {
					if method.Functionality[j] == EqualSign {
						equalSignIndex = j
						break
					}
				}

				method.Functionality[equalSignIndex] = SemiColon

				method.Functionality = append(method.Functionality[:i], method.Functionality[i+1:]...)
				method.Functionality[i] = SemiColon

				if i > 0 && method.Functionality[i-1] == ClosedParenthesis {
					// INPUT: Integer test=(int x,int y)->{(x+y)/(x-y);System.out.println();};
					// OUTPT: Integer test;int x;int y;(x+y)/(x-y);System.out.println();

					// INPUT: Integer test=(int x,int y)->(x+y)/(x-y);
					// OUTPT: Integer test;int x;int y;(x+y)/(x-y);

					// INPUT: Integer test=(int x)->x+x;
					// OUTPT: Integer test;int x;x+x;

					// INPUT: Integer test=(int x,int y)->(x+y)/(x-y);
					// OUTPT: Integer test;int x;int y;(x+y)/(x-y);

					// INPUT: Integer test=(x)->(x+x);
					// OUTPT: Integer test;x;(x+x);

					// INPUT: Integer test=(x)->x+x;
					// OUTPT: Integer test;x;x+x;

					// INPUT: Integer test=()->7;
					// OUTPT: Integer test;7;

					for j := equalSignIndex + 2; j < i-2; j++ {
						if method.Functionality[j] == Comma {
							method.Functionality[j] = SemiColon
						}
					}
				}

				if i+1 < len(method.Functionality) && method.Functionality[i+1] == OpenCurly {
					// INPUT: Integer test=(int x,int y)->{(x+y)/(x-y);System.out.println();};
					// OUTPT: Integer test;int x;int y;(x+y)/(x-y);System.out.println();

					// INPUT: Integer test=(int x,int y)->{(x+y)/(x-y);System.out.println();}
					// OUTPT: Integer test;int x;int y;(x+y)/(x-y);System.out.println();

					// INPUT: Integer test=(int x,int y)->{};
					// OUTPT: Integer test;int x;int y;

					// INPUT: Integer test=(int x,int y)->{}
					// OUTPT: Integer test;int x;int y;

					method.Functionality = append(method.Functionality[:i+1], method.Functionality[i+2:]...)
					curlyScope := 0
					ccIndex := i + 1

					for j := ccIndex; j < len(method.Functionality); j++ {
						if curlyScope == 0 && method.Functionality[j] == ClosedCurly {
							ccIndex = j
							break
						} else if method.Functionality[j] == OpenCurly {
							curlyScope++
						} else if method.Functionality[j] == ClosedCurly {
							curlyScope--
						}
					}

					if ccIndex+1 < len(method.Functionality) && method.Functionality[ccIndex+1] == SemiColon {
						method.Functionality = append(method.Functionality[:ccIndex+1], method.Functionality[ccIndex+2:]...)
					}
				}
			}
		} else if i+1 < len(method.Functionality) && method.Functionality[i] == ClosedParenthesis && regexp.MustCompile(`^[a-zA-Z]*$`).Match([]byte{method.Functionality[i+1]}) {
			// This is to fix if and else if statements without scope brackets
			method.Functionality = append(method.Functionality[:i+2], method.Functionality[i+1:]...)
			method.Functionality[i+1] = SemiColon
		} else if i+1 < len(method.Functionality) &&
			(method.Functionality[i] == ClosedParenthesis && method.Functionality[i+1] == OpenCurly) ||
			((i < 2 || method.Functionality[i-2] == SemiColon) && i > 0 && method.Functionality[i-1] == 'd' && method.Functionality[i] == 'o' && method.Functionality[i+1] == OpenCurly) ||
			((i < 3 || method.Functionality[i-3] == SemiColon) && i > 1 && method.Functionality[i-2] == 't' && method.Functionality[i-1] == 'r' && method.Functionality[i] == 'y' && method.Functionality[i+1] == OpenCurly) ||
			((i < 4 || method.Functionality[i-4] == SemiColon) && i > 2 && method.Functionality[i-3] == 'e' && method.Functionality[i-2] == 'l' && method.Functionality[i-1] == 's' && method.Functionality[i] == 'e' && (method.Functionality[i+1] == OpenCurly || method.Functionality[i+1] == Space)) {
			method.Functionality[i+1] = SemiColon
			continue
		} else if numberOfValidOpenCurlies == 0 && method.Functionality[i] == ClosedCurly {
			method.Functionality[i] = SemiColon
			isInsideSwitch = false
		} else if method.Functionality[i] == OpenCurly {
			numberOfValidOpenCurlies++
		} else if method.Functionality[i] == ClosedCurly {
			numberOfValidOpenCurlies--
		} else if method.Functionality[i] == OpenParenthesis {
			numberOfOpenParenthesis++
		} else if method.Functionality[i] == ClosedParenthesis {
			numberOfOpenParenthesis--
		}
	}

	// Replace all double semicolons with just one
	REGEX_DoubleSemiColon := regexp.MustCompile(`;{2,}`)
	method.Functionality = REGEX_DoubleSemiColon.ReplaceAll(method.Functionality, []byte(";"))

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

	declarationSplit := bytes.Split(methodDeclaration, []byte(" "))
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

	if len(declarationSplit) > 1 {
		method.Type = declarationSplit[len(declarationSplit)-2]
	}
	if len(declarationSplit) > 0 {
		method.Name = declarationSplit[len(declarationSplit)-1]
	}

	return nil, method
}

// TODO
// Returns associations and dependencies
func getClassRelationTypes(variables []types.JavaVariable, methods []types.JavaMethod) ([][]byte, [][]byte) {
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
	// Class1 varName = new Class1(new Class2()); <<< Include Class1 and Class2
	// Class1 varName = new Class1(new Class2(new Class 3())); <<< Include Class1, Class2, and Class3
	// Need to watch out for quotations because they could be included in new Class parameters
	// The variable 'Type', method 'Type' and method parameters 'Type' will all have the same functionality

	// WATCH FOR THESE
	// System.out.println();
	// Type1 var1 = new Type2(,new Type3());
	// Type1 var2;
	// ActionListener task = new ActionListener();
	// boolean alreadyDisposed = false;
	// public void actionPerformed(ActionEvent e);
	// if(frame.isDisplayable());
	// if(frame.isDisplayable(true && new Type()));
	// if(frame.isDisplayable() == new Type4());
	// if(new Type5().value);
	// if(frame.isDisplayable() == true && new Type6().value);
	// if(frame.isDisplayable() == true && frame.isDisplayable() == new Type7());
	// alreadyDisposed = true;
	// frame.dispose();

	// TODO
	// // QUESTION
	// Say I've a code like:
	// import java.util.Date;
	// import my.own.Date;
	// class Test{
	//   public static void main(String [] args){
	//     // I want to choose my.own.Date here. How?
	//     ..
	//     // I want to choose util.Date here. How ?
	//   }
	// }
	// // ANSWER
	// You can omit the import statements and refer to them using the entire path. Eg:
	// java.util.Date javaDate = new java.util.Date()
	// my.own.Date myDate = new my.own.Date();

	var (
		associationsMap = make(map[string]struct{})
		associations    [][]byte
		dependenciesMap = make(map[string]struct{})
		dependencies    [][]byte
	)

	// Use map to prevent duplicates
	addToResponseMap := func(t []byte, relationMap map[string]struct{}) {
		relationMap[string(t)] = struct{}{}
	}

	getTypesFromType := func(text []byte, relationMap map[string]struct{}) {
		if len(text) > 0 && text[len(text)-1] != RightArrow {
			if len(text) > 2 && text[len(text)-2] == OpenBracket && text[len(text)-1] == ClosedBracket {
				addToResponseMap(text[:len(text)-2], relationMap)
				return
			}

			addToResponseMap(text, relationMap)
			return
		}

		var (
			newTypeStartIndex int = 0
		)

		for i := 0; i < len(text); i++ {
			if text[i] == LeftArrow || text[i] == RightArrow || text[i] == Comma {
				wantToPush := text[newTypeStartIndex:i]
				newTypeStartIndex = i + 1

				if len(wantToPush) == 0 || bytes.ContainsAny(wantToPush, "<>,") {
					continue
				}

				addToResponseMap(wantToPush, relationMap)
			}
		}
	}

	getTypesFromValue := func(text []byte, relationMap map[string]struct{}) {
		var (
			currentValueStyle  byte = NoQuote
			newClassStartIndex int  = -1
		)

		for i := 0; i < len(text); i++ {
			if (currentValueStyle == SingleQuote && text[i] == SingleQuote ||
				currentValueStyle == DoubleQuote && text[i] == DoubleQuote ||
				currentValueStyle == TickerQuote && text[i] == TickerQuote) &&
				(i == 0 || text[i-1] != Backslash) {
				currentValueStyle = NoQuote
			} else if currentValueStyle == NoQuote {
				if newClassStartIndex != -1 && (text[i] == OpenParenthesis || text[i] == OpenBracket) {
					addToResponseMap(text[newClassStartIndex:i], relationMap)
					newClassStartIndex = -1
				} else if newClassStartIndex == -1 && i+4 < len(text) &&
					text[i] == 'n' && text[i+1] == 'e' && text[i+2] == 'w' && text[i+3] == Space &&
					(i == 0 || text[i-1] == OpenParenthesis || text[i-1] == Comma) {
					newClassStartIndex = i + 4
				}
			}
		}
	}

	for _, variable := range variables {
		getTypesFromType(variable.Type, associationsMap)
		getTypesFromValue(variable.Value, associationsMap)
	}

	for _, method := range methods {
		getTypesFromType(method.Type, dependenciesMap)

		for _, parameter := range method.Parameters {
			getTypesFromType(parameter.Type, dependenciesMap)
		}

		tempLines := splitVariablesAndMethods(method.Functionality)
		lines := make([][]byte, len(tempLines))
		for i := range tempLines {
			lines[i] = make([]byte, len(tempLines[i]))
			copy(lines[i], tempLines[i])
			tempLines[i] = nil
		}
		tempLines = nil

		fmt.Printf("Functionality: %s\n", string(method.Functionality))

		// TODO should loop backwards instead and keep deleting lines when using continue
		// TODO Need to check all names.. not just 'new'... ex: System.out.println(s && SimpleClass1);
		// TODO Fish fish = (Fish)animal;
		for i := 0; i < len(lines); i++ {
			// TODO if statements
			// TODO if statements with no curlies
			// TODO while statements
			// TODO switch statements
			// TODO switch with lambda
			// TODO case statements
			// TODO ternary... ? :

			fmt.Printf("line1: %s\n", string(lines[i]))

			// This is the newest thing im doing... not working tho
			if openParenIndex, closedParenIndex := bytes.IndexByte(lines[i], OpenParenthesis), bytes.LastIndexByte(lines[i], ClosedParenthesis); openParenIndex != -1 && closedParenIndex != -1 {
				wantToAdd := lines[i][openParenIndex+1 : closedParenIndex]
				if len(wantToAdd) > 0 && wantToAdd[0] != SemiColon {
					lines = append(lines, lines[i][openParenIndex+1:closedParenIndex])
					lines[i] = append(lines[i][:openParenIndex], lines[i][closedParenIndex+1:]...)
				}
			}

			fmt.Printf("line2: %s\n", string(lines[i]))

			if hasOpenParen, hasClosingParen, hasClosingParenAndSemiColon := bytes.HasPrefix(lines[i], []byte("(")), bytes.HasSuffix(lines[i], []byte(")")), bytes.HasSuffix(lines[i], []byte(");")); hasOpenParen && (hasClosingParen || hasClosingParenAndSemiColon) {
				if hasClosingParen {
					// INPUT:
					// (new Type1()==new Type2()&&new Type3()==new Type4())

					// OUTPUT:
					// new Type1()==new Type2()&&new Type3()==new Type4()
					lines[i] = lines[i][1 : len(lines[i])-2]
				} else {
					// INPUT:
					// (new Type1()==new Type2()&&new Type3()==new Type4());

					// OUTPUT:
					// new Type1()==new Type2()&&new Type3()==new Type4()
					lines[i] = lines[i][1 : len(lines[i])-3]
				}

				lines = append(lines, lines[i])
				continue
			}

			if bytes.HasPrefix(lines[i], []byte("return ")) {
				// INPUT:
				// return new Class();

				// OUTPUT:
				// new Class();
				lines[i] = lines[i][7:]
				continue
			}

			// TODO should not do this... need to include all methods.. if they have an open parenthesis
			if isIfStatement, isElseIfStatement := bytes.HasPrefix(lines[i], []byte("if(")), bytes.HasPrefix(lines[i], []byte("else if(")); isIfStatement || isElseIfStatement {
				if isIfStatement {
					// INPUT:
					// if(new Type1()==new Type2()&&new Type3()==new Type4());

					// OUTPUT:
					// new Type1()==new Type2()&&new Type3()==new Type4()
					lines[i] = lines[i][3 : len(lines[i])-2]
				} else {
					// INPUT:
					// else if(new Type1()==new Type2()&&new Type3()==new Type4());

					// OUTPUT:
					// new Type1()==new Type2()&&new Type3()==new Type4()
					lines[i] = lines[i][8 : len(lines[i])-2]
				}

				lines = append(lines, lines[i])
				continue
			}

			// fmt.Printf("line1: %s\n", string(lines[i]))
			// if isIfStatement, isElseIfStatement := bytes.HasPrefix(lines[i], []byte("if(")), bytes.HasPrefix(lines[i], []byte("else if(")); isIfStatement || isElseIfStatement {
			// 	if isIfStatement {
			// 		lines[i] = lines[i][3 : len(lines[i])-2]
			// 	} else {
			// 		lines[i] = lines[i][8 : len(lines[i])-2]
			// 	}
			// 	var (
			// 		numberOfRemovedOpenParenthesis int = 0
			// 		numberOfValidOpenParenthesis   int = 0
			// 	)
			// 	for j := 0; j < len(lines[i]); j++ {
			// 		if j+1 < len(lines[i]) && lines[i][j+1] == OpenParenthesis &&
			// 			(j == 0 || lines[i][j] == EqualSign ||
			// 				lines[i][j] == AndCondition ||
			// 				lines[i][j] == OrCondition ||
			// 				lines[i][j] == LeftArrow ||
			// 				lines[i][j] == RightArrow ||
			// 				lines[i][j] == ExclamationMark ||
			// 				lines[i][j] == PlusSign ||
			// 				lines[i][j] == Hyphen_MinusSign ||
			// 				lines[i][j] == Tilde ||
			// 				lines[i][j] == Slash ||
			// 				lines[i][j] == Percent ||
			// 				lines[i][j] == Caret) {
			// 			lines[i] = append(lines[i][:j+1], lines[i][j+2:]...)
			// 			numberOfRemovedOpenParenthesis++
			// 		} else if numberOfRemovedOpenParenthesis != 0 {
			// 			if numberOfValidOpenParenthesis == 0 && lines[i][j] == ClosedParenthesis {
			// 				lines[i] = append(lines[i][:j], lines[i][j+1:]...)
			// 				numberOfRemovedOpenParenthesis--
			// 			} else if lines[i][j] == OpenParenthesis {
			// 				numberOfValidOpenParenthesis++
			// 			} else if lines[i][j] == ClosedParenthesis {
			// 				numberOfValidOpenParenthesis--
			// 			}
			// 		}
			// 	}
			// } else if bytes.HasPrefix(lines[i], []byte("for(")) {
			// 	lines[i] = lines[i][4 : len(lines[i])-2]
			// 	var (
			// 		lastAddStartIndex int = 0
			// 	)
			// 	for j := 0; j < len(lines[i]); j++ {
			// 		if lines[i][j] == SemiColon {
			// 			fmt.Printf("ADDING: %s\n", string(lines[i][lastAddStartIndex:j+1]))
			// 			lines = append(lines, lines[i][lastAddStartIndex:j+1])
			// 			lastAddStartIndex = j + 1
			// 		}
			// 	}
			// 	fmt.Printf("ADDING2: %s\n", string(lines[i][lastAddStartIndex:]))
			// 	lines = append(lines, lines[i][lastAddStartIndex:])

			// } else if bytes.HasPrefix(lines[i], []byte("switch(")) {
			// 	lines[i] = lines[i][7 : len(lines[i])-2]
			// }
			// fmt.Printf("line2: %s\n", string(lines[i]))
			// for j := 0; j < len(lines[i]); j++ {
			// 	if lines[i][j] == EqualSign ||
			// 		lines[i][j] == AndCondition ||
			// 		lines[i][j] == OrCondition ||
			// 		(j+1 < len(lines[i]) && lines[i][j+1] != EqualSign &&
			// 			(lines[i][j] == LeftArrow ||
			// 				lines[i][j] == RightArrow)) {
			// 		var (
			// 			wantToAddLine     []byte = lines[i][j+1:]
			// 			lastAddStartIndex int    = 0
			// 		)
			// 		for k := 0; k < len(wantToAddLine); k++ {
			// 			if wantToAddLine[k] == SemiColon {
			// 				lines = append(lines, wantToAddLine[lastAddStartIndex:k+1])
			// 				lastAddStartIndex = k + 1
			// 			}
			// 		}
			// 		lines[i] = lines[i][0:j]
			// 	}
			// }

			// openParenthesisIndex := bytes.IndexByte(lines[i], OpenParenthesis)
			// if openParenthesisIndex != -1 && openParenthesisIndex+1 < len(lines[i]) && lines[i][openParenthesisIndex+1] != ClosedParenthesis {
			// 	var inside []byte
			// 	if lines[i][len(lines[i])-1] == SemiColon {
			// 		inside = append(inside, lines[i][openParenthesisIndex+1:len(lines[i])-2]...)
			// 	} else {
			// 		inside = append(inside, lines[i][openParenthesisIndex+1:len(lines[i])-1]...)
			// 	}
			// 	var (
			// 		numberOfOpenParenthesis int = 0
			// 		numberOfOpenCurlies     int = 0
			// 		numberOfOpenBrackets    int = 0
			// 	)
			// 	for j := 0; j < len(inside); j++ {
			// 		if inside[j] == Comma {
			// 			if j == 0 {
			// 				inside = inside[1:]
			// 				continue
			// 			} else if numberOfOpenParenthesis != 0 || numberOfOpenCurlies != 0 || numberOfOpenBrackets != 0 {
			// 				continue
			// 			}
			// 			lines = append(lines, inside[:j])
			// 			inside = inside[j+1:]
			// 		} else if inside[j] == OpenParenthesis {
			// 			numberOfOpenParenthesis++
			// 		} else if inside[j] == ClosedParenthesis {
			// 			numberOfOpenParenthesis--
			// 		} else if inside[j] == OpenCurly {
			// 			numberOfOpenCurlies++
			// 		} else if inside[j] == ClosedCurly {
			// 			numberOfOpenCurlies--
			// 		} else if inside[j] == OpenBracket {
			// 			numberOfOpenBrackets++
			// 		} else if inside[j] == ClosedBracket {
			// 			numberOfOpenBrackets--
			// 		}
			// 	}
			// 	lines = append(lines, inside)
			// 	lines[i] = append(lines[i][0:openParenthesisIndex+1], ");"...)
			// }

			// fmt.Printf("line3: %s\n", string(lines[i]))

			// Lines from here on out should be of these types:
			// System.out.println(); << discard
			// new Type2(new Type3()) && new Type2(new Type3());
			// Type1<Type2> var2;

			lineSplit := bytes.Split(lines[i], []byte(" "))
			if len(lineSplit) <= 1 {
				continue
			}

			if bytes.Equal(lineSplit[0], []byte("throw")) && bytes.Equal(lineSplit[1], []byte("new")) {
				lines[i] = lines[i][6:] // Remove "throw "
				getTypesFromValue(lines[i], dependenciesMap)
				continue
			}

			// DONE
			// new Type2(new Type3());
			if bytes.Equal(lineSplit[0], []byte("new")) {
				getTypesFromValue(lines[i], dependenciesMap)
				continue
			}

			// DONE
			// Type1<Type2> var2;
			getTypesFromType(lineSplit[len(lineSplit)-2], dependenciesMap)
		}
	}

	// Add map values to dependencies array
	for key := range associationsMap {
		associations = append(associations, []byte(key))
	}

	// Add map values to dependencies array
	for key := range dependenciesMap {
		if _, exists := associationsMap[key]; !exists {
			fmt.Printf("got dependency: %s\n", key)
			dependencies = append(dependencies, []byte(key))
		}
	}

	return associations, dependencies
}

// DONE
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
