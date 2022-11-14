package types

type Project struct {
	Files []File
}

type ParsedProject struct {
	Packages  []Package
	Relations []Relation
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
	Data    []any // Holds JavaAbstract | JavaClass | JavaInterface | JavaEnum
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
	fromArrow bool
	toArrow   bool
}

func (t Association) GetFromArrow() bool {
	return t.fromArrow
}

func (t Association) GetToArrow() bool {
	return t.toArrow
}

func (t *Association) SetFromArrow(value bool) {
	t.fromArrow = value
}

func (t *Association) SetToArrow(value bool) {
	t.toArrow = value
}

type Aggregation struct {
	fromArrow bool
	toArrow   bool
}

func (t Aggregation) GetFromArrow() bool {
	return t.fromArrow
}

func (t Aggregation) GetToArrow() bool {
	return t.toArrow
}

func (t *Aggregation) SetFromArrow(value bool) {
	t.fromArrow = value
	t.toArrow = !value
}

func (t *Aggregation) SetToArrow(value bool) {
	t.fromArrow = !value
	t.toArrow = value
}

type Composition struct {
	fromArrow bool
	toArrow   bool
}

func (t Composition) GetFromArrow() bool {
	return t.fromArrow
}

func (t Composition) GetToArrow() bool {
	return t.toArrow
}

func (t *Composition) SetFromArrow(value bool) {
	t.fromArrow = value
	t.toArrow = !value
}

func (t *Composition) SetToArrow(value bool) {
	t.fromArrow = !value
	t.toArrow = value
}

type Dependency struct {
	fromArrow bool
	toArrow   bool
}

func (t Dependency) GetFromArrow() bool {
	return t.fromArrow
}

func (t Dependency) GetToArrow() bool {
	return t.toArrow
}

func (t *Dependency) SetFromArrow(value bool) {
	t.fromArrow = value
	t.toArrow = !value
}

func (t *Dependency) SetToArrow(value bool) {
	t.fromArrow = !value
	t.toArrow = value
}

type Realization struct {
	fromArrow bool
	toArrow   bool
}

func (t Realization) GetFromArrow() bool {
	return t.fromArrow
}

func (t Realization) GetToArrow() bool {
	return t.toArrow
}

func (t *Realization) SetFromArrow(value bool) {
	t.fromArrow = value
	t.toArrow = !value
}

func (t *Realization) SetToArrow(value bool) {
	t.fromArrow = !value
	t.toArrow = value
}

type Generalization struct {
	fromArrow bool
	toArrow   bool
}

func (t Generalization) GetFromArrow() bool {
	return t.fromArrow
}

func (t Generalization) GetToArrow() bool {
	return t.toArrow
}

func (t *Generalization) SetFromArrow(value bool) {
	t.fromArrow = value
	t.toArrow = !value
}

func (t *Generalization) SetToArrow(value bool) {
	t.fromArrow = !value
	t.toArrow = value
}
