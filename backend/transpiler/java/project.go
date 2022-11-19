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
	type Class struct {
		Package []byte
		Data    any
	}

	// Push all classes into one array
	var classes []Class
	for _, file := range files {
		for _, class := range file.Data {
			classes = append(classes, Class{
				Package: file.Package,
				Data:    class,
			})
		}
	}

	var relations []types.Relation
	for _, classOverview := range classes {
		packageName := classOverview.Package

		switch class := classOverview.Data.(type) {
		case types.JavaAbstract:
		case types.JavaClass:
			FromClassId := append(packageName, class.Name...)
			ToClassId := []byte("")

			// TODO
			// need to use DefinedWithin, Extends, Implements, and Relations

			Relation := &types.Association{}
			Relation.SetFromArrow(true)

			relations = append(relations, types.Relation{
				FromClassId: FromClassId,
				ToClassId:   ToClassId,
				Type:        Relation,
			})
		case types.JavaInterface:
		case types.JavaEnum:
		}

	}

	return relations
}

func getExistingRelationData(classId1, classId2 []byte, relations []types.Relation) *types.RelationData {
	for _, relation := range relations {
		if (bytes.Equal(relation.FromClassId, classId1) && bytes.Equal(relation.ToClassId, classId2)) ||
			bytes.Equal(relation.FromClassId, classId2) && bytes.Equal(relation.ToClassId, classId1) {
			return &relation.Type
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
