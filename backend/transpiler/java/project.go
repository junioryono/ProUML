package java

import (
	"bytes"
	"strings"

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
				response.Edges = append(response.Edges, getClassRelationConnections(response.Edges, validImportedTypeNames, class)...)
			case types.JavaClass:
				validImportedTypeNames := getValidExternalTypesOfClass(allClassExports, parsedFile.Imports, parsedFile.Package, class.Name)
				class.Associations, class.Dependencies = getClassAssociationsAndDependencies(validImportedTypeNames, class.Variables, class.Methods)
				response.Nodes = append(response.Nodes, class)
				response.Edges = append(response.Edges, getClassRelationConnections(response.Edges, validImportedTypeNames, class)...)
			case types.JavaEnum:
				validImportedTypeNames := getValidExternalTypesOfClass(allClassExports, parsedFile.Imports, parsedFile.Package, class.Name)
				response.Nodes = append(response.Nodes, class)
				response.Edges = append(response.Edges, getClassRelationConnections(response.Edges, validImportedTypeNames, class)...)
			case types.JavaInterface:
				validImportedTypeNames := getValidExternalTypesOfClass(allClassExports, parsedFile.Imports, parsedFile.Package, class.Name)
				class.Associations, class.Dependencies = getClassAssociationsAndDependencies(validImportedTypeNames, class.Variables, class.Methods)
				response.Nodes = append(response.Nodes, class)
				response.Edges = append(response.Edges, getClassRelationConnections(response.Edges, validImportedTypeNames, class)...)
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

		addExportsHelper := func(innerPackageName, innerClassName []byte) {
			addToExportsMap(innerClassName)

			var withPackageName []byte
			withPackageName = append(withPackageName, innerPackageName...)
			withPackageName = append(withPackageName, []byte(".")...)
			withPackageName = append(withPackageName, innerClassName...)
			addToExportsMap(withPackageName)
		}

		switch class := parsedClass.(type) {
		case types.JavaAbstract:
			current.Name = class.Name
			addExportsHelper(current.Package, class.Name)
		case types.JavaClass:
			current.Name = class.Name
			addExportsHelper(current.Package, class.Name)
		case types.JavaEnum:
			current.Name = class.Name
			addExportsHelper(current.Package, class.Name)
		case types.JavaInterface:
			current.Name = class.Name
			addExportsHelper(current.Package, class.Name)
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
func getClassAssociationsAndDependencies(importedTypeNames map[string]struct{}, variables []types.JavaVariable, methods []types.JavaMethod) ([]types.CustomByteSlice, []types.CustomByteSlice) {
	var (
		//associationsMap = make(map[string]struct{})
		associations []types.CustomByteSlice
		//dependenciesMap = make(map[string]struct{})
		dependencies []types.CustomByteSlice
	)

	// // Use map to prevent duplicates
	// addToResponseMap := func(t []byte, relationMap map[string]struct{}) {
	// 	relationMap[string(t)] = struct{}{}
	// }

	// getTypesFromType := func(text []byte, relationMap map[string]struct{}) {
	// 	if len(text) > 0 && text[len(text)-1] != RightArrow {
	// 		if len(text) > 2 && text[len(text)-2] == OpenBracket && text[len(text)-1] == ClosedBracket {
	// 			addToResponseMap(text[:len(text)-2], relationMap)
	// 			return
	// 		}

	// 		addToResponseMap(text, relationMap)
	// 		return
	// 	}

	// 	var (
	// 		newTypeStartIndex int = 0
	// 	)

	// 	for i := 0; i < len(text); i++ {
	// 		if text[i] == LeftArrow || text[i] == RightArrow || text[i] == Comma {
	// 			wantToPush := text[newTypeStartIndex:i]
	// 			newTypeStartIndex = i + 1

	// 			if len(wantToPush) == 0 || bytes.ContainsAny(wantToPush, "<>,") {
	// 				continue
	// 			}

	// 			addToResponseMap(wantToPush, relationMap)
	// 		}
	// 	}
	// }

	// getTypesFromValue := func(text []byte, relationMap map[string]struct{}) {
	// 	var (
	// 		currentValueStyle  byte = NoQuote
	// 		newClassStartIndex int  = -1
	// 	)

	// 	for i := 0; i < len(text); i++ {
	// 		if (currentValueStyle == SingleQuote && text[i] == SingleQuote ||
	// 			currentValueStyle == DoubleQuote && text[i] == DoubleQuote ||
	// 			currentValueStyle == TickerQuote && text[i] == TickerQuote) &&
	// 			(i == 0 || text[i-1] != Backslash) {
	// 			currentValueStyle = NoQuote
	// 		} else if currentValueStyle == NoQuote {
	// 			if newClassStartIndex != -1 && (text[i] == OpenParenthesis || text[i] == OpenBracket) {
	// 				addToResponseMap(text[newClassStartIndex:i], relationMap)
	// 				newClassStartIndex = -1
	// 			} else if newClassStartIndex == -1 && i+4 < len(text) &&
	// 				text[i] == 'n' && text[i+1] == 'e' && text[i+2] == 'w' && text[i+3] == Space &&
	// 				(i == 0 || text[i-1] == OpenParenthesis || text[i-1] == Comma) {
	// 				newClassStartIndex = i + 4
	// 			}
	// 		}
	// 	}
	// }

	// currentlyDeclaredVariableNames := make(map[string]int) // string is variable name, int is scope of variable

	// addVariableAtScope := func(name []byte, scope int) {
	// 	// Only add the variable here if it's not already declared.
	// 	// This is to prevent a higher numbered scope from overwriting a lower numbered scope
	// 	if _, ok := currentlyDeclaredVariableNames[string(name)]; !ok {
	// 		currentlyDeclaredVariableNames[string(name)] = scope
	// 	}
	// }

	// removeVariablesAtAndAboveScope := func(scope int) {
	// 	for vName, vScope := range currentlyDeclaredVariableNames {
	// 		if vScope >= scope {
	// 			delete(currentlyDeclaredVariableNames, vName)
	// 		}
	// 	}
	// }

	// for _, variable := range variables {
	// 	addVariableAtScope(variable.Name, 0)

	// 	getTypesFromType(variable.Type, associationsMap)
	// 	getTypesFromValue(variable.Value, associationsMap)
	// }

	// checkIfTypeNameIsInFunctionality := func(functionality []byte, typeName []byte, currentScope int) bool {
	// 	ok := bytes.HasPrefix(functionality, typeName)
	// 	if !ok {
	// 		return false
	// 	}

	// 	if len(functionality) == len(typeName) {
	// 		return true
	// 	}

	// 	nextByte := functionality[len(typeName)]

	// 	// Check if it is being set as a variable name
	// 	if nextByte == EqualSign {
	// 		currentlyDeclaredVariableNames[string(typeName)] = currentScope
	// 		return false
	// 	}

	// 	// Check if it is being used as a type
	// 	if nextByte == Period ||
	// 		nextByte == OpenCurly ||
	// 		nextByte == ClosedCurly ||
	// 		nextByte == OpenParenthesis ||
	// 		nextByte == ClosedParenthesis ||
	// 		nextByte == OpenBracket ||
	// 		nextByte == ClosedBracket ||
	// 		nextByte == LeftArrow ||
	// 		nextByte == RightArrow ||
	// 		nextByte == Colon ||
	// 		nextByte == SemiColon ||
	// 		nextByte == Slash ||
	// 		nextByte == Backslash ||
	// 		nextByte == Asterisk ||
	// 		nextByte == Comma ||
	// 		nextByte == AndCondition ||
	// 		nextByte == OrCondition ||
	// 		nextByte == ExclamationMark ||
	// 		nextByte == QuestionMark ||
	// 		nextByte == PlusSign ||
	// 		nextByte == Hyphen_MinusSign ||
	// 		nextByte == Tilde ||
	// 		nextByte == Percent ||
	// 		nextByte == Caret ||
	// 		nextByte == Space {
	// 		// It is being used as a type
	// 		return true
	// 	}

	// 	// It is part of another word.
	// 	// For example, if the typeName is "hello1", and the functionality contains "hello12", then it is not being used as a type
	// 	return false
	// }

	// for _, method := range methods {
	// 	// getTypesFromType(method.Type, dependenciesMap)
	// 	// ^ This is commented out because of their use with interfaces.
	// 	// For example, if a method has a return type of "ProductIF", then it is not a dependency,
	// 	// but a class that implements the interface "ProductIF" and is used as a dependency in the functionality will be included as a dependency

	// 	for _, parameter := range method.Parameters {
	// 		addVariableAtScope(parameter.Name, 1)
	// 		getTypesFromType(parameter.Type, dependenciesMap)
	// 	}

	// 	var currentScope int = 1

	// 	for i, f := 0, ignoreQuotes(&method.Functionality); i < len(method.Functionality); i++ {
	// 		isInsideQuotation := f(i)
	// 		if isInsideQuotation {
	// 			continue
	// 		}

	// 		if method.Functionality[i] == OpenCurly {
	// 			currentScope++
	// 			continue
	// 		}

	// 		if method.Functionality[i] == ClosedCurly {
	// 			removeVariablesAtAndAboveScope(currentScope)
	// 			currentScope--
	// 			continue
	// 		}

	// 		if i != 0 &&
	// 			method.Functionality[i-1] != OpenCurly &&
	// 			method.Functionality[i-1] != ClosedCurly &&
	// 			method.Functionality[i-1] != OpenParenthesis &&
	// 			method.Functionality[i-1] != ClosedParenthesis &&
	// 			method.Functionality[i-1] != OpenBracket &&
	// 			method.Functionality[i-1] != ClosedBracket &&
	// 			method.Functionality[i-1] != LeftArrow &&
	// 			method.Functionality[i-1] != RightArrow &&
	// 			method.Functionality[i-1] != Colon &&
	// 			method.Functionality[i-1] != SemiColon &&
	// 			method.Functionality[i-1] != EqualSign &&
	// 			method.Functionality[i-1] != Slash &&
	// 			method.Functionality[i-1] != Backslash &&
	// 			method.Functionality[i-1] != Asterisk &&
	// 			method.Functionality[i-1] != Comma &&
	// 			method.Functionality[i-1] != AndCondition &&
	// 			method.Functionality[i-1] != OrCondition &&
	// 			method.Functionality[i-1] != ExclamationMark &&
	// 			method.Functionality[i-1] != QuestionMark &&
	// 			method.Functionality[i-1] != PlusSign &&
	// 			method.Functionality[i-1] != Hyphen_MinusSign &&
	// 			method.Functionality[i-1] != Tilde &&
	// 			method.Functionality[i-1] != Percent &&
	// 			method.Functionality[i-1] != Caret &&
	// 			method.Functionality[i-1] != Space {
	// 			continue
	// 		}

	// 		// Iterate over importedTypeNames and see if method.Functionality[i...] matches importedTypeNames[k][i...]
	// 		// If it does match, check if it is a variable name, and if it is add it to currentlyDeclaredVariableNames
	// 		// Otherwise if it is not a variable name, just add it with addToResponseMap(NameHere, dependenciesMap)
	// 		for typeName := range importedTypeNames {
	// 			ok := checkIfTypeNameIsInFunctionality(method.Functionality[i:], []byte(typeName), currentScope)

	// 			if !ok {
	// 				continue
	// 			}

	// 			addToResponseMap([]byte(typeName), dependenciesMap)
	// 			break
	// 		}

	// 	}

	// 	removeVariablesAtAndAboveScope(1)
	// }

	// for key := range associationsMap {
	// 	associations = append(associations, []byte(key))
	// }

	// for key := range dependenciesMap {
	// 	dependencies = append(dependencies, []byte(key))
	// }

	return associations, dependencies
}

func getClassRelationConnections(relations []types.Relation, importedTypeNames map[string]struct{}, class any) []types.Relation {
	var response []types.Relation

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
		for i := 0; i < len(relations); i++ {
			if (bytes.Equal(relations[i].FromClassId, classId1) && bytes.Equal(relations[i].ToClassId, classId2)) ||
				(bytes.Equal(relations[i].FromClassId, classId2) && bytes.Equal(relations[i].ToClassId, classId1)) {
				return &relations[i]
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
		response = append(response, types.Relation{
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

		if c.Extends != nil {
			appendRelation(FromClassId, append([]byte(""), c.Extends...), &types.Generalization{})
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

		if c.Extends != nil {
			appendRelation(FromClassId, append([]byte(""), c.Extends...), &types.Generalization{})
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

		if c.Extends != nil {
			appendRelation(FromClassId, append([]byte(""), c.Extends...), &types.Generalization{})
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

	return response
}
