package transpiler

import (
	"bytes"
	"errors"
	"math"
	"path/filepath"
	"reflect"
	"strconv"

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

	// Add nodes to diagramContent
	diagramContent = append(diagramContent, project.Nodes...)

	// Add edges to diagramContent

	return diagramContent
}

func generateChatGPTPrompt(nodes []any, edges []types.Relation) string {
	var prompt string

	prompt += "\n\n The nodes are: \n\n"

	for i := 0; i < len(nodes); i++ {
		prompt += "Name: " + string(getNodeClassId(nodes[i])) + "\n"

		switch node := nodes[i].(type) {
		case types.JavaAbstract:
			prompt += "Type: Abstract\n"
			prompt += "Width: " + strconv.Itoa(int(node.Width)) + "\n"
			prompt += "Height: " + strconv.Itoa(int(node.Height)) + "\n"

			for j := 0; j < len(node.Variables); j++ {
				prompt += "Variable: " + string(node.Variables[j].Name) + "\n"
				prompt += "Type: " + string(node.Variables[j].Type) + "\n"
			}

			for j := 0; j < len(node.Methods); j++ {
				prompt += "Method: " + string(node.Methods[j].Name) + "\n"
				prompt += "Type: " + string(node.Methods[j].Type) + "\n"
			}
		case types.JavaClass:
			prompt += "Type: Class\n"
			prompt += "Width: " + strconv.Itoa(int(node.Width)) + "\n"
			prompt += "Height: " + strconv.Itoa(int(node.Height)) + "\n"

			for j := 0; j < len(node.Variables); j++ {
				prompt += "Variable: " + string(node.Variables[j].Name) + "\n"
				prompt += "Type: " + string(node.Variables[j].Type) + "\n"
			}

			for j := 0; j < len(node.Methods); j++ {
				prompt += "Method: " + string(node.Methods[j].Name) + "\n"
				prompt += "Type: " + string(node.Methods[j].Type) + "\n"
			}
		case types.JavaEnum:
			prompt += "Type: Enum\n"
			prompt += "Width: " + strconv.Itoa(int(node.Width)) + "\n"
			prompt += "Height: " + strconv.Itoa(int(node.Height)) + "\n"

			for j := 0; j < len(node.Declarations); j++ {
				prompt += "Declaration: " + string(node.Declarations[j]) + "\n"
			}
		case types.JavaInterface:
			prompt += "Type: Interface\n"
			prompt += "Width: " + strconv.Itoa(int(node.Width)) + "\n"
			prompt += "Height: " + strconv.Itoa(int(node.Height)) + "\n"

			for j := 0; j < len(node.Variables); j++ {
				prompt += "Variable: " + string(node.Variables[j].Name) + "\n"
				prompt += "Type: " + string(node.Variables[j].Type) + "\n"
			}

			for j := 0; j < len(node.Methods); j++ {
				prompt += "Method: " + string(node.Methods[j].Name) + "\n"
				prompt += "Type: " + string(node.Methods[j].Type) + "\n"
			}
		}
	}

	prompt += "\n\n The edges are: \n\n"

	for i := 0; i < len(edges); i++ {
		fromClassId := string(edges[i].FromClassId)
		toClassId := string(edges[i].ToClassId)
		relationType := string(edges[i].Type.GetType())
		prompt += "Class " + fromClassId + " has a " + relationType + " relationship with Class " + toClassId + "\n"
	}

	return prompt
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

func getNodeId(node any) string {
	switch class := node.(type) {
	case types.JavaAbstract:
		return string(class.ID)
	case types.JavaClass:
		return string(class.ID)
	case types.JavaEnum:
		return string(class.ID)
	case types.JavaInterface:
		return string(class.ID)
	}

	return ""
}

func getNodeIndex(nodes []any, nodeClassId []byte) int {
	for i, node := range nodes {
		if bytes.Equal(getNodeClassId(node), nodeClassId) {
			return i
		}
	}

	return -1
}

type Connections struct {
	FromClassIds [][]byte
	ToClassIds   [][]byte
}

// Returns a map nodeIds to their group number
func groupNodes(nodes []any, edges []types.Relation) map[string]int {
	connections := getNodeConnections(nodes, edges)

	// Create a map of nodes to groups
	// The key is the node's class id and the value is the group number
	var (
		nodeGroups   = make(map[string]int) // The key is the node's class id and the value is the group number
		currentGroup = 0
	)

	// Organizes the nodes into groups. Grouping nodes can help you to determine the overall layout of the diagram.
	// Use ToClassIds to group nodes that are connected to each other.
	for i := 0; i < len(nodes); i++ {
		// If the node is already in a group, skip
		if _, ok := nodeGroups[string(getNodeClassId(nodes[i]))]; ok {
			continue
		}

		var (
			// Get the connections of the outer node
			outerNodeConnections = connections[string(getNodeClassId(nodes[i]))]
			foundGroup           = false
		)

		// Iterate through all nodes again
		for j := i + 1; j < len(nodes); j++ {
			if _, ok := nodeGroups[string(getNodeClassId(nodes[j]))]; ok {
				continue
			}

			// Get the connections of the inner node
			var innerNodeConnections = connections[string(getNodeClassId(nodes[j]))]

			// If the connections of the outer node and the inner node are the same, create a group
			if reflect.DeepEqual(outerNodeConnections.ToClassIds, innerNodeConnections.ToClassIds) {
				// Create a new group
				nodeGroups[string(getNodeClassId(nodes[i]))] = currentGroup
				nodeGroups[string(getNodeClassId(nodes[j]))] = currentGroup
				foundGroup = true
			}
		}

		if foundGroup {
			currentGroup++
		}
	}

	// Organizes the nodes into groups. Grouping nodes can help you to determine the overall layout of the diagram.
	// Use FromClassIds to group nodes that are connected to each other. Maybe remove this for loop?
	for i := 0; i < len(nodes); i++ {
		// If the node is already in a group, skip
		if _, ok := nodeGroups[string(getNodeClassId(nodes[i]))]; ok {
			continue
		}

		var (
			// Get the connections of the outer node
			outerNodeConnections = connections[string(getNodeClassId(nodes[i]))]
			foundGroup           = false
		)

		// Iterate through all nodes again
		for j := i + 1; j < len(nodes); j++ {
			if _, ok := nodeGroups[string(getNodeClassId(nodes[j]))]; ok {
				continue
			}

			// Get the connections of the inner node
			var innerNodeConnections = connections[string(getNodeClassId(nodes[j]))]

			// If the connections of the outer node and the inner node are the same, create a group
			if reflect.DeepEqual(outerNodeConnections.FromClassIds, innerNodeConnections.FromClassIds) {
				// Create a new group
				nodeGroups[string(getNodeClassId(nodes[i]))] = currentGroup
				nodeGroups[string(getNodeClassId(nodes[j]))] = currentGroup
				foundGroup = true
			}
		}

		if foundGroup {
			currentGroup++
		}
	}

	var groups = make(map[int][]any)
	for nodeClassId, groupNumber := range nodeGroups {
		groups[groupNumber] = append(groups[groupNumber], nodes[getNodeIndex(nodes, []byte(nodeClassId))])
	}

	// Add the nodes that are not in a group to their own group
	for i := 0; i < len(nodes); i++ {
		if _, ok := nodeGroups[string(getNodeClassId(nodes[i]))]; !ok {
			groups[currentGroup] = append(groups[currentGroup], nodes[i])
			currentGroup++
		}
	}

	return nodeGroups
}

func getNodeConnections(nodes []any, edges []types.Relation) map[string]Connections {
	var connections = make(map[string]Connections)
	for i := 0; i < len(nodes); i++ {
		nodeClassId := getNodeClassId(nodes[i])
		connections[string(nodeClassId)] = Connections{
			FromClassIds: [][]byte{},
			ToClassIds:   [][]byte{},
		}

		for j := 0; j < len(edges); j++ {
			edge := edges[j]
			if bytes.Equal(edge.FromClassId, nodeClassId) {
				connections[string(nodeClassId)] = Connections{
					FromClassIds: connections[string(nodeClassId)].FromClassIds,
					ToClassIds:   append(connections[string(nodeClassId)].ToClassIds, edge.ToClassId),
				}
			} else if bytes.Equal(edge.ToClassId, nodeClassId) {
				connections[string(nodeClassId)] = Connections{
					FromClassIds: append(connections[string(nodeClassId)].FromClassIds, edge.FromClassId),
					ToClassIds:   connections[string(nodeClassId)].ToClassIds,
				}
			}
		}
	}

	return connections
}

func selectPort(sourceX, sourceY, targetX, targetY float64) (sourcePort, targetPort string) {
	xDiff := targetX - sourceX
	yDiff := targetY - sourceY

	if math.Abs(xDiff) > math.Abs(yDiff) {
		if xDiff > 0 {
			sourcePort = "right-middle"
			targetPort = "left-middle"
		} else {
			sourcePort = "left-middle"
			targetPort = "right-middle"
		}
	} else {
		if yDiff > 0 {
			sourcePort = "top-middle"
			targetPort = "bottom-middle"
		} else {
			sourcePort = "bottom-middle"
			targetPort = "top-middle"
		}
	}

	return sourcePort, targetPort
}

func getNodeIndexById(nodes []any, id []byte) int {
	for i, node := range nodes {
		if bytes.Equal(getNodeClassId(node), id) {
			return i
		}
	}
	return -1
}

func getNodePositionX(node any) float64 {
	switch n := node.(type) {
	case types.JavaAbstract:
		return n.Position.X
	case types.JavaClass:
		return n.Position.X
	case types.JavaEnum:
		return n.Position.X
	case types.JavaInterface:
		return n.Position.X
	}
	return 0
}

func getNodePositionY(node any) float64 {
	switch n := node.(type) {
	case types.JavaAbstract:
		return n.Position.Y
	case types.JavaClass:
		return n.Position.Y
	case types.JavaEnum:
		return n.Position.Y
	case types.JavaInterface:
		return n.Position.Y
	}
	return 0
}
