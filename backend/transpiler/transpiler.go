package transpiler

import (
	"bytes"
	"errors"
	"fmt"
	"math"
	"path/filepath"
	"reflect"
	"sort"

	"github.com/fogleman/gg"
	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/transpiler/java"
	"github.com/junioryono/ProUML/backend/transpiler/types"
	httpTypes "github.com/junioryono/ProUML/backend/types"
	"github.com/yourbasic/graph"
	"gonum.org/v1/gonum/graph/simple"
	"gonum.org/v1/gonum/graph/topo"
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

func topologicalSort(nodes []any, edges []types.Relation) []any {
	// Group the nodes
	nodeGroups, edgeGroups := groupNodesandEdges(nodes, edges)

	g := simple.NewDirectedGraph()

	for i := 0; i < len(nodeGroups); i++ {
		// Add group to graph
		g.AddNode(simple.Node(i))
	}

	for i := 0; i < len(edgeGroups); i++ {
		// Add edges to graph
		for j := 0; j < len(edgeGroups[i]); j++ {
			g.SetEdge(simple.Edge{F: simple.Node(i), T: simple.Node(edgeGroups[i][j])})
		}
	}

	// Sort the nodes
	sortedNodes, err := topo.Sort(g)
	if err != nil {
		return nil
	}

	// Convert the sorted nodes to the original nodes
	var sortedNodesOriginal []any
	for _, group := range sortedNodes {
		// Get the group number
		groupNumber := group.ID()

		// Sort the nodes in the group by their nodeClassId
		sort.Slice(nodeGroups[groupNumber], func(i, j int) bool {
			return bytes.Compare(getNodeClassId(nodeGroups[groupNumber][i]), getNodeClassId(nodeGroups[groupNumber][j])) == -1
		})

		// Add the nodes in the group to the sorted nodes
		sortedNodesOriginal = append(sortedNodesOriginal, nodeGroups[groupNumber]...)
	}

	// for i := 0; i < len(sortedNodesOriginal); i++ {
	// 	fmt.Printf("Node %d: %s\n", i, getNodeClassId(sortedNodesOriginal[i]))
	// }

	return sortedNodesOriginal
}

type Node struct {
	Depth        int
	Predecessors []*Node
	any
}

func createLayeredGraph(sortedNodes []any, edges []types.Relation) []any {
	// Print all sorted nodes
	for i := 0; i < len(sortedNodes); i++ {
	}

	nodes := make([]Node, len(sortedNodes))
	for i, node := range sortedNodes {
		// fmt.Printf("Node %d: %s\n", i, getNodeClassId(node))
		nodes[i] = Node{
			Depth:        getNodeDepth(sortedNodes, node, edges),
			Predecessors: getNodePredecessors(sortedNodes, node, edges),
			any:          node,
		}
	}

	// // Print all depths
	// for i := 0; i < len(nodes); i++ {
	// 	fmt.Printf("Node %d: %d\n", i, nodes[i].Depth)
	// }

	layers := make([][]*Node, 0)

	for i := 0; i < len(nodes); i++ {
		// Check if the node is in a layer
		if nodes[i].Depth == -1 {
			continue
		}

		// Check if the layer exists
		if len(layers) <= nodes[i].Depth {
			layers = append(layers, make([]*Node, 0))
		}

		// Add the node to the layer
		layers[nodes[i].Depth] = append(layers[nodes[i].Depth], &nodes[i])
	}

	// // Print all layers
	// for i := 0; i < len(layers); i++ {
	// 	fmt.Printf("Layer %d: ", i)
	// 	for j := 0; j < len(layers[i]); j++ {
	// 		fmt.Printf("%s ", getNodeClassId(layers[i][j].any))
	// 	}
	// 	fmt.Println()
	// }

	// Assign y-coordinates to each layer
	for i, layer := range layers {
		var (
			previousLayerEndY float64 = 0
			paddingY          float64 = 50
		)
		if i > 0 {
			previousLayerEndY = paddingY

			for _, node := range layers[i-1] {
				switch class := node.any.(type) {
				case types.JavaAbstract:
					if previousLayerEndY < class.Y+class.Height {
						previousLayerEndY = class.Y + class.Height
					}
				case types.JavaClass:
					if previousLayerEndY < class.Y+class.Height {
						previousLayerEndY = class.Y + class.Height
					}
				case types.JavaEnum:
					if previousLayerEndY < class.Y+class.Height {
						previousLayerEndY = class.Y + class.Height
					}
				case types.JavaInterface:
					if previousLayerEndY < class.Y+class.Height {
						previousLayerEndY = class.Y + class.Height
					}
				}
			}
		}

		for j, node := range layer {
			switch class := (*node).any.(type) {
			case types.JavaAbstract:
				class.Y = previousLayerEndY + paddingY
				layers[i][j].any = class
			case types.JavaClass:
				class.Y = previousLayerEndY + paddingY
				layers[i][j].any = class
			case types.JavaEnum:
				class.Y = previousLayerEndY + paddingY
				layers[i][j].any = class
			case types.JavaInterface:
				class.Y = previousLayerEndY + paddingY
				layers[i][j].any = class
			}
		}
	}

	// Calculate x-coordinates of the nodes in each layer
	for i, layer := range layers {
		var totalWidth float64 = 0
		for _, node := range layer {
			switch class := (*node).any.(type) {
			case types.JavaAbstract:
				totalWidth += class.Width
			case types.JavaClass:
				totalWidth += class.Width
			case types.JavaEnum:
				totalWidth += class.Width
			case types.JavaInterface:
				totalWidth += class.Width
			}
		}

		startX := -totalWidth / 2.0
		for j, node := range layer {
			switch class := (*node).any.(type) {
			case types.JavaAbstract:
				class.X = startX + float64(j)*class.Width
				layers[i][j].any = class
			case types.JavaClass:
				class.X = startX + float64(j)*class.Width
				layers[i][j].any = class
			case types.JavaEnum:
				class.X = startX + float64(j)*class.Width
				layers[i][j].any = class
			case types.JavaInterface:
				class.X = startX + float64(j)*class.Width
				layers[i][j].any = class
			}
		}
	}

	// Set sorted nodes to the new nodes
	for i := 0; i < len(sortedNodes); i++ {
		sortedNodes[i] = nodes[i].any
	}

	// // Print all nodes coordinates
	// for i := 0; i < len(sortedNodes); i++ {
	// 	switch class := sortedNodes[i].(type) {
	// 	case types.JavaAbstract:
	// 		fmt.Printf("Node %d: %s (%f, %f)\n", i, getNodeClassId(sortedNodes[i]), class.X, class.Y)
	// 	case types.JavaClass:
	// 		fmt.Printf("Node %d: %s (%f, %f)\n", i, getNodeClassId(sortedNodes[i]), class.X, class.Y)
	// 	case types.JavaEnum:
	// 		fmt.Printf("Node %d: %s (%f, %f)\n", i, getNodeClassId(sortedNodes[i]), class.X, class.Y)
	// 	case types.JavaInterface:
	// 		fmt.Printf("Node %d: %s (%f, %f)\n", i, getNodeClassId(sortedNodes[i]), class.X, class.Y)
	// 	}
	// }

	return sortedNodes
}

func getNodeDepth(nodes []any, node any, edges []types.Relation) int {
	var (
		nodeClassId     = getNodeClassId(node)
		depth       int = 0
	)

	for _, edge := range edges {
		if !bytes.Equal(edge.ToClassId, nodeClassId) {
			continue
		}

		for _, n := range nodes {
			if !bytes.Equal(getNodeClassId(n), edge.FromClassId) {
				continue
			}

			depth = int(math.Max(float64(depth), float64(getNodeDepth(nodes, n, edges)+1)))
		}
	}

	return depth
}

func getNodePredecessors(nodes []any, node any, edges []types.Relation) []*Node {
	var predecessors []*Node

	for _, edge := range edges {
		if !bytes.Equal(getNodeClassId(node), getNodeClassId(edge.ToClassId)) {
			continue
		}

		for _, n := range nodes {
			if !bytes.Equal(getNodeClassId(n), getNodeClassId(edge.FromClassId)) {
				continue
			}

			predecessors = append(predecessors, &Node{
				Depth:        getNodeDepth(nodes, n, edges),
				Predecessors: getNodePredecessors(nodes, n, edges),
				any:          n,
			})
		}
	}

	return predecessors
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
