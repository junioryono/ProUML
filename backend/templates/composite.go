package templates

import (
	"encoding/json"
	"fmt"
)

func getComposite() *[]any {
	// Unmarshal abstract factory
	var objmap []map[string]interface{}
	if err := json.Unmarshal([]byte(compositeString), &objmap); err != nil {
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

const compositeString = `[{"position":{"x":80,"y":144},"size":{"width":285,"height":86},"view":"react-shape-view","shape":"custom-class","zIndex":10,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":142.5,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":71.25,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":285,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":71.25,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":213.75,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":21.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":43},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":64.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":285,"y":21.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":285,"y":43},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":285,"y":64.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":142.5,"y":86},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":86},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":285,"y":86},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":71.25,"y":86},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":213.75,"y":86},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"0a8c6fff-0806-48d0-8ed8-c67f0371e0f1","type":"interface","methods":[{"name":"method1","type":"void","static":true,"parameters":[{"name":"param1","type":"String"},{"name":"param2","type":"String"}],"accessModifier":"public"}],"package":"default","variables":[],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"Component"},{"position":{"x":336,"y":304},"size":{"width":224,"height":144},"view":"react-shape-view","shape":"custom-class","zIndex":10,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":112,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":56,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":224,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":56,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":168,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":36},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":72},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":108},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":224,"y":36},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":224,"y":72},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":224,"y":108},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":112,"y":144},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":144},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":224,"y":144},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":56,"y":144},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":168,"y":144},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"1cf5492a-c934-43de-87dc-5e9d5a820a71","methods":[{"name":"method1","type":"String","parameters":[],"accessModifier":"public"},{"name":"method2","type":"String","parameters":[],"accessModifier":"public"},{"name":"method3","type":"String","parameters":[],"accessModifier":"public"}],"package":"default","variables":[{"name":"variable1","type":"String","static":true,"accessModifier":"private"}],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"Composite"},{"position":{"x":176,"y":48},"size":{"width":96,"height":32},"view":"react-shape-view","shape":"custom-class","zIndex":10,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":24,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":96,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":24,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":72,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":8},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":16},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":96,"y":8},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":96,"y":16},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":96,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":48,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":96,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":24,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":72,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"f6649a54-a390-4b61-93c3-6ec57b5d69c9","methods":[],"package":"default","variables":[],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"Client"},{"position":{"x":144,"y":304},"size":{"width":144,"height":112},"view":"react-shape-view","shape":"custom-class","zIndex":10,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":72,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":36,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":144,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":36,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":108,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":28},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":56},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":84},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":144,"y":28},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":144,"y":56},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":144,"y":84},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":72,"y":112},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":112},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":144,"y":112},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":36,"y":112},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":108,"y":112},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"e1a82a7b-550d-4575-a1c4-6ed06bfecb4a","methods":[{"name":"method1","type":"String","parameters":[],"accessModifier":"public"}],"package":"default","variables":[{"name":"variable1","type":"String","static":true,"accessModifier":"private"}],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"Leaf"},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 20 0 L 0 10 L 20 20 z","fill":"white","name":"path","offsetX":-10},"strokeDasharray":"3,3"}},"edgeType":"realization","id":"41b970ad-da7f-413e-bcea-30dc17ffa839","zIndex":11,"source":{"cell":"e1a82a7b-550d-4575-a1c4-6ed06bfecb4a","port":"top-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"0a8c6fff-0806-48d0-8ed8-c67f0371e0f1","port":"bottom-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}}},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 20 0 L 0 10 L 20 20 z","fill":"white","name":"path","offsetX":-10},"strokeDasharray":"3,3"}},"edgeType":"realization","id":"5237779e-3cc0-4982-964c-4d9d703133d7","zIndex":12,"source":{"cell":"1cf5492a-c934-43de-87dc-5e9d5a820a71","port":"top-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"0a8c6fff-0806-48d0-8ed8-c67f0371e0f1","port":"bottom-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"vertices":[{"x":448,"y":272},{"x":222.5,"y":272}]},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 20 0 L 0 10 L 20 20 z","fill":"white","name":"path","offsetX":-10},"strokeDasharray":"3,3"}},"edgeType":"realization","id":"69b42f67-2e90-4414-948c-d1ad0854a32b","zIndex":13,"source":{"cell":"1cf5492a-c934-43de-87dc-5e9d5a820a71","port":"top-right-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"0a8c6fff-0806-48d0-8ed8-c67f0371e0f1","port":"right-middle-bottom","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"vertices":[{"x":504,"y":208.5}]},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 20 0 L 0 10 L 20 20 z","fill":"white","name":"path","offsetX":-10},"strokeDasharray":"3,3"}},"edgeType":"realization","id":"45872609-51b7-43fe-8079-7e0e2e93e997","zIndex":14,"source":{"cell":"f6649a54-a390-4b61-93c3-6ec57b5d69c9","port":"bottom-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"0a8c6fff-0806-48d0-8ed8-c67f0371e0f1","port":"top-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}}}]`