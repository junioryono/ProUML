package java

import (
	"context"
	"fmt"
	"strings"

	"github.com/junioryono/ProUML/backend/transpiler/types"
	sitter "github.com/smacker/go-tree-sitter"
	"github.com/smacker/go-tree-sitter/java"
)

func parseFile(file types.File) types.FileResponse {
	var response = types.FileResponse{}

	parser := sitter.NewParser()
	parser.SetLanguage(java.GetLanguage())

	tree, err := parser.ParseCtx(context.Background(), nil, file.Code)
	if err != nil {
		return response
	}

	rootNode := tree.RootNode()

	response.Package = getPackageDeclaration(rootNode, file.Code)
	response.Imports = getPackageImports(rootNode, file.Code)
	response.Data = getFileClasses(rootNode, file.Code, response.Package)

	// Print all class names
	for _, class := range response.Data {
		switch e := class.(type) {
		case types.JavaClass:
			fmt.Println("Class:", string(e.Name))
		case types.JavaInterface:
			fmt.Println("Interface:", string(e.Name))
		case types.JavaEnum:
			fmt.Println("Enum:", string(e.Name))
		}
	}

	return response
}

func getPackageDeclaration(node *sitter.Node, code []byte) []byte {
	for i := 0; i < int(node.ChildCount()); i++ {
		child := node.Child(i)
		childType := child.Type()

		if childType == "package_declaration" {
			return code[child.Child(1).StartByte() : child.EndByte()-1]
		}
	}

	return []byte("default")
}

func getPackageImports(node *sitter.Node, code []byte) [][]byte {
	var imports = make([][]byte, 0)

	for i := 0; i < int(node.ChildCount()); i++ {
		child := node.Child(i)
		childType := child.Type()

		if childType == "import_declaration" {
			imports = append(imports, code[child.Child(1).StartByte():child.EndByte()-1])
		} else if len(imports) > 0 {
			return imports
		}
	}

	return imports
}

func getFileClasses(node *sitter.Node, code, packageName []byte) []any {
	var classesStruct = make([]any, 0)

	for i := 0; i < int(node.ChildCount()); i++ {
		child := node.Child(i)
		childType := child.Type()

		if isClassDeclaration(childType) {
			classesStruct = append(classesStruct, parseClasses(child, code, nil, packageName)...)
		}
	}

	return classesStruct
}

// Parsing class HEREEE: superclass
// Parsing class HEREEE: name
// Parsing class HEREEE: interfaces
// Parsing class HEREEE: body

func parseClasses(node *sitter.Node, code, definedWithinClassName, packageName []byte) []any {
	var classesStruct = make([]any, 0)

	// fmt.Println("Parsing class HEREEE:", code[node.ChildByFieldName("name").StartByte():node.ChildByFieldName("name").EndByte()])

	var className []byte
	var extends []byte
	var implements []types.CustomByteSlice
	for i := 0; i < int(node.ChildCount()); i++ {
		child := node.Child(i)
		childType := child.Type()
		// fmt.Println("Parsing class HEREEE:", node.FieldNameForChild(i))

		if childType == "identifier" {
			className = code[child.StartByte():child.EndByte()]
		} else if childType == "superclass" {
			extends = code[child.Child(1).StartByte():child.Child(1).EndByte()]
		} else if childType == "super_interfaces" {
			implements = append(implements, parseClassImplements(child, code)...)
		} else if childType == "extends_interfaces" {
			// for j := 0; j < int(child.ChildCount()); j++ {
			// 	implements = append(implements, code[child.Child(j).Child(1).StartByte():child.Child(j).Child(1).EndByte()])
			// }
		} else if childType == "class_body" || childType == "interface_body" {
			classesStruct = append(classesStruct, parseClassBody(child, code, definedWithinClassName, packageName, className, extends, implements)...)
		}
	}

	return classesStruct
}

func parseClassImplements(node *sitter.Node, code []byte) []types.CustomByteSlice {
	var implements []types.CustomByteSlice

	var inner = node.Child(1)
	for i := 0; i < int(inner.ChildCount()); i++ {
		child := inner.Child(i)
		childType := child.Type()

		if isTypeIdentifier(childType) {
			implements = append(implements, code[child.StartByte():child.EndByte()])
		}
	}

	return implements
}

func parseClassBody(node *sitter.Node, code, definedWithinClassName, packageName, className, extends []byte, implements []types.CustomByteSlice) []any {
	var classesStruct = make([]any, 0)

	var Variables = make([]types.JavaVariable, 0)
	var Methods = make([]types.JavaMethod, 0)
	for j := 0; j < int(node.ChildCount()); j++ {
		child := node.Child(j)
		childType := child.Type()

		if childType == "field_declaration" {
			Variables = append(Variables, parseVariable(child, code)...)
		} else if childType == "method_declaration" {
			Methods = append(Methods, parseMethod(child, code))
		} else if isClassDeclaration(childType) {
			classesStruct = append(classesStruct, parseClasses(child, code, className, packageName)...)
		}
	}

	if node.Type() == "class_body" {
		classesStruct = append(classesStruct, types.JavaClass{
			DefinedWithin: definedWithinClassName,
			Package:       packageName,
			Name:          className,
			Extends:       extends,
			Implements:    implements,
			Variables:     Variables,
			Methods:       Methods,
		})
	} else if node.Type() == "interface_body" {
		classesStruct = append(classesStruct, types.JavaInterface{
			DefinedWithin: definedWithinClassName,
			Package:       packageName,
			Name:          className,
			Extends:       extends,
			Variables:     Variables,
			Methods:       Methods,
		})
	}

	return classesStruct
}

func parseVariable(node *sitter.Node, code []byte) []types.JavaVariable {
	var Variables = make([]types.JavaVariable, 0)

	var variableName []byte
	var variableType []byte
	for i := 0; i < int(node.ChildCount()); i++ {
		child := node.Child(i)
		childType := child.Type()

		fmt.Println("Variable child type:", childType)
		if childType == "modifiers" {
			// modifiers := strings.Split(string(code[child.StartByte():child.EndByte()]), " ")
			// for _, modifier := range modifiers {
			// 	if modifier == "public" || modifier == "private" || modifier == "protected" {
			// 		method.AccessModifier = []byte(modifier)
			// 	} else if modifier == "static" {
			// 		method.Static = true
			// 	} else if modifier == "final" {
			// 		method.Final = true
			// 	}
			// }
		} else if isTypeIdentifier(childType) {
			variableType = code[child.StartByte():child.EndByte()]
			fmt.Println("Variable type:", string(variableType))
		} else if childType == "variable_declarator" {
			variableName = code[child.Child(0).StartByte():child.Child(0).EndByte()]
			fmt.Println("Variable name:", string(variableName))
		}
	}

	Variables = append(Variables, types.JavaVariable{
		Name: variableName,
		Type: variableType,
	})

	return Variables
}

func parseMethod(node *sitter.Node, code []byte) types.JavaMethod {
	var method = types.JavaMethod{}

	var methodName []byte
	var methodType []byte
	for i := 0; i < int(node.ChildCount()); i++ {
		child := node.Child(i)
		childType := child.Type()

		if childType == "modifiers" {
			modifiers := strings.Split(string(code[child.StartByte():child.EndByte()]), " ")
			for _, modifier := range modifiers {
				if modifier == "public" || modifier == "private" || modifier == "protected" {
					method.AccessModifier = []byte(modifier)
				} else if modifier == "static" {
					method.Static = true
				} else if modifier == "final" {
					method.Final = true
				}
			}
		} else if childType == "identifier" {
			methodName = code[child.StartByte():child.EndByte()]
		} else if isTypeIdentifier(childType) {
			methodType = []byte(child.String())
		} else if childType == "void_type" {
			methodType = []byte("void")
		} else if childType == "formal_parameters" {
			method.Parameters = parseMethodParameters(child, code)
		} else if childType == "block" {
			// method.Body = code[child.StartByte():child.EndByte()]
		}
	}

	method.Name = methodName
	method.Type = methodType

	return method
}

func parseMethodParameters(node *sitter.Node, code []byte) []types.JavaMethodParameter {
	var Parameters = make([]types.JavaMethodParameter, 0)

	for i := 0; i < int(node.ChildCount()); i++ {
		child := node.Child(i)
		childType := child.Type()

		if childType == "formal_parameter" {
			Parameters = append(Parameters, parseMethodParameter(child, code))
		}
	}

	return Parameters
}

func parseMethodParameter(node *sitter.Node, code []byte) types.JavaMethodParameter {
	var parameter = types.JavaMethodParameter{}

	var parameterName []byte
	var parameterType []byte
	for i := 0; i < int(node.ChildCount()); i++ {
		child := node.Child(i)
		childType := child.Type()

		if isTypeIdentifier(childType) {
			parameterType = code[child.StartByte():child.EndByte()]
		} else if childType == "identifier" {
			parameterName = code[child.StartByte():child.EndByte()]
		}
	}

	parameter.Name = parameterName
	parameter.Type = parameterType

	return parameter
}

func isClassDeclaration(childType string) bool {
	return childType == "class_declaration" ||
		childType == "interface_declaration" ||
		childType == "enum_declaration"
}

func isTypeIdentifier(childType string) bool {
	return childType == "type_identifier" ||
		childType == "scoped_type_identifier" ||
		childType == "primitive_type" ||
		childType == "array_type"
}
