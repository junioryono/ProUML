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
	Type           CustomByteSlice `json:"type"`
	Name           CustomByteSlice `json:"name"`
	Value          CustomByteSlice `json:"value"`
	AccessModifier CustomByteSlice `json:"accessModifier"` // "public" | "protected" | "private"
	Static         bool            `json:"static"`
	Final          bool            `json:"final"`
}

type JavaMethodParameter struct {
	Type CustomByteSlice `json:"type"`
	Name CustomByteSlice `json:"name"`
}

type JavaMethod struct {
	Type           CustomByteSlice       `json:"type"`
	Name           CustomByteSlice       `json:"name"`
	AccessModifier CustomByteSlice       `json:"accessModifer,omitempty"` // "public" | "protected" | "private"
	Parameters     []JavaMethodParameter `json:"parameters,omitempty"`
	Abstract       bool                  `json:"abstract"` // If abstract is true, Static and Final must be false
	Static         bool                  `json:"static"`
	Final          bool                  `json:"final"`
	Functionality  []byte                `json:"-"`
}

type JavaAbstract struct {
	DefinedWithin CustomByteSlice   `json:"-"`
	Package       CustomByteSlice   `json:"package"`
	Name          CustomByteSlice   `json:"name"`
	Implements    []CustomByteSlice `json:"-"`
	Extends       []CustomByteSlice `json:"-"`
	Variables     []JavaVariable    `json:"variables,omitempty"`
	Methods       []JavaMethod      `json:"methods,omitempty"`
	Associations  []CustomByteSlice `json:"-"`
	Dependencies  []CustomByteSlice `json:"-"`
	JavaDiagramNode
}

type JavaClass struct {
	DefinedWithin CustomByteSlice   `json:"-"`
	Package       CustomByteSlice   `json:"package"`
	Name          CustomByteSlice   `json:"name"`
	Implements    []CustomByteSlice `json:"-"`
	Extends       []CustomByteSlice `json:"-"`
	Variables     []JavaVariable    `json:"variables,omitempty"`
	Methods       []JavaMethod      `json:"methods,omitempty"`
	Associations  []CustomByteSlice `json:"-"`
	Dependencies  []CustomByteSlice `json:"-"`
	JavaDiagramNode
}

type JavaInterface struct {
	DefinedWithin CustomByteSlice   `json:"-"`
	Package       CustomByteSlice   `json:"package"`
	Name          CustomByteSlice   `json:"name"`
	Extends       []CustomByteSlice `json:"-"`
	Variables     []JavaVariable    `json:"variables,omitempty"`
	Methods       []JavaMethod      `json:"methods,omitempty"`
	Associations  []CustomByteSlice `json:"-"`
	Dependencies  []CustomByteSlice `json:"-"`
	JavaDiagramNode
}

type JavaEnum struct {
	DefinedWithin CustomByteSlice   `json:"-"`
	Package       CustomByteSlice   `json:"package"`
	Name          CustomByteSlice   `json:"name"`
	Declarations  []CustomByteSlice `json:"declarations,omitempty"`
	Implements    []CustomByteSlice `json:"-,omitempty"`
	JavaDiagramNode
}

type JavaDiagramNode struct {
	ID     string  `json:"id"`
	Shape  string  `json:"shape"`
	X      float64 `json:"x"`
	Y      float64 `json:"y"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
	Type   string  `json:"type"`
}
