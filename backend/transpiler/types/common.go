package types

type CustomByteSlice []byte

func (t CustomByteSlice) MarshalJSON() ([]byte, error) {
	// Make a copy of the slice
	t = append([]byte(nil), t...)

	for i := 0; i < len(t); i++ {
		if t[i] == '"' && (i == 0 || t[i-1] != '\\') {
			// Add an index to the slice and copy the rest of the slice
			t = append(t, 0)
			copy(t[i+1:], t[i:])
			// Add a backslash before the double quote
			t[i] = '\\'

			// Increment i to skip the added backslash
			i++
		}
	}

	return []byte(`"` + string(t) + `"`), nil
}

func (t *CustomByteSlice) UnmarshalJSON(data []byte) error {
	*t = CustomByteSlice(data[1 : len(data)-1])
	return nil
}

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
