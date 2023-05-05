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

const observerString = ``
