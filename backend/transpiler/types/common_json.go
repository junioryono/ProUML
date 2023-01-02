package types

import (
	"errors"
)

func (t CustomByteSlice) MarshalJSON() ([]byte, error) {
	// Make a copy of the slice
	t = append([]byte(nil), t...)

	for i := 0; i < len(t); i++ {
		if t[i] == '"' && (i == 0 || t[i-1] != '\\') {
			// Add an index to the slice and copy the rest of the slice
			t = append(t, 0)
			copy(t[i+1:], t[i:])
			// Add a backslash before the double quote
			t[i] = '\\'

			// Increment i to skip the added backslash
			i++
		}
	}

	return []byte(`"` + string(t) + `"`), nil
}

func (t *CustomByteSlice) UnmarshalJSON(data []byte) error {
	*t = CustomByteSlice(data[1 : len(data)-1])
	return nil
}

func (t *Relation) MarshalJSON() ([]byte, error) {
	// Example output:
	// {
	// 	"fromClassId": "fromClassId",
	// 	"toClassId": "toClassId",
	// 	"association": {
	// 		"fromArrow": true,
	// 		"toArrow": true
	// 	}
	// }

	// Check if the relation type is valid
	if t.Type == nil {
		return nil, errors.New("invalid relation type")
	}

	// Get the relation type
	relationType := t.Type

	// Get the relation type name
	relationTypeName := ""
	switch relationType.(type) {
	case *Association:
		relationTypeName = "association"
	case *Dependency:
		relationTypeName = "dependency"
	case *Realization:
		relationTypeName = "realization"
	case *Generalization:
		relationTypeName = "generalization"
	default:
		return nil, errors.New("invalid relation type")
	}

	// Create the relation JSON
	relationJSON := []byte(`{"fromClassId":"` + string(t.FromClassId) + `","toClassId":"` + string(t.ToClassId) + `","` + relationTypeName + `":{`)

	// Add the from arrow JSON
	relationJSON = append(relationJSON, []byte(`"fromArrow":`)...)
	if relationType.GetFromArrow() {
		relationJSON = append(relationJSON, []byte(`true`)...)
	} else {
		relationJSON = append(relationJSON, []byte(`false`)...)
	}

	// Add the to arrow JSON
	relationJSON = append(relationJSON, []byte(`,"toArrow":`)...)
	if relationType.GetToArrow() {
		relationJSON = append(relationJSON, []byte(`true`)...)
	} else {
		relationJSON = append(relationJSON, []byte(`false`)...)
	}

	// Add the end of the relation JSON
	relationJSON = append(relationJSON, []byte(`}}`)...)

	return relationJSON, nil
}
