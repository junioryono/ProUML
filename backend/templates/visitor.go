package templates

import (
	"encoding/json"
	"fmt"
)

func getVisitor() *[]any {
	// Unmarshal abstract factory
	var objmap []map[string]interface{}
	if err := json.Unmarshal([]byte(visitorString), &objmap); err != nil {
		fmt.Println("err", err)
		return nil
	}

	// Convert to any
	var anyObjmap []any
	for _, obj := range objmap {
		anyObjmap = append(anyObjmap, obj)
	}

	return &anyObjmap
}

const visitorString = `[{"position":{"x":240,"y":160},"size":{"width":192,"height":106},"view":"react-shape-view","shape":"custom-class","zIndex":10,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":96,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":192,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":144,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":26.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":53},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":79.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":192,"y":26.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":192,"y":53},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":192,"y":79.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":96,"y":106},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":106},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":192,"y":106},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":48,"y":106},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":144,"y":106},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"fe582e3d-c647-48cc-a057-ae085ce552f2","type":"interface","methods":[{"name":"method1","type":"String","parameters":[],"accessModifier":"public"},{"name":"method2","type":"String","parameters":[],"accessModifier":"public"}],"package":"default","variables":[],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"Visitor"},{"position":{"x":416,"y":624},"size":{"width":96,"height":32},"view":"react-shape-view","shape":"custom-class","zIndex":10,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":24,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":96,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":24,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":72,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":8},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":16},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":96,"y":8},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":96,"y":16},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":96,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":48,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":96,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":24,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":72,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"f5a7f828-f7f3-48a5-9062-44f1c02a6678","methods":[],"package":"default","variables":[],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"Client"},{"position":{"x":528,"y":448},"size":{"width":192,"height":125},"view":"react-shape-view","shape":"custom-class","zIndex":10,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":96,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":192,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":144,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":31.25},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":62.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":93.75},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":192,"y":31.25},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":192,"y":62.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":192,"y":93.75},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":96,"y":125},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":125},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":192,"y":125},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":48,"y":125},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":144,"y":125},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"0599755e-c589-4100-9764-0bcf3ed44b88","methods":[{"name":"method1","type":"String","parameters":[],"accessModifier":"public"},{"name":"method2","type":"String","parameters":[],"accessModifier":"public"}],"package":"default","variables":[{"name":"variable1","type":"String","static":true,"accessModifier":"private"}],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"ConcreteElementB"},{"position":{"x":528,"y":288},"size":{"width":192,"height":125},"view":"react-shape-view","shape":"custom-class","zIndex":10,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":96,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":192,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":144,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":31.25},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":62.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":93.75},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":192,"y":31.25},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":192,"y":62.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":192,"y":93.75},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":96,"y":125},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":125},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":192,"y":125},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":48,"y":125},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":144,"y":125},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"2a7931af-4d79-4d8e-89de-c0dbf94c4822","methods":[{"name":"method1","type":"String","parameters":[],"accessModifier":"public"},{"name":"method2","type":"String","parameters":[],"accessModifier":"public"}],"package":"default","variables":[{"name":"variable1","type":"String","static":true,"accessModifier":"private"}],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"ConcreteElementA"},{"position":{"x":240,"y":368},"size":{"width":192,"height":125},"view":"react-shape-view","shape":"custom-class","zIndex":10,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":96,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":192,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":144,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":31.25},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":62.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":93.75},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":192,"y":31.25},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":192,"y":62.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":192,"y":93.75},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":96,"y":125},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":125},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":192,"y":125},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":48,"y":125},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":144,"y":125},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"51685ad7-a997-4005-9c9e-d8a315a35d28","methods":[{"name":"method1","type":"String","parameters":[],"accessModifier":"public"},{"name":"method2","type":"String","parameters":[],"accessModifier":"public"}],"package":"default","variables":[{"name":"variable1","type":"String","static":true,"accessModifier":"private"}],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"ConcreteVisitors"},{"position":{"x":608,"y":144},"size":{"width":192,"height":86},"view":"react-shape-view","shape":"custom-class","zIndex":10,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":96,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":192,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":144,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":21.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":43},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":64.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":192,"y":21.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":192,"y":43},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":192,"y":64.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":96,"y":86},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":86},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":192,"y":86},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":48,"y":86},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":144,"y":86},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"6fe78269-57e2-4932-b806-35e77928bc3f","type":"interface","methods":[{"name":"method1","type":"String","parameters":[],"accessModifier":"public"}],"package":"default","variables":[],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"Element"},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 20 0 L 0 10 L 20 20 z","fill":"white","name":"path","offsetX":-10},"strokeDasharray":"3,3"}},"edgeType":"realization","id":"c36a1d60-76b6-4e25-9c83-1c57cde13492","zIndex":11,"source":{"cell":"6fe78269-57e2-4932-b806-35e77928bc3f","port":"left-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"fe582e3d-c647-48cc-a057-ae085ce552f2","port":"right-middle-top","connectionPoint":{"args":{"offset":0},"name":"anchor"}}},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 20 0 L 0 10 L 20 20 z","fill":"white","name":"path","offsetX":-10},"strokeDasharray":"3,3"}},"edgeType":"realization","id":"c4d12d21-b559-434d-8f89-9e72b2234240","zIndex":12,"source":{"cell":"51685ad7-a997-4005-9c9e-d8a315a35d28","port":"top-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"fe582e3d-c647-48cc-a057-ae085ce552f2","port":"bottom-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}}},{"shape":"edge","edgeType":"classic","id":"eb15291b-f6c8-42ec-be73-940aa66d9b1d","zIndex":13,"source":{"cell":"fe582e3d-c647-48cc-a057-ae085ce552f2","port":"right-middle-bottom","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"2a7931af-4d79-4d8e-89de-c0dbf94c4822","port":"left-middle","connectionPoint":{"args":{"offset":-2},"name":"anchor"}},"vertices":[{"x":464,"y":239.5},{"x":464,"y":350.5}]},{"shape":"edge","edgeType":"classic","id":"968bd759-76e6-4a12-9dd0-e8185e74f08a","zIndex":14,"source":{"cell":"fe582e3d-c647-48cc-a057-ae085ce552f2","port":"right-middle-bottom"},"target":{"cell":"0599755e-c589-4100-9764-0bcf3ed44b88","port":"left-middle","connectionPoint":{"args":{"offset":-2},"name":"anchor"}},"vertices":[{"x":464,"y":239.5},{"x":464,"y":510.5}]},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 20 0 L 0 10 L 20 20 z","fill":"white","name":"path","offsetX":-10},"strokeDasharray":"3,3"}},"edgeType":"realization","id":"d538799e-bf3f-4c73-961e-b41162017030","zIndex":15,"source":{"cell":"2a7931af-4d79-4d8e-89de-c0dbf94c4822","port":"right-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"6fe78269-57e2-4932-b806-35e77928bc3f","port":"bottom-right-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"vertices":[{"x":752,"y":350.5}]},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 20 0 L 0 10 L 20 20 z","fill":"white","name":"path","offsetX":-10},"strokeDasharray":"3,3"}},"edgeType":"realization","id":"e63040b9-08c2-4521-91dd-de29169797e3","zIndex":16,"source":{"cell":"0599755e-c589-4100-9764-0bcf3ed44b88","port":"right-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"6fe78269-57e2-4932-b806-35e77928bc3f","port":"bottom-right-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"vertices":[{"x":752,"y":510.5}]},{"shape":"edge","edgeType":"classic","id":"30517adb-804b-42af-b00f-c76272c49731","zIndex":17,"source":{"cell":"f5a7f828-f7f3-48a5-9062-44f1c02a6678","port":"left-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"51685ad7-a997-4005-9c9e-d8a315a35d28","port":"left-middle-top","connectionPoint":{"args":{"offset":-2},"name":"anchor"}},"vertices":[{"x":160,"y":640},{"x":160,"y":399.25}]},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 20 0 L 0 10 L 20 20 z","fill":"white","name":"path","offsetX":-10},"strokeDasharray":"3,3"}},"edgeType":"realization","id":"5403495a-bbc3-4576-82e1-2bc66e7e9a6a","zIndex":18,"source":{"cell":"f5a7f828-f7f3-48a5-9062-44f1c02a6678","port":"right-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"6fe78269-57e2-4932-b806-35e77928bc3f","port":"right-middle-top","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"vertices":[{"x":832,"y":640},{"x":832,"y":165.5}]}]`
