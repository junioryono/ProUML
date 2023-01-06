package templates

import "encoding/json"

func getFactoryMethod() json.RawMessage {
	return json.RawMessage(`{
		"nodes": [
			{
				"id": "1",
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 100,
					"height": 100
				},
				"color": "#ffffff",
				"shape": "rectangle",
				"content": "Product",
				"contentColor": "#000000",
				"contentSize": 12,
			"contentPosition": {
					"x": 50,
					"y": 50
				}
			},
			{
				"id": "2",
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 100,
					"height": 100
				},
				"color": "#ffffff",
				"shape": "rectangle",
				"content": "ConcreteProduct",
				"contentColor": "#000000",
				"contentSize": 12,
				"contentPosition": {
					"x": 50,
					"y": 50
				}
			},
			{
				"id": "3",
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 100,
					"height": 100
				},
				"color": "#ffffff",
				"shape": "rectangle",
				"content": "Creator",
				"contentColor": "#000000",
				"contentSize": 12,
				"contentPosition": {
					"x": 50,
					"y": 50
				}
			},
			{
				"id": "4",
				"position": {
					"x": 0,
					"y": 0
				},
				"size": {
					"width": 100,
					"height": 100
				},
				"color": "#ffffff",
				"shape": "rectangle",
				"content": "ConcreteCreator",
				"contentColor": "#000000",
				"contentSize": 12,
				"contentPosition": {
					"x": 50,
					"y": 50
				}
			}
		],
		"edges": [
			{
				"id": "1",
				"source": "3",
				"target": "1",
				"color": "#000000",
				"size": 1,
				"content": "factoryMethod",
				"contentColor": "#000000",
				"contentSize": 12,
				"contentPosition": {
					"x": 50,
					"y": 50
				}
			},
			{
				"id": "2",
				"source": "4",
				"target": "1",
				"color": "#000000",
				"size": 1,
				"content": "factoryMethod",
				"contentColor": "#000000",
				"contentSize": 12,
				"contentPosition": {
					"x": 50,
					"y": 50
				}
			},
			{
				"id": "3",
				"source": "4",
				"target": "2",
				"color": "#000000",
				"size": 1,
				"content": "",
				"contentColor": "#000000",
				"contentSize": 12,
				"contentPosition": {
					"x": 50,
					"y": 50
				}
			}
		]
	}`)
}
