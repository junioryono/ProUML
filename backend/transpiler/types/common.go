package types

type CustomByteSlice []byte

type Project struct {
	Nodes []any      `json:"nodes,omitempty"`
	Edges []Relation `json:"edges,omitempty"`
}

type Package struct {
	Name  []byte
	Files []FileResponse
}

type File struct {
	Name      string
	Extension string
	Code      []byte
}

type FileResponse struct {
	Package []byte
	Imports [][]byte
	Data    []any // Holds [](JavaAbstract | JavaClass | JavaInterface | JavaEnum)
}

type Node struct {
	Type []byte
	Data any // Holds JavaAbstract | JavaClass | JavaInterface | JavaEnum
}

type Edge struct {
	EdgeType string             `json:"edgeType"`
	ID       string             `json:"id"`
	Shape    string             `json:"shape"`
	Source   EdgeNodeConnection `json:"source"`
	Target   EdgeNodeConnection `json:"target"`
}

type EdgeNodeConnection struct {
	CellId          string              `json:"cell"`
	ConnectionPoint EdgeConnectionPoint `json:"connectionPoint"`
	Port            string              `json:"port"`
}

type EdgeConnectionPoint struct {
	Args EdgeConnectionPointArgs `json:"args"`
	Name string                  `json:"name"`
}

type EdgeConnectionPointArgs struct {
	Offset float64 `json:"offset"`
}

type Relation struct {
	FromClassId CustomByteSlice `json:"fromClassId"`
	ToClassId   CustomByteSlice `json:"toClassId"`
	Type        RelationData    `json:"type"`
}

type RelationData interface {
	GetFromArrow() bool
	GetToArrow() bool
	SetFromArrow(bool)
	SetToArrow(bool)
	GetType() string
}

type Association struct {
	FromArrow bool `json:"fromArrow"`
	ToArrow   bool `json:"toArrow"`
}

func (t Association) GetFromArrow() bool {
	return t.FromArrow
}

func (t Association) GetToArrow() bool {
	if !t.FromArrow {
		return true
	}

	return t.ToArrow
}

func (t *Association) SetFromArrow(value bool) {
	t.FromArrow = value
}

func (t *Association) SetToArrow(value bool) {
	t.ToArrow = value
}

func (t Association) GetType() string {
	return "association"
}

type Dependency struct {
	FromArrow bool `json:"fromArrow"`
	ToArrow   bool `json:"toArrow"`
}

func (t Dependency) GetFromArrow() bool {
	return t.FromArrow
}

func (t Dependency) GetToArrow() bool {
	if !t.FromArrow {
		return true
	}

	return t.ToArrow
}

func (t *Dependency) SetFromArrow(value bool) {
	t.FromArrow = value
}

func (t *Dependency) SetToArrow(value bool) {
	t.ToArrow = value
}

func (t Dependency) GetType() string {
	return "dependency"
}

type Realization struct {
	FromArrow bool `json:"fromArrow"`
	ToArrow   bool `json:"toArrow"`
}

func (t Realization) GetFromArrow() bool {
	return t.FromArrow
}

func (t Realization) GetToArrow() bool {
	if !t.FromArrow {
		return true
	}

	return t.ToArrow
}

func (t *Realization) SetFromArrow(value bool) {
	t.FromArrow = value
	t.ToArrow = !value
}

func (t *Realization) SetToArrow(value bool) {
	t.FromArrow = !value
	t.ToArrow = value
}

func (t Realization) GetType() string {
	return "realization"
}

type Generalization struct {
	FromArrow bool `json:"fromArrow"`
	ToArrow   bool `json:"toArrow"`
}

func (t Generalization) GetFromArrow() bool {
	return t.FromArrow
}

func (t Generalization) GetToArrow() bool {
	if !t.FromArrow {
		return true
	}

	return t.ToArrow
}

func (t *Generalization) SetFromArrow(value bool) {
	t.FromArrow = value
	t.ToArrow = !value
}

func (t *Generalization) SetToArrow(value bool) {
	t.FromArrow = !value
	t.ToArrow = value
}

func (t Generalization) GetType() string {
	return "generalization"
}

type NestedOwnership struct {
	FromArrow bool `json:"fromArrow"`
	ToArrow   bool `json:"toArrow"`
}

func (t NestedOwnership) GetFromArrow() bool {
	return t.FromArrow
}

func (t NestedOwnership) GetToArrow() bool {
	if !t.FromArrow {
		return true
	}

	return t.ToArrow
}

func (t *NestedOwnership) SetFromArrow(value bool) {
	t.FromArrow = value
	t.ToArrow = !value
}

func (t *NestedOwnership) SetToArrow(value bool) {
	t.FromArrow = !value
	t.ToArrow = value
}

func (t NestedOwnership) GetType() string {
	return "nestedOwnership"
}
