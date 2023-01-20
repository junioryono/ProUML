package transpiler

import (
	"bytes"
	"errors"
	"fmt"

	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/transpiler/java"
	"github.com/junioryono/ProUML/backend/transpiler/types"
	httpTypes "github.com/junioryono/ProUML/backend/types"
)

var (
	SupportedLanguages   = []string{"java"}
	UnsupportedLanguages = []string{"cpp", "go", "js", "ts", "html", "css", "py", "cs", "php", "swift", "vb"}
)

func Transpile(sdkP *sdk.SDK, files []types.File) (*[]any, *httpTypes.WrappedError) {
	language, err := getProjectLanguage(files)
	if err != nil {
		return nil, err
	}

	// Remove files that are not supported
	for i := 0; i < len(files); i++ {
		if files[i].Extension != language {
			files = append(files[:i], files[i+1:]...)
			i--
		}
	}

	parsedProject, err := parseProjectByLanguage(language, files)
	if err != nil {
		return nil, err
	}

	diagramLayout := generateDiagramLayout(parsedProject)

	return diagramLayout, nil
}

func getProjectLanguage(files []types.File) (string, *httpTypes.WrappedError) {
	var language string

	// Iterate through files to find the language
	// Use a map to store the languages found and how many times they were found
	languagesMap := make(map[string]int)

	for _, file := range files {
		// Increment language count
		languagesMap[file.Extension]++
	}

	// Iterate through languagesMap and find the language that is used the most
	var mostUsedLanguage string
	var mostUsedLanguageCount int

	for key, value := range languagesMap {
		if value > mostUsedLanguageCount {
			mostUsedLanguage = key
			mostUsedLanguageCount = value
		}
	}

	// If the language that is used the most is used more than 50% of the time, return that language
	if mostUsedLanguageCount > (len(files) / 2) {
		language = mostUsedLanguage
		return language, nil
	}

	// If the language that is used the most is not used more than 50% of the time, return an error
	return "", httpTypes.Wrap(errors.New("could not figure out which language was used"), httpTypes.ErrCouldNotFigureOutLang)

}

func parseProjectByLanguage(language string, files []types.File) (*types.Project, *httpTypes.WrappedError) {
	// Call transpilation of specified language
	switch language {
	case "java":
		return java.ParseProject(files), nil
	case contains(UnsupportedLanguages, language):
		// Covers C++, Go, JavaScript, TypeScript, HTML, CSS, Python , C#, PHP, Swift, Visual Basic
		return nil, httpTypes.Wrap(errors.New("this is an unsupported language"), httpTypes.ErrUnsupportedLang)
	default:
		return nil, httpTypes.Wrap(errors.New("could not figure out which language was used"), httpTypes.ErrCouldNotFigureOutLang)
	}
}

func generateDiagramLayout(project *types.Project) *[]any {
	var diagramContent *[]any

	type Connections struct {
		ClassId  []byte
		CameFrom []types.Relation
		GoingTo  []types.Relation
	}

	// Create a slice of Connections
	var classIdConnections []Connections

	// Loop over all nodes
	for _, node := range project.Nodes {
		// Get the node's classId
		var nodeClassId []byte
		switch class := node.(type) {
		case types.JavaAbstract:
			nodeClassId = append(nodeClassId, class.Package...)
			nodeClassId = append(nodeClassId, byte('.'))
			nodeClassId = append(nodeClassId, class.Name...)
		case types.JavaClass:
			nodeClassId = append(nodeClassId, class.Package...)
			nodeClassId = append(nodeClassId, byte('.'))
			nodeClassId = append(nodeClassId, class.Name...)
		case types.JavaEnum:
			nodeClassId = append(nodeClassId, class.Package...)
			nodeClassId = append(nodeClassId, byte('.'))
			nodeClassId = append(nodeClassId, class.Name...)
		case types.JavaInterface:
			nodeClassId = append(nodeClassId, class.Package...)
			nodeClassId = append(nodeClassId, byte('.'))
			nodeClassId = append(nodeClassId, class.Name...)
		default:
			continue
		}

		// Get all the edges that have the node as the FromClassId
		var fromEdges []types.Relation
		var toEdges []types.Relation
		for _, edge := range project.Edges {
			if bytes.Equal(edge.FromClassId, nodeClassId) {
				fromEdges = append(fromEdges, edge)
			} else if bytes.Equal(edge.ToClassId, nodeClassId) {
				toEdges = append(toEdges, edge)
			}
		}

		// Add the node's classId and the edges to the map
		classIdConnections = append(classIdConnections, Connections{
			ClassId:  nodeClassId,
			CameFrom: fromEdges,
			GoingTo:  toEdges,
		})
	}

	// Print all classIdConnections
	for _, connection := range classIdConnections {
		fmt.Println("ClassId:", string(connection.ClassId))
		fmt.Println("CameFrom:")
		for _, edge := range connection.CameFrom {
			fmt.Println("  ToClassId:", string(edge.ToClassId))
		}
		fmt.Println("GoingTo:")
		for _, edge := range connection.GoingTo {
			fmt.Println("  ToClassId:", string(edge.FromClassId))
		}
		fmt.Println()
	}

	return diagramContent
}

func contains(s []string, e string) string {
	for _, a := range s {
		if a == e {
			return e
		}
	}

	return ""
}
