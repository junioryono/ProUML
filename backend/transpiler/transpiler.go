package transpiler

import (
	"bytes"
	"errors"
	"log"
	"math"
	"math/rand"
	"path/filepath"
	"time"

	"github.com/fogleman/gg"
	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/transpiler/java"
	"github.com/junioryono/ProUML/backend/transpiler/types"
	httpTypes "github.com/junioryono/ProUML/backend/types"
)

var (
	SupportedLanguages   = []string{"java"}
	UnsupportedLanguages = []string{"cpp", "go", "js", "ts", "html", "css", "py", "cs", "php", "swift", "vb"}
)

func Transpile(sdkP *sdk.SDK, files []types.File) ([]any, *httpTypes.WrappedError) {
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
		if file.Name == "" || file.Extension == "" {
			continue
		}

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
	if mostUsedLanguageCount > (len(languagesMap) / 2) {
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

func contains(s []string, e string) string {
	for _, a := range s {
		if a == e {
			return e
		}
	}

	return ""
}

func generateDiagramLayout(project *types.Project) []any {
	var diagramContent []any

	for i := 0; i < len(project.Nodes); i++ {
		switch node := project.Nodes[i].(type) {
		case types.JavaAbstract:
			node.ID = uuid.New().String()
			node.Type = "abstract"
			node.Shape = "custom-class"
			node.Width, node.Height = getNodeSize(node.Name, node.Variables, node.Methods, nil, false)
			project.Nodes[i] = node
		case types.JavaClass:
			node.ID = uuid.New().String()
			node.Type = "class"
			node.Shape = "custom-class"
			node.Width, node.Height = getNodeSize(node.Name, node.Variables, node.Methods, nil, false)
			project.Nodes[i] = node
		case types.JavaEnum:
			node.ID = uuid.New().String()
			node.Type = "enum"
			node.Shape = "custom-class"
			node.Width, node.Height = getNodeSize(node.Name, nil, nil, node.Declarations, true)
			project.Nodes[i] = node
		case types.JavaInterface:
			node.ID = uuid.New().String()
			node.Type = "interface"
			node.Shape = "custom-class"
			node.Width, node.Height = getNodeSize(node.Name, node.Variables, node.Methods, nil, true)
			project.Nodes[i] = node
		}
	}

	// positionNodes(project)

	diagramContent = append(diagramContent, project.Nodes...)
	// diagramContent = append(diagramContent, project.Edges...)

	return diagramContent
}

func positionNodes(project *types.Project) {
	// Initial parameters
	const iterations = 100
	const repulsion = 2000.0
	const attraction = 0.05

	// Forces and positions
	type force struct {
		dx, dy float64
	}
	forces := make([]force, len(project.Nodes))
	positions := make([]force, len(project.Nodes))

	// Initialize random positions
	rand.Seed(time.Now().UnixNano())
	for i := range positions {
		positions[i] = force{
			dx: rand.Float64() * repulsion,
			dy: rand.Float64() * repulsion,
		}
	}

	// Main loop
	for t := 0; t < iterations; t++ {
		// Calculate repulsion forces
		for i := range project.Nodes {
			for j := range project.Nodes {
				if i == j {
					continue
				}
				dx := positions[i].dx - positions[j].dx
				dy := positions[i].dy - positions[j].dy
				distance := math.Sqrt(dx*dx + dy*dy)
				if distance == 0 {
					distance = 0.1
				}
				force := repulsion / (distance * distance)
				forces[i].dx += dx * force / distance
				forces[i].dy += dy * force / distance
			}
		}

		// Calculate attraction forces
		for _, edge := range project.Edges {
			i := getNodeIndex(project.Nodes, edge.FromClassId)
			j := getNodeIndex(project.Nodes, edge.ToClassId)
			if i < 0 || j < 0 {
				continue
			}
			dx := positions[i].dx - positions[j].dx
			dy := positions[i].dy - positions[j].dy
			distance := math.Sqrt(dx*dx + dy*dy)
			force := distance * distance * attraction
			forces[i].dx -= dx * force / distance
			forces[i].dy -= dy * force / distance
			forces[j].dx += dx * force / distance
			forces[j].dy += dy * force / distance
		}

		// Update positions
		for i := range project.Nodes {
			positions[i].dx += forces[i].dx
			positions[i].dy += forces[i].dy
			forces[i].dx = 0
			forces[i].dy = 0
		}
	}

	// Assign positions to nodes
	for i, node := range project.Nodes {
		switch n := node.(type) {
		case types.JavaAbstract:
			n.X, n.Y = positions[i].dx, positions[i].dy
			project.Nodes[i] = n
		case types.JavaClass:
			n.X, n.Y = positions[i].dx, positions[i].dy
			project.Nodes[i] = n
		case types.JavaEnum:
			n.X, n.Y = positions[i].dx, positions[i].dy
			project.Nodes[i] = n
		case types.JavaInterface:
			n.X, n.Y = positions[i].dx, positions[i].dy
			project.Nodes[i] = n
		default:
			log.Printf("Unknown node type: %T", n)
		}
	}
}

func getNodeSize(name []byte, variables []types.JavaVariable, methods []types.JavaMethod, declarations []types.CustomByteSlice, doubleTitle bool) (float64, float64) {
	const fontDivHeight = 20

	var (
		width  float64 = 150 // Minimum width
		height float64 = fontDivHeight + 8
	)

	absPath, _ := filepath.Abs("transpiler/font.ttf")
	ff, err := gg.LoadFontFace(absPath, 12)
	if err != nil {
		absPath, _ := filepath.Abs("../transpiler/font.ttf")
		ff, err = gg.LoadFontFace(absPath, 12)
		if err != nil {
			return 500, 300
		}
	}

	ggContext := gg.NewContext(1, 1)
	ggContext.SetFontFace(ff)
	w, _ := ggContext.MeasureString(string(name))
	if w > width {
		width = w
	}

	if doubleTitle {
		height += 17
	}

	if len(variables) > 0 || len(methods) > 0 {
		height += 1
	}

	if len(variables) > 0 {
		height += 16

		if len(methods) > 0 {
			height += 1
		}
	}

	if len(methods) > 0 {
		height += 16
	}

	// Variables
	for _, variable := range variables {
		variableString := string(variable.AccessModifier) + string(variable.Name) + ": " + string(variable.Type)
		if variable.Value != nil {
			variableString += " = " + string(variable.Value)
		}

		// Measure the width of the variable
		w, _ := ggContext.MeasureString(variableString)
		if w > width {
			width = w
		}

		// Add the height of the variable
		height += fontDivHeight
	}

	// Methods
	for _, method := range methods {
		methodString := string(method.AccessModifier) + string(method.Name) + "("
		for i, parameter := range method.Parameters {
			methodString += string(parameter.Type) + " " + string(parameter.Name)
			if i != len(method.Parameters)-1 {
				methodString += ", "
			}
		}
		methodString += "): " + string(method.Type)

		// Measure the width of the method
		w, _ := ggContext.MeasureString(methodString)
		if w > width {
			width = w
		}

		// Add the height of the method
		height += fontDivHeight
	}

	return width, height
}

func getNodeClassId(node any) []byte {
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
	}

	return nodeClassId
}

func getNodeIndex(nodes []any, nodeClassId []byte) int {
	for i, node := range nodes {
		if bytes.Equal(getNodeClassId(node), nodeClassId) {
			return i
		}
	}

	return -1
}
