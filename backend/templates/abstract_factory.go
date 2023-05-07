package templates

import (
	"encoding/json"
	"fmt"
)

func getAbstractFactory() *[]any {
	// Unmarshal abstract factory
	var objmap []map[string]interface{}
	if err := json.Unmarshal([]byte(abstractFactoryString), &objmap); err != nil {
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

const abstractFactoryString = `[{"position":{"x":560,"y":-64},"size":{"width":285,"height":106},"view":"react-shape-view","shape":"custom-class","zIndex":10,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":142.5,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":71.25,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":285,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":71.25,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":213.75,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":26.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":53},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":79.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":285,"y":26.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":285,"y":53},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":285,"y":79.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":142.5,"y":106},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":106},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":285,"y":106},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":71.25,"y":106},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":213.75,"y":106},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"41c63643-6485-4845-9b29-627e468139c3","type":"interface","methods":[{"name":"method1","type":"void","static":true,"parameters":[{"name":"param1","type":"String"},{"name":"param2","type":"String"}],"accessModifier":"public"},{"name":"main","type":"void","static":true,"parameters":[{"name":"args","type":"String[]"}],"accessModifier":"public"}],"package":"default","variables":[],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"AbstractFactory"},{"position":{"x":560,"y":-304},"size":{"width":285,"height":145},"view":"react-shape-view","shape":"custom-class","zIndex":11,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":142.5,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":71.25,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":285,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":71.25,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":213.75,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":36.25},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":72.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":108.75},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":285,"y":36.25},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":285,"y":72.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":285,"y":108.75},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":142.5,"y":145},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":145},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":285,"y":145},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":71.25,"y":145},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":213.75,"y":145},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"c32597c8-0156-4e92-b8fa-b6edc855cb06","methods":[{"name":"method1","type":"void","static":true,"parameters":[{"name":"param1","type":"String"},{"name":"param2","type":"String"}],"accessModifier":"public"},{"name":"main","type":"void","static":true,"parameters":[{"name":"args","type":"String[]"}],"accessModifier":"public"}],"package":"default","variables":[{"name":"variable1","type":"String","static":true,"accessModifier":"private"},{"name":"variable2","type":"String","static":true,"accessModifier":"private"}],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"ConcreteFactory1"},{"position":{"x":560,"y":128},"size":{"width":285,"height":145},"view":"react-shape-view","shape":"custom-class","zIndex":12,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":142.5,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":71.25,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":285,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":71.25,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":213.75,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":36.25},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":72.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":108.75},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":285,"y":36.25},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":285,"y":72.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":285,"y":108.75},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":142.5,"y":145},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":145},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":285,"y":145},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":71.25,"y":145},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":213.75,"y":145},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"3fd23018-2344-4b8c-a806-70ffa2454f19","methods":[{"name":"method1","type":"void","static":true,"parameters":[{"name":"param1","type":"String"},{"name":"param2","type":"String"}],"accessModifier":"public"},{"name":"main","type":"void","static":true,"parameters":[{"name":"args","type":"String[]"}],"accessModifier":"public"}],"package":"default","variables":[{"name":"variable1","type":"String","static":true,"accessModifier":"private"},{"name":"variable2","type":"String","static":true,"accessModifier":"private"}],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"ConcreteFactory2"},{"position":{"x":928,"y":-83},"size":{"width":285,"height":145},"view":"react-shape-view","shape":"custom-class","zIndex":13,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":142.5,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":71.25,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":285,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":71.25,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":213.75,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":36.25},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":72.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":108.75},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":285,"y":36.25},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":285,"y":72.5},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":285,"y":108.75},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":142.5,"y":145},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":145},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":285,"y":145},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":71.25,"y":145},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":213.75,"y":145},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"d851ab85-0920-4f96-b167-1515eb71b5ff","methods":[{"name":"method1","type":"void","static":true,"parameters":[{"name":"param1","type":"String"},{"name":"param2","type":"String"}],"accessModifier":"public"},{"name":"main","type":"void","static":true,"parameters":[{"name":"args","type":"String[]"}],"accessModifier":"public"}],"package":"default","variables":[{"name":"variable1","type":"String","static":true,"accessModifier":"private"},{"name":"variable2","type":"String","static":true,"accessModifier":"private"}],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"Client"},{"position":{"x":400,"y":32},"size":{"width":96,"height":48},"view":"react-shape-view","shape":"custom-class","zIndex":14,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":24,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":96,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":24,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":72,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":12},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":36},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":96,"y":12},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":96,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":96,"y":36},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":48,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":96,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":24,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":72,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"a161e96c-04ce-4a80-b352-627507919ddd","methods":[],"package":"default","variables":[],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"ProductB2"},{"position":{"x":288,"y":32},"size":{"width":96,"height":48},"view":"react-shape-view","shape":"custom-class","zIndex":15,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":24,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":96,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":24,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":72,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":12},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":36},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":96,"y":12},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":96,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":96,"y":36},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":48,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":96,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":24,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":72,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"41f1f66e-938e-4206-81bf-1acf33b8bbd6","methods":[],"package":"default","variables":[],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"ProductA2"},{"position":{"x":288,"y":-48},"size":{"width":96,"height":48},"view":"react-shape-view","shape":"custom-class","zIndex":16,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":24,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":96,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":24,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":72,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":12},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":36},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":96,"y":12},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":96,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":96,"y":36},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":48,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":96,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":24,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":72,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"a1118bf5-6292-4226-8394-2a81447d5c55","type":"abstract","methods":[],"package":"default","variables":[],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"ProductA"},{"position":{"x":400,"y":-48},"size":{"width":96,"height":48},"view":"react-shape-view","shape":"custom-class","zIndex":17,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":24,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":96,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":24,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":72,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":12},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":36},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":96,"y":12},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":96,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":96,"y":36},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":48,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":96,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":24,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":72,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"26ba7b55-203e-406b-bcdf-bc6da5afd478","type":"abstract","methods":[],"package":"default","variables":[],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"ProductB"},{"position":{"x":288,"y":-128},"size":{"width":96,"height":48},"view":"react-shape-view","shape":"custom-class","zIndex":18,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":24,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":96,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":24,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":72,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":12},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":36},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":96,"y":12},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":96,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":96,"y":36},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":48,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":96,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":24,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":72,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"c5de4674-04a0-4ade-948c-2238f1a30cc0","methods":[],"package":"default","variables":[],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"ProductA1"},{"position":{"x":400,"y":-128},"size":{"width":96,"height":48},"view":"react-shape-view","shape":"custom-class","zIndex":19,"ports":{"groups":{"group1":{"attrs":{"circle":{"r":4,"magnet":true,"stroke":"#31d0c6","strokeWidth":2,"fill":"#fff","style":{"visibility":"hidden"}}},"zIndex":1,"position":{"name":"absolute"}}},"items":[{"id":"top-middle","args":{"x":48,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-middle-left","args":{"x":24,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left","args":{"x":0,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right","args":{"x":96,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-left-middle","args":{"x":24,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"top-right-middle","args":{"x":72,"y":0},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-top","args":{"x":0,"y":12},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle","args":{"x":0,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"left-middle-bottom","args":{"x":0,"y":36},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-top","args":{"x":96,"y":12},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle","args":{"x":96,"y":24},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"right-middle-bottom","args":{"x":96,"y":36},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-middle","args":{"x":48,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left","args":{"x":0,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right","args":{"x":96,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-left-middle","args":{"x":24,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"},{"id":"bottom-right-middle","args":{"x":72,"y":48},"attrs":{"circle":{"style":{"visibility":"hidden"}}},"group":"group1"}]},"id":"d161ab67-9739-4910-82b0-1b8dd822bed7","methods":[],"package":"default","variables":[],"borderColor":"000000","borderStyle":"solid","borderWidth":1,"backgroundColor":"FFFFFF","packageName":"default","name":"ProductB2"},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 20 0 L 0 10 L 20 20 z","fill":"white","name":"path","offsetX":-10},"strokeDasharray":"3,3"}},"edgeType":"realization","id":"5a13aa6b-bbcc-4581-946a-ecf5e26f5d66","zIndex":20,"source":{"cell":"d851ab85-0920-4f96-b167-1515eb71b5ff","port":"left-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"41c63643-6485-4845-9b29-627e468139c3","port":"right-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}}},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 20 0 L 0 10 L 20 20 z","fill":"white","name":"path","offsetX":-10},"strokeDasharray":"3,3"}},"edgeType":"realization","id":"c2a64ac6-ac34-4175-a484-2a44108eecd6","zIndex":21,"source":{"cell":"c32597c8-0156-4e92-b8fa-b6edc855cb06","port":"bottom-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"41c63643-6485-4845-9b29-627e468139c3","port":"top-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}}},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 20 0 L 0 10 L 20 20 z","fill":"white","name":"path","offsetX":-10},"strokeDasharray":"3,3"}},"edgeType":"realization","id":"e258cac6-9f79-4d7f-b2ff-ff2f8826af51","zIndex":22,"source":{"cell":"3fd23018-2344-4b8c-a806-70ffa2454f19","port":"top-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"41c63643-6485-4845-9b29-627e468139c3","port":"bottom-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}}},{"shape":"edge","edgeType":"classic","id":"7ddc752f-43d6-4433-a5b3-7a3301aca30a","zIndex":23,"source":{"cell":"c32597c8-0156-4e92-b8fa-b6edc855cb06","port":"left-middle"},"target":{"cell":"d161ab67-9739-4910-82b0-1b8dd822bed7","port":"top-middle","connectionPoint":{"args":{"offset":-2},"name":"anchor"}},"vertices":[{"x":448,"y":-231.5}]},{"shape":"edge","edgeType":"classic","id":"54b272cb-b9d5-4b3a-b30a-717bcd8c4977","zIndex":24,"source":{"cell":"c32597c8-0156-4e92-b8fa-b6edc855cb06","port":"left-middle"},"target":{"cell":"c5de4674-04a0-4ade-948c-2238f1a30cc0","port":"top-middle","connectionPoint":{"args":{"offset":-2},"name":"anchor"}},"vertices":[{"x":336,"y":-231.5}]},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 6 10 L 18 4 L 18 5 L 8 10 L 18 15 L 18 16 z","fill":"black","name":"path","offsetX":-5,"strokeWidth":1.5}}},"edgeType":"generalization","id":"dae1cb5f-97c1-4d7e-a148-68e1e0649335","zIndex":25,"source":{"cell":"d161ab67-9739-4910-82b0-1b8dd822bed7","port":"bottom-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"26ba7b55-203e-406b-bcdf-bc6da5afd478","port":"top-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}}},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 6 10 L 18 4 L 18 5 L 8 10 L 18 15 L 18 16 z","fill":"black","name":"path","offsetX":-5,"strokeWidth":1.5}}},"edgeType":"generalization","id":"373b99a2-c773-497c-b267-e4fe7ff3c51f","zIndex":26,"source":{"cell":"c5de4674-04a0-4ade-948c-2238f1a30cc0","port":"bottom-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"a1118bf5-6292-4226-8394-2a81447d5c55","port":"top-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}}},{"shape":"edge","edgeType":"classic","id":"f3f1cff7-b3c7-46d4-8620-641c20d64fbb","zIndex":27,"source":{"cell":"3fd23018-2344-4b8c-a806-70ffa2454f19","port":"left-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"a161e96c-04ce-4a80-b352-627507919ddd","port":"bottom-middle","connectionPoint":{"args":{"offset":-2},"name":"anchor"}},"vertices":[{"x":448,"y":200.5}]},{"shape":"edge","edgeType":"classic","id":"47d8d6d6-d222-403b-a7d2-8a4b81ebbe19","zIndex":28,"source":{"cell":"3fd23018-2344-4b8c-a806-70ffa2454f19","port":"left-middle"},"target":{"cell":"41f1f66e-938e-4206-81bf-1acf33b8bbd6","port":"bottom-middle","connectionPoint":{"args":{"offset":-2},"name":"anchor"}},"vertices":[{"x":336,"y":200.5}]},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 6 10 L 18 4 L 18 5 L 8 10 L 18 15 L 18 16 z","fill":"black","name":"path","offsetX":-5,"strokeWidth":1.5}}},"edgeType":"generalization","id":"24a2a17b-248a-4bb1-a89e-72f421c958bc","zIndex":29,"source":{"cell":"a161e96c-04ce-4a80-b352-627507919ddd","port":"top-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"26ba7b55-203e-406b-bcdf-bc6da5afd478","port":"bottom-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}}},{"shape":"edge","attrs":{"line":{"targetMarker":{"d":"M 6 10 L 18 4 L 18 5 L 8 10 L 18 15 L 18 16 z","fill":"black","name":"path","offsetX":-5,"strokeWidth":1.5}}},"edgeType":"generalization","id":"527e941d-0785-46a5-9df4-89d2b412190a","zIndex":30,"source":{"cell":"41f1f66e-938e-4206-81bf-1acf33b8bbd6","port":"top-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}},"target":{"cell":"a1118bf5-6292-4226-8394-2a81447d5c55","port":"bottom-middle","connectionPoint":{"args":{"offset":0},"name":"anchor"}}}]`