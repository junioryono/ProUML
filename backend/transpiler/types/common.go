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
	Code      string
}

type ParsedFileData struct {
	OriginalFile *File
	ClassName    string
	Variables    string
	Methods      string
}

// type ProjectJSON struct {
// }
