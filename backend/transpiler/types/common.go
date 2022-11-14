package types

type Project struct {
	Files []File
}

type ParsedProject struct {
}

type Package struct {
	Name  []byte
	Files []FileResponse
}

type ParsedPackage struct {
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
