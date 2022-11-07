package types

type JavaVariable struct {
	Type           string
	Name           string
	Value          string
	AccessModifier string // "private" | "protected" | "public"
	Static         bool
	Final          bool
}

type JavaMethodParameter struct {
	Type string
	Name string
}

type JavaMethod struct {
	Type           string
	Name           string
	AccessModifier string // "private" | "protected" | "public"
	Parameters     []JavaMethodParameter
	Abstract       bool // If abstract is true, Static and Final must be false
	Static         bool
	Final          bool
}

type JavaAbstract struct {
	Name       string
	Implements [][]byte
	Extends    [][]byte
	Variables  []JavaVariable
	Methods    []JavaMethod
}

type JavaClass struct {
	Name       string
	Implements [][]byte
	Extends    [][]byte
	Variables  []JavaVariable
	Methods    []JavaMethod
}

type JavaInterface struct {
	Name      string
	Extends   [][]byte
	Variables []JavaVariable
	Methods   []JavaMethod
}

type JavaEnum struct {
	Declarations string
}
