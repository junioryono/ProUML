package types

type Project struct {
	Nodes []any
	Edges []Relation
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

type Relation struct {
	FromClassId []byte
	ToClassId   []byte
	Type        RelationData
}

type RelationData interface {
	GetFromArrow() bool
	GetToArrow() bool
	SetFromArrow(bool)
	SetToArrow(bool)
}

type Association struct {
	FromArrow bool
	ToArrow   bool
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

type Dependency struct {
	FromArrow bool
	ToArrow   bool
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

type Realization struct {
	FromArrow bool
	ToArrow   bool
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

type Generalization struct {
	FromArrow bool
	ToArrow   bool
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

type NestedOwnership struct {
	FromArrow bool
	ToArrow   bool
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
