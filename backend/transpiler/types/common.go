package types

type Project struct {
	Files []File
}

type ParsedProject struct {
}

type Package struct {
	Files []File
}

type ParsedPackage struct {
}

type File struct {
	Name      string
	Extension string
	Code      []byte
}

type FileResponse struct {
	Package string
	Name    string
	Data    any // Holds JavaAbstract | JavaClass | JavaInterface | JavaEnum
}
