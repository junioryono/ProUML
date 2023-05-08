package templates

import (
	"encoding/json"
	"fmt"
)

func getObserver() *[]any {
	// Unmarshal abstract factory
	var objmap []map[string]interface{}
	if err := json.Unmarshal([]byte(observerString), &objmap); err != nil {
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

const observerString = `[{"position":{"x":100,"y":100},"size":{"width":285,"height":185},"view":"react-shape-view","shape":"custom-class","zIndex":10,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":142.5,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":71.25,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":285,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":71.25,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":213.75,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":46.25},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":92.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":138.75},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":285,"y":46.25},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":285,"y":92.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":285,"y":138.75},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":142.5,"y":185},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":185},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":285,"y":185},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":71.25,"y":185},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":213.75,"y":185},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"24d7b064-da44-44c7-828d-99dbbd52de17","methods":[{"name":"method1","type":"String","parameters":[],"accessModifier":"public"},{"name":"method2","type":"String","parameters":[],"accessModifier":"public"},{"name":"method3","type":"String","parameters":[],"accessModifier":"public"}],"package":"default","variables":[{"name":"variable1","type":"String","static":true,"accessModifier":"private"},{"name":"variable2","type":"String","static":true,"accessModifier":"private"}],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"Publisher"},{"position":{"x":480,"y":288},"size":{"width":176,"height":112},"view":"react-shape-view","shape":"custom-class","zIndex":10,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":88,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":44,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":176,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":44,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":132,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":28},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":56},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":84},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":176,"y":28},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":176,"y":56},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":176,"y":84},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":88,"y":112},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":112},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":176,"y":112},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":44,"y":112},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":132,"y":112},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"c5dbf22b-6dd9-423c-bccb-dbdd1ddd0141","methods":[{"name":"method1","type":"String","parameters":[],"accessModifier":"public"}],"package":"default","variables":[{"name":"variable1","type":"String","static":true,"accessModifier":"private"}],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"Concrete Subscribers"},{"position":{"x":480,"y":106},"size":{"width":176,"height":80},"view":"react-shape-view","shape":"custom-class","zIndex":10,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":88,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":44,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":176,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":44,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":132,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":20},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":40},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":60},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":176,"y":20},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":176,"y":40},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":176,"y":60},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":88,"y":80},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":80},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":176,"y":80},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":44,"y":80},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":132,"y":80},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"bddfca03-b4aa-4f9a-8a1d-d6ee5bf72fd3","type":"interface","methods":[{"name":"method1","type":"String","parameters":[],"accessModifier":"public"}],"package":"default","variables":[],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"Subscriber"},{"position":{"x":195,"y":327},"size":{"width":96,"height":32},"view":"react-shape-view","shape":"custom-class","zIndex":10,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":24,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":96,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":24,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":72,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":8},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":16},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":96,"y":8},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":96,"y":16},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":96,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":48,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":96,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":24,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":72,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"4a45fbd2-e6e6-44b4-84d2-79051c0e1e63","methods":[],"package":"default","variables":[],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"Client"},{"shape":"edge","edgeType":"classic","id":"0517a06f-1a98-40af-aadf-956234c101f5","zIndex":11,"source":{"cell":"4a45fbd2-e6e6-44b4-84d2-79051c0e1e63","port":"top-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"24d7b064-da44-44c7-828d-99dbbd52de17","port":"bottom-middle","connectionPoint":{"args":{"offset":-2},"name":"anchor"}}},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 20 0 L 0 10 L 20 20 z","fill":"white","name":"path","offsetX":-10},"strokeDasharray":"3,3"}},"edgeType":"realization","id":"b33a7a64-55c6-46a8-b5fa-0d0666943e69","zIndex":12,"source":{"cell":"24d7b064-da44-44c7-828d-99dbbd52de17","port":"right-middle-top","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"bddfca03-b4aa-4f9a-8a1d-d6ee5bf72fd3","port":"left-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}}},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 20 0 L 0 10 L 20 20 z","fill":"white","name":"path","offsetX":-10},"strokeDasharray":"3,3"}},"edgeType":"realization","id":"c31b7bf1-2a85-43b3-ac07-e84a84d5870b","zIndex":13,"source":{"cell":"c5dbf22b-6dd9-423c-bccb-dbdd1ddd0141","port":"top-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"bddfca03-b4aa-4f9a-8a1d-d6ee5bf72fd3","port":"bottom-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}}},{"shape":"edge","edgeType":"classic","id":"002b1ea7-055c-4d8d-94c3-07f7ac814d70","zIndex":14,"source":{"cell":"4a45fbd2-e6e6-44b4-84d2-79051c0e1e63","port":"right-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"c5dbf22b-6dd9-423c-bccb-dbdd1ddd0141","port":"left-middle","connectionPoint":{"args":{"offset":-2},"name":"anchor"}}}]`
