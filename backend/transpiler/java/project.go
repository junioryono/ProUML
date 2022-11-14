package java

import "github.com/junioryono/ProUML/backend/transpiler/types"

func ParseProject(p *types.Project) ([]byte, error) {
	// Parse each file
	var parsedFiles []types.FileResponse
	for _, file := range p.Files {
		res, err := parseFile(file)
		if err != nil {
			return nil, err
		}

		parsedFiles = append(parsedFiles, res)
	}

	packages := groupClassesByPackage(parsedFiles)

	for _, pkg := range packages {
		AssociatePackageClasses(pkg)
	}

	return nil, nil
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
