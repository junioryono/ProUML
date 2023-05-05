package templates

import (
	"encoding/json"
	"fmt"
)

func getFactoryMethod() *[]any {
	// Unmarshal abstract factory
	var objmap []map[string]interface{}
	if err := json.Unmarshal([]byte(factoryMethodString), &objmap); err != nil {
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

const factoryMethodString = `[{"position":{"x":96,"y":96},"size":{"width":285,"height":145},"view":"react-shape-view","shape":"custom-class","zIndex":10,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":142.5,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":71.25,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":285,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":71.25,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":213.75,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":36.25},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":72.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":108.75},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":285,"y":36.25},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":285,"y":72.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":285,"y":108.75},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":142.5,"y":145},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":145},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":285,"y":145},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":71.25,"y":145},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":213.75,"y":145},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"1dedd68b-0ca6-4fba-bd7a-29b30c7b58f4","type":"class","methods":[{"name":"method1","type":"void","static":true,"parameters":[{"name":"param1","type":"String"},{"name":"param2","type":"String"}],"accessModifier":"public"},{"name":"main","type":"void","static":true,"parameters":[{"name":"args","type":"String[]"}],"accessModifier":"public"}],"package":"default","variables":[{"name":"variable1","type":"String","static":true,"accessModifier":"private"},{"name":"variable2","type":"String","static":true,"accessModifier":"private"}],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"Creator"},{"position":{"x":16,"y":320},"size":{"width":192,"height":128},"view":"react-shape-view","shape":"custom-class","zIndex":11,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":96,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":192,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":144,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":64},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":96},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":192,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":192,"y":64},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":192,"y":96},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":96,"y":128},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":128},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":192,"y":128},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":48,"y":128},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":144,"y":128},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"e35ed4d5-96ef-4173-a52c-a6ab7356fd30","methods":[{"name":"method1","type":"void","static":true,"parameters":[{"name":"param1","type":"String"}],"accessModifier":"public"}],"package":"default","variables":[{"name":"variable1","type":"String","static":true,"accessModifier":"private"},{"name":"variable2","type":"String","static":true,"accessModifier":"private"}],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"CreatorA"},{"position":{"x":271.99999999999994,"y":320.00000000000006},"size":{"width":192,"height":128},"view":"react-shape-view","shape":"custom-class","zIndex":12,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":96,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":192,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":144,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":64},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":96},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":192,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":192,"y":64},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":192,"y":96},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":96,"y":128},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":128},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":192,"y":128},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":48,"y":128},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":144,"y":128},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"46dd2ff3-8655-4f05-b33e-c22da0600d76","methods":[{"name":"method1","type":"void","static":true,"parameters":[{"name":"param1","type":"String"}],"accessModifier":"public"}],"package":"default","variables":[{"name":"variable1","type":"String","static":true,"accessModifier":"private"},{"name":"variable2","type":"String","static":true,"accessModifier":"private"}],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"CreatorB"},{"position":{"x":528,"y":320},"size":{"width":112,"height":32},"view":"react-shape-view","shape":"custom-class","zIndex":16,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":56,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":28,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":112,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":28,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":84,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":8},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":16},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":112,"y":8},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":112,"y":16},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":112,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":56,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":112,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":28,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":84,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"2955a0b1-04ba-45ef-b108-c986ade110dc","methods":[],"package":"default","variables":[],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"ProductA"},{"position":{"x":608,"y":176},"size":{"width":128,"height":80},"view":"react-shape-view","shape":"custom-class","zIndex":18,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":64,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":32,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":128,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":32,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":96,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":20},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":40},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":60},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":128,"y":20},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":128,"y":40},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":128,"y":60},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":64,"y":80},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":80},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":128,"y":80},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":32,"y":80},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":96,"y":80},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"76aed246-c8ad-4104-8112-a91b5a2202d6","type":"interface","methods":[{"name":"method1","type":"void","static":true,"parameters":[],"accessModifier":"public"}],"package":"default","variables":[],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"Product"},{"position":{"x":704,"y":320},"size":{"width":112,"height":32},"view":"react-shape-view","shape":"custom-class","zIndex":19,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":56,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":28,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":112,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":28,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":84,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":8},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":16},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":112,"y":8},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":112,"y":16},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":112,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":56,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":112,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":28,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":84,"y":32},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"8f340d8e-df98-4d68-8644-443f6a8d1145","methods":[],"package":"default","variables":[],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"ProductB"},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 20 0 L 0 10 L 20 20 z","fill":"white","name":"path","offsetX":-10},"strokeDasharray":"3,3"}},"edgeType":"realization","id":"3e3299f4-483c-4169-8970-52ff36aab6f5","zIndex":20,"source":{"cell":"2955a0b1-04ba-45ef-b108-c986ade110dc","port":"top-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"76aed246-c8ad-4104-8112-a91b5a2202d6","port":"bottom-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"vertices":[{"x":584,"y":304},{"x":672,"y":304}]},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 20 0 L 0 10 L 20 20 z","fill":"white","name":"path","offsetX":-10},"strokeDasharray":"3,3"}},"edgeType":"realization","id":"a946d986-8876-4747-be58-e568395b2f25","zIndex":21,"source":{"cell":"8f340d8e-df98-4d68-8644-443f6a8d1145","port":"top-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"76aed246-c8ad-4104-8112-a91b5a2202d6","port":"bottom-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"vertices":[{"x":760,"y":304},{"x":672,"y":304}]},{"shape":"edge","edgeType":"classic","id":"7ef41eb3-48f9-4aaa-8237-e7ee6ab198f5","zIndex":23,"source":{"cell":"e35ed4d5-96ef-4173-a52c-a6ab7356fd30","port":"top-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"1dedd68b-0ca6-4fba-bd7a-29b30c7b58f4","port":"bottom-middle","connectionPoint":{"args":{"offset":-2},"name":"anchor"}},"vertices":[{"x":112,"y":272},{"x":238.5,"y":272}]},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 20 0 L 0 10 L 20 20 z","fill":"white","name":"path","offsetX":-10},"strokeDasharray":"3,3"}},"edgeType":"realization","id":"fd94ba3a-4c12-4a8d-8bbd-5bd6434edc71","zIndex":25,"source":{"cell":"1dedd68b-0ca6-4fba-bd7a-29b30c7b58f4","port":"right-middle-bottom","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"76aed246-c8ad-4104-8112-a91b5a2202d6","port":"left-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}}},{"shape":"edge","edgeType":"classic","id":"d2523b66-3b87-4b59-88ed-85b91ccaaac0","zIndex":26,"source":{"cell":"46dd2ff3-8655-4f05-b33e-c22da0600d76","port":"top-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"1dedd68b-0ca6-4fba-bd7a-29b30c7b58f4","port":"bottom-middle","connectionPoint":{"args":{"offset":-2},"name":"anchor"}},"vertices":[{"x":368,"y":272},{"x":238.5,"y":272}]}]`
