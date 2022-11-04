package java

import "github.com/junioryono/ProUML/backend/transpiler/types"

func ParseProject(p *types.Project) ([]byte, error) {
	// Parse each file
	var parsedFiles string
	_ = parsedFiles

	for _, file := range p.Files {
		parseFile(&file)
	}

	// Group files by package

	return nil, nil
}
