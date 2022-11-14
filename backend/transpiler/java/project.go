package java

import (
	"bytes"

	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func ParseProject(p types.Project) (types.ParsedProject, error) {
	var response types.ParsedProject

	// Parse each file
	var parsedFiles []types.FileResponse
	for _, file := range p.Files {
		res, err := parseFile(file)
		if err != nil {
			return response, err
		}

		parsedFiles = append(parsedFiles, res)
	}

	response.Relations = getClassRelations(parsedFiles)
	response.Packages = groupClassesByPackage(parsedFiles)

	return response, nil
}

func getClassRelations(files []types.FileResponse) []types.Relation {
	var relations []types.Relation

	relation := types.Relation{
		FromClass: []byte("Test"),
		ToClass:   []byte("Test2"),
		Type:      &types.Association{},
	}
	_ = relation

	return relations
}

func getExistingRelation(class1, class2 []byte, relations []types.Relation) *types.Relation {
	for _, relation := range relations {
		if (bytes.Equal(relation.FromClass, class1) && bytes.Equal(relation.ToClass, class2)) ||
			bytes.Equal(relation.FromClass, class2) && bytes.Equal(relation.ToClass, class1) {
			return &relation
		}
	}

	return nil
}

func groupClassesByPackage(files []types.FileResponse) []types.Package {
	var (
		packageMap   = make(map[string]types.Package)
		packageSlice []types.Package
	)

	for _, file := range files {
		pkg, ok := packageMap[string(file.Package)]
		if !ok {
			packageMap[string(file.Package)] = types.Package{
				Name:  file.Package,
				Files: []types.FileResponse{file},
			}
			continue
		}

		pkg.Files = append(pkg.Files, file)
	}

	for _, p := range packageMap {
		packageSlice = append(packageSlice, p)
	}

	return packageSlice
}
