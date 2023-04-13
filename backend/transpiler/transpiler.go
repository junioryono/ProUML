package transpiler

import (
	"bytes"
	"errors"
	"fmt"
	"path/filepath"
	"reflect"

	"github.com/fogleman/gg"
	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/transpiler/java"
	"github.com/junioryono/ProUML/backend/transpiler/types"
	httpTypes "github.com/junioryono/ProUML/backend/types"
	"github.com/yourbasic/graph"
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

	nodeGroups, edgeGroups := groupNodesandEdges(project.Nodes, project.Edges)

	err := setNodeCoordinates(project.Nodes, nodeGroups, project.Edges, edgeGroups)
	if err != nil {
		fmt.Println(err)
		return nil
	}

	// Add nodes to diagramContent
	diagramContent = append(diagramContent, project.Nodes...)

	// Add connections to diagramContent

	return diagramContent
}

func setNodeCoordinates(nodes []any, nodeGroups [][]any, edges []types.Relation, edgeGroups [][]int) error {
	//loop through the nodes and print their id
	for i := 0; i < len(nodes); i++ {
		fmt.Printf("ID: %s\n", string(getNodeClassId(nodes[i])))
	}

	// Create a directed graph with your nodes.
	g := graph.New(len(nodeGroups))
	for i := 0; i < len(edgeGroups); i++ {
		for j := 0; j < len(edgeGroups[i]); j++ {
			g.Add(i, edgeGroups[i][j])
		}
	}

	// Perform a topological sort on the graph.
	groupOrdered, ok := graph.TopSort(g)
	if !ok {
		fmt.Println("A cycle exists in the graph.")
		return errors.New("a cycle exists in the graph")
	}

	var (
		layers [][]any
		layer  int = 0
	)
	for _, i := range groupOrdered {
		// iterate through the nodes in the group and add them to the ordered array at the current layer
		for j := 0; j < len(nodeGroups[i]); j++ {
			if len(layers) <= layer {
				layers = append(layers, []any{})
			}
			layers[layer] = append(layers[layer], nodeGroups[i][j])
		}

		if g.Degree(i) > 0 {
			layer++
		}
	}

	// Calculate the x and y coordinates for each node.
	var (
		previousLayerEndY float64 = 0
		paddingY          float64 = 50
		paddingX          float64 = 50
	)

	for i := 0; i < len(layers); i++ {
		var totalWidth float64 = 0
		var highestHeight float64 = 0
		var currentX float64 = 0

		// Loop through the nodes in the layer
		for j := 0; j < len(layers[i]); j++ {
			node := layers[i][j]

			switch class := node.(type) {
			case types.JavaAbstract:
				class.Y = previousLayerEndY

				class.X = currentX
				currentX += float64(class.Width) + paddingX

				nodes[getNodeIndex(nodes, getNodeClassId(node))] = class

				totalWidth += float64(class.Width)
				if class.Height > highestHeight {
					highestHeight = class.Height
				}
			case types.JavaClass:
				class.Y = previousLayerEndY

				class.X = currentX
				currentX += float64(class.Width) + paddingX

				nodes[getNodeIndex(nodes, getNodeClassId(node))] = class

				totalWidth += float64(class.Width)
				if class.Height > highestHeight {
					highestHeight = class.Height
				}
			case types.JavaEnum:
				class.Y = previousLayerEndY

				class.X = currentX
				currentX += float64(class.Width) + paddingX

				nodes[getNodeIndex(nodes, getNodeClassId(node))] = class

				totalWidth += float64(class.Width)
				if class.Height > highestHeight {
					highestHeight = class.Height
				}
			case types.JavaInterface:
				class.Y = previousLayerEndY

				class.X = currentX
				currentX += float64(class.Width) + paddingX

				nodes[getNodeIndex(nodes, getNodeClassId(node))] = class

				totalWidth += float64(class.Width)
				if class.Height > highestHeight {
					highestHeight = class.Height
				}
			}
		}

		fmt.Printf("Layer %d: totalWidth: %f, highestHeight: %f, previousLayerEndY: %f\n", i, totalWidth, highestHeight, previousLayerEndY)
		previousLayerEndY += highestHeight + paddingY
	}

	return nil
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

type Connections struct {
	FromClassIds [][]byte
	ToClassIds   [][]byte
}

// Returns a 2D array of nodes grouped by their connections and a 2D array of the connections that correspond to the groups
func groupNodesandEdges(nodes []any, edges []types.Relation) ([][]any, [][]int) {
	connections := getNodeConnections(nodes, edges)

	// Create a map of nodes to groups
	// The key is the node's class id and the value is the group number
	var (
		nodeGroups   = make(map[string]int) // The key is the node's class id and the value is the group number
		edgeGroups   [][]int                // The index is the group number and the values are the indexes of the groups that the group is connected to
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

	// Convert the map of groups to nodes to a list of groups
	var returnGroups = make([][]any, len(groups))
	for i := 0; i < len(groups); i++ {
		returnGroups[i] = groups[i]

		// Create a list of the groups that the group is connected to
		var connectedGroups []int
		for j := 0; j < len(groups); j++ {
			if i == j {
				continue
			}

			for k := 0; k < len(groups[i]); k++ {
				for l := 0; l < len(groups[j]); l++ {
					for m := 0; m < len(edges); m++ {
						if bytes.Equal(getNodeClassId(groups[i][k]), edges[m].FromClassId) && bytes.Equal(getNodeClassId(groups[j][l]), edges[m].ToClassId) {
							// Need to check if the group is already in the list
							exists := false
							for n := 0; n < len(connectedGroups); n++ {
								if connectedGroups[n] == j {
									exists = true
									break
								}
							}

							if exists {
								continue
							}

							connectedGroups = append(connectedGroups, j)
						}
					}
				}
			}
		}

		edgeGroups = append(edgeGroups, connectedGroups)
	}

	return returnGroups, edgeGroups
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
