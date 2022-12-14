package types

type JavaClassText struct {
	DefinedWithin []byte
	Outside       []byte
	Inside        []byte
}

type JavaClassExports struct {
	Package []byte
	Name    []byte
	Exports [][]byte
}

type JavaVariable struct {
	Type           []byte
	Name           []byte
	Value          []byte
	AccessModifier []byte // "public" | "protected" | "private"
	Static         bool
	Final          bool
}

type JavaMethodParameter struct {
	Type []byte
	Name []byte
}

type JavaMethod struct {
	Type           []byte
	Name           []byte
	AccessModifier []byte // "public" | "protected" | "private"
	Parameters     []JavaMethodParameter
	Abstract       bool // If abstract is true, Static and Final must be false
	Static         bool
	Final          bool
	Functionality  []byte
}

type JavaAbstract struct {
	DefinedWithin []byte
	Package       []byte
	Name          []byte
	Implements    [][]byte
	Extends       [][]byte
	Variables     []JavaVariable
	Methods       []JavaMethod
	Associations  [][]byte
	Dependencies  [][]byte
}

type JavaClass struct {
	DefinedWithin []byte
	Package       []byte
	Name          []byte
	Implements    [][]byte
	Extends       [][]byte
	Variables     []JavaVariable
	Methods       []JavaMethod
	Associations  [][]byte
	Dependencies  [][]byte
}

type JavaInterface struct {
	DefinedWithin []byte
	Package       []byte
	Name          []byte
	Extends       [][]byte
	Variables     []JavaVariable
	Methods       []JavaMethod
	Associations  [][]byte
	Dependencies  [][]byte
}

type JavaEnum struct {
	DefinedWithin []byte
	Package       []byte
	Name          []byte
	Declarations  [][]byte
	Implements    [][]byte
}
