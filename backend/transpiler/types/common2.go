package types

type TestProject struct {
	Name   string
	Input  Project
	Output []byte
	Err    error
}

type TestPackage struct {
	Name   string
	Input  Package
	Output []byte
	Err    error
}

type TestFile struct {
	Name   string
	Input  File
	Output []byte
	Err    error
}
