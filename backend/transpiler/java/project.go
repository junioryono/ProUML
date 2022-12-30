package java

import (
	"bytes"
	"strings"
	"unicode"

	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func ParseProject(files []types.File) *types.Project {
	var (
		response    types.Project
		parsedFiles []types.FileResponse
	)

	for _, file := range files {
		parsedFile := parseFile(file)
		parsedFiles = append(parsedFiles, parsedFile)
	}

	allClassExports := getClassExports(parsedFiles)

	for _, parsedFile := range parsedFiles {
		for _, parsedClass := range parsedFile.Data {
			switch class := parsedClass.(type) {
			case types.JavaAbstract:
				validImportedTypeNames := getValidExternalTypesOfClass(allClassExports, parsedFile.Imports, parsedFile.Package, class.Name)
				class.Associations, class.Dependencies = getClassAssociationsAndDependencies(validImportedTypeNames, class.Variables, class.Methods)
				response.Nodes = append(response.Nodes, class)
				// response.Edges = append(response.Edges, getClassRelationConnections(response.Edges, validImportedTypeNames, class)...)
			case types.JavaClass:
				validImportedTypeNames := getValidExternalTypesOfClass(allClassExports, parsedFile.Imports, parsedFile.Package, class.Name)
				class.Associations, class.Dependencies = getClassAssociationsAndDependencies(validImportedTypeNames, class.Variables, class.Methods)
				response.Nodes = append(response.Nodes, class)
				// response.Edges = append(response.Edges, getClassRelationConnections(response.Edges, validImportedTypeNames, class)...)
			case types.JavaEnum:
				validImportedTypeNames := getValidExternalTypesOfClass(allClassExports, parsedFile.Imports, parsedFile.Package, class.Name)
				response.Nodes = append(response.Nodes, class)
				// response.Edges = append(response.Edges, getClassRelationConnections(response.Edges, validImportedTypeNames, class)...)
				_ = validImportedTypeNames
			case types.JavaInterface:
				validImportedTypeNames := getValidExternalTypesOfClass(allClassExports, parsedFile.Imports, parsedFile.Package, class.Name)
				class.Associations, class.Dependencies = getClassAssociationsAndDependencies(validImportedTypeNames, class.Variables, class.Methods)
				response.Nodes = append(response.Nodes, class)
				// response.Edges = append(response.Edges, getClassRelationConnections(response.Edges, validImportedTypeNames, class)...)
			}
		}
	}

	return &response
}

func getClassExports(parsedFiles []types.FileResponse) []types.JavaClassExports {
	var response []types.JavaClassExports

	getAllValidExportedClassTypeNames := func(packageName []byte, parsedClass any) types.JavaClassExports {
		var current types.JavaClassExports
		current.Package = packageName

		exportsMap := make(map[string]struct{})

		// Use map to prevent duplicates
		addToExportsMap := func(t []byte) {
			exportsMap[string(t)] = struct{}{}
		}

		addExportsClassHelper := func(innerPackageName, innerClassName []byte, variables []types.JavaVariable, methods []types.JavaMethod) {
			addToExportsMap(innerClassName)

			var temp1 []byte
			temp1 = append(temp1, innerPackageName...)
			temp1 = append(temp1, []byte(".")...)
			temp1 = append(temp1, innerClassName...)
			addToExportsMap(temp1)

			for _, variable := range variables {
				var temp2 []byte
				temp2 = append(temp2, innerPackageName...)
				temp2 = append(temp2, []byte(".")...)
				temp2 = append(temp2, innerClassName...)
				temp2 = append(temp2, []byte(".")...)
				temp2 = append(temp2, variable.Name...)
				addToExportsMap(temp2)

				var temp3 []byte
				temp3 = append(temp3, innerClassName...)
				temp3 = append(temp3, []byte(".")...)
				temp3 = append(temp3, variable.Name...)
				addToExportsMap(temp3)
			}

			for _, method := range methods {
				var temp2 []byte
				temp2 = append(temp2, innerPackageName...)
				temp2 = append(temp2, []byte(".")...)
				temp2 = append(temp2, innerClassName...)
				temp2 = append(temp2, []byte(".")...)
				temp2 = append(temp2, method.Name...)
				addToExportsMap(temp2)

				var temp3 []byte
				temp3 = append(temp3, innerClassName...)
				temp3 = append(temp3, []byte(".")...)
				temp3 = append(temp3, method.Name...)
				addToExportsMap(temp3)
			}
		}

		addExportsEnumHelper := func(innerPackageName, innerClassName []byte, declarations [][]byte) {
			addToExportsMap(innerClassName)

			var temp1 []byte
			temp1 = append(temp1, innerPackageName...)
			temp1 = append(temp1, []byte(".")...)
			temp1 = append(temp1, innerClassName...)
			addToExportsMap(temp1)

			for _, declaration := range declarations {
				var temp2 []byte
				temp2 = append(temp2, innerPackageName...)
				temp2 = append(temp2, []byte(".")...)
				temp2 = append(temp2, innerClassName...)
				temp2 = append(temp2, []byte(".")...)
				temp2 = append(temp2, declaration...)
				addToExportsMap(temp2)

				var temp3 []byte
				temp3 = append(temp3, innerClassName...)
				temp3 = append(temp3, []byte(".")...)
				temp3 = append(temp3, declaration...)
				addToExportsMap(temp3)
			}
		}

		switch class := parsedClass.(type) {
		case types.JavaAbstract:
			current.Name = class.Name
			addExportsClassHelper(current.Package, class.Name, class.Variables, class.Methods)
		case types.JavaClass:
			current.Name = class.Name
			addExportsClassHelper(current.Package, class.Name, class.Variables, class.Methods)
		case types.JavaEnum:
			current.Name = class.Name
			addExportsEnumHelper(current.Package, class.Name, class.Declarations)
		case types.JavaInterface:
			current.Name = class.Name
			addExportsClassHelper(current.Package, class.Name, class.Variables, class.Methods)
		}

		for key := range exportsMap {
			current.Exports = append(current.Exports, []byte(key))
		}

		return current
	}

	for _, parsedFile := range parsedFiles {
		for _, parsedClass := range parsedFile.Data {
			switch class := parsedClass.(type) {
			case types.JavaAbstract:
				response = append(response, getAllValidExportedClassTypeNames(parsedFile.Package, class))
			case types.JavaClass:
				response = append(response, getAllValidExportedClassTypeNames(parsedFile.Package, class))
			case types.JavaEnum:
				response = append(response, getAllValidExportedClassTypeNames(parsedFile.Package, class))
			case types.JavaInterface:
				response = append(response, getAllValidExportedClassTypeNames(parsedFile.Package, class))
			}
		}
	}

	return response
}

func getValidExternalTypesOfClass(allClassExports []types.JavaClassExports, imports [][]byte, packageName []byte, className []byte) map[string]struct{} {
	var response = make(map[string]struct{})

	// Need to add all exports that are in the current package and alternative packages if they are imported
	for _, allClasses := range allClassExports {
		if bytes.Equal(allClasses.Package, packageName) && bytes.Equal(allClasses.Name, className) {
			continue
		}

		if !bytes.Equal(allClasses.Package, packageName) {
			isImported := false

			currentClassPackageNameSplit := bytes.Split(allClasses.Package, []byte("."))

			for _, impt := range imports {
				importSplit := bytes.Split(impt, []byte("."))
				if len(importSplit) == 0 || len(importSplit) != len(currentClassPackageNameSplit)+1 {
					continue
				}

				if len(importSplit) == 1 && bytes.Equal(allClasses.Name, importSplit[0]) {
					isImported = true
					break
				}

				isSamePackage := true
				for i := 0; i < len(currentClassPackageNameSplit); i++ {
					if !bytes.Equal(currentClassPackageNameSplit[i], importSplit[i]) {
						isSamePackage = false
						break
					}
				}

				if !isSamePackage || (!bytes.Equal(importSplit[len(importSplit)-1], []byte("*")) && !bytes.Equal(importSplit[len(importSplit)-1], allClasses.Name)) {
					continue
				}

				isImported = true
				break
			}

			if !isImported {
				continue
			}
		}

		for _, export := range allClasses.Exports {
			response[string(export)] = struct{}{}
		}
	}

	return response
}

// Returns associations and dependencies
func getClassAssociationsAndDependencies(importedTypeNames map[string]struct{}, variables []types.JavaVariable, methods []types.JavaMethod) ([][]byte, [][]byte) {
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

	currentlyDeclaredVariableNames := make(map[string]int) // string is variable name, int is scope of variable

	addVariableAtScope := func(name []byte, scope int) {
		// Only add the variable here if it's not already declared.
		// This is to prevent a higher numbered scope from overwriting a lower numbered scope
		if _, ok := currentlyDeclaredVariableNames[string(name)]; !ok {
			currentlyDeclaredVariableNames[string(name)] = scope
		}
	}

	removeVariablesAtAndAboveScope := func(scope int) {
		for vName, vScope := range currentlyDeclaredVariableNames {
			if vScope >= scope {
				delete(currentlyDeclaredVariableNames, vName)
			}
		}
	}

	for _, variable := range variables {
		addVariableAtScope(variable.Name, 0)

		getTypesFromType(variable.Type, associationsMap)
		getTypesFromValue(variable.Value, associationsMap)
	}

	checkIfTypeNameIsInFunctionality := func(functionality []byte, typeName []byte, currentScope int) bool {
		ok := bytes.HasPrefix(functionality, typeName)
		if !ok {
			return false
		}

		// Check if it is being set as a variable name
		if len(typeName) < len(functionality) && unicode.IsLetter(rune(functionality[len(typeName)])) {
			currentlyDeclaredVariableNames[string(typeName)] = currentScope
		}

		// It is being used as a type
		return true
	}

	for _, method := range methods {
		getTypesFromType(method.Type, dependenciesMap)

		for _, parameter := range method.Parameters {
			addVariableAtScope(parameter.Name, 1)
			getTypesFromType(parameter.Type, dependenciesMap)
		}

		var currentScope int = 1

		for i, f := 0, ignoreQuotes(&method.Functionality); i < len(method.Functionality); i++ {
			isInsideQuotation := f(i)
			if isInsideQuotation {
				continue
			}

			if i != 0 &&
				method.Functionality[i] != OpenCurly &&
				method.Functionality[i] != ClosedCurly &&
				method.Functionality[i] != OpenParenthesis &&
				method.Functionality[i] != ClosedParenthesis &&
				method.Functionality[i] != OpenBracket &&
				method.Functionality[i] != ClosedBracket &&
				method.Functionality[i] != LeftArrow &&
				method.Functionality[i] != RightArrow &&
				method.Functionality[i] != Colon &&
				method.Functionality[i] != SemiColon &&
				method.Functionality[i] != EqualSign &&
				method.Functionality[i] != Slash &&
				method.Functionality[i] != Backslash &&
				method.Functionality[i] != Asterisk &&
				method.Functionality[i] != Comma &&
				method.Functionality[i] != AndCondition &&
				method.Functionality[i] != OrCondition &&
				method.Functionality[i] != ExclamationMark &&
				method.Functionality[i] != QuestionMark &&
				method.Functionality[i] != PlusSign &&
				method.Functionality[i] != Hyphen_MinusSign &&
				method.Functionality[i] != Tilde &&
				method.Functionality[i] != Percent &&
				method.Functionality[i] != Caret {
				continue
			}

			if method.Functionality[i] == OpenCurly {
				currentScope++
				continue
			}

			if method.Functionality[i] == ClosedCurly {
				removeVariablesAtAndAboveScope(currentScope)
				currentScope--
				continue
			}

			// Iterate over importedTypeNames and see if method.Functionality[i...] matches importedTypeNames[k][i...]
			// If it does match, check if it is a variable name, and if it is add it to currentlyDeclaredVariableNames
			// Otherwise if it is not a variable name, just add it with addToResponseMap(NameHere, dependenciesMap)
			for typeName := range importedTypeNames {
				ok := checkIfTypeNameIsInFunctionality(method.Functionality[i:], []byte(typeName), currentScope)

				if !ok {
					continue
				}

				addToResponseMap([]byte(typeName), dependenciesMap)
			}

		}

		removeVariablesAtAndAboveScope(1)
	}

	for key := range associationsMap {
		associations = append(associations, []byte(key))
	}

	for key := range dependenciesMap {
		dependencies = append(dependencies, []byte(key))
	}

	return associations, dependencies
}

func getClassRelationConnections(relations []types.Relation, importedTypeNames map[string]struct{}, class any) []types.Relation {
	// Association is a stronger form of a dependency

	// Arrow types: Association, Dependency, Realization, Generalization, NestedOwnership
	// Correlating: Associations, Dependencies, Implements, Extends, DefinedWithin

	ensureClassIdBelongsToCurrentProject := func(classId []byte) []byte {
		if bytes.Count(classId, []byte(".")) != 0 {
			if _, ok := importedTypeNames[string(classId)]; ok {
				return classId
			}

			return nil
		}

		classIdString := "." + string(classId)
		for importedTypeName := range importedTypeNames {
			if strings.HasSuffix(importedTypeName, classIdString) {
				return []byte(importedTypeName)
			}
		}

		return nil
	}

	getExistingRelationData := func(classId1, classId2 []byte) *types.Relation {
		for _, relation := range relations {
			if (bytes.Equal(relation.FromClassId, classId1) && bytes.Equal(relation.ToClassId, classId2)) ||
				bytes.Equal(relation.FromClassId, classId2) && bytes.Equal(relation.ToClassId, classId1) {
				return &relation
			}
		}

		return nil
	}

	appendRelation := func(fromClassId, targetId []byte, relation types.RelationData) {
		var toClassId []byte
		toClassId = append(toClassId, targetId...)
		toClassId = ensureClassIdBelongsToCurrentProject(toClassId)

		if toClassId == nil {
			return
		}

		existingRelation := getExistingRelationData(fromClassId, toClassId)
		if existingRelation != nil && bytes.Equal(existingRelation.FromClassId, targetId) {
			existingRelation.Type.SetFromArrow(true)
			relation = nil
			return
		}

		relation.SetToArrow(true)
		relations = append(relations, types.Relation{
			FromClassId: fromClassId,
			ToClassId:   toClassId,
			Type:        relation,
		})
	}

	switch c := class.(type) {
	case types.JavaAbstract:
		var FromClassId []byte
		FromClassId = append(FromClassId, c.Package...)
		FromClassId = append(FromClassId, byte('.'))
		FromClassId = append(FromClassId, c.Name...)

		for _, implement := range c.Implements {
			appendRelation(FromClassId, append([]byte(""), implement...), &types.Realization{})
		}

		for _, extend := range c.Extends {
			appendRelation(FromClassId, append([]byte(""), extend...), &types.Generalization{})
		}

		if c.DefinedWithin != nil {
			appendRelation(FromClassId, append([]byte(""), c.DefinedWithin...), &types.NestedOwnership{})
		}

		for _, association := range c.Associations {
			appendRelation(FromClassId, append([]byte(""), association...), &types.Association{})
		}

		for _, dependency := range c.Dependencies {
			appendRelation(FromClassId, append([]byte(""), dependency...), &types.Dependency{})
		}

	case types.JavaClass:
		var FromClassId []byte
		FromClassId = append(FromClassId, c.Package...)
		FromClassId = append(FromClassId, byte('.'))
		FromClassId = append(FromClassId, c.Name...)

		for _, implement := range c.Implements {
			appendRelation(FromClassId, append([]byte(""), implement...), &types.Realization{})
		}

		for _, extend := range c.Extends {
			appendRelation(FromClassId, append([]byte(""), extend...), &types.Generalization{})
		}

		if c.DefinedWithin != nil {
			appendRelation(FromClassId, append([]byte(""), c.DefinedWithin...), &types.NestedOwnership{})
		}

		for _, association := range c.Associations {
			appendRelation(FromClassId, append([]byte(""), association...), &types.Association{})
		}

		for _, dependency := range c.Dependencies {
			appendRelation(FromClassId, append([]byte(""), dependency...), &types.Dependency{})
		}

	case types.JavaInterface:
		var FromClassId []byte
		FromClassId = append(FromClassId, c.Package...)
		FromClassId = append(FromClassId, byte('.'))
		FromClassId = append(FromClassId, c.Name...)

		for _, extend := range c.Extends {
			appendRelation(FromClassId, append([]byte(""), extend...), &types.Generalization{})
		}

		if c.DefinedWithin != nil {
			appendRelation(FromClassId, append([]byte(""), c.DefinedWithin...), &types.NestedOwnership{})
		}

		for _, association := range c.Associations {
			appendRelation(FromClassId, append([]byte(""), association...), &types.Association{})
		}

		for _, dependency := range c.Dependencies {
			appendRelation(FromClassId, append([]byte(""), dependency...), &types.Dependency{})
		}

	case types.JavaEnum:
		var FromClassId []byte
		FromClassId = append(FromClassId, c.Package...)
		FromClassId = append(FromClassId, byte('.'))
		FromClassId = append(FromClassId, c.Name...)

		for _, implement := range c.Implements {
			appendRelation(FromClassId, append([]byte(""), implement...), &types.Realization{})
		}

		if c.DefinedWithin != nil {
			appendRelation(FromClassId, append([]byte(""), c.DefinedWithin...), &types.NestedOwnership{})
		}
	}

	return relations
}
