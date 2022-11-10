package types

type ClassText struct {
	DefinedWithin []byte
	Outside       []byte
	Inside        []byte
	Declarations  [][]byte
	Variables     []JavaVariable
	Methods       []JavaMethod
}

type JavaVariable struct {
	Type           []byte
	Name           []byte
	Value          []byte
	AccessModifier []byte // "private" | "protected" | "public"
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
	AccessModifier []byte // "private" | "protected" | "public"
	Parameters     []JavaMethodParameter
	Abstract       bool // If abstract is true, Static and Final must be false
	Static         bool
	Final          bool
}

type JavaAbstract struct {
	DefinedWithin []byte
	Name          []byte
	Implements    [][]byte
	Extends       [][]byte
	Variables     []JavaVariable
	Methods       []JavaMethod
}

type JavaClass struct {
	DefinedWithin []byte
	Name          []byte
	Implements    [][]byte
	Extends       [][]byte
	Variables     []JavaVariable
	Methods       []JavaMethod
}

type JavaInterface struct {
	DefinedWithin []byte
	Name          []byte
	Extends       [][]byte
	Variables     []JavaVariable
	Methods       []JavaMethod
}

type JavaEnum struct {
	DefinedWithin []byte
	Name          []byte
	Declarations  [][]byte
	Implements [][]byte
}
