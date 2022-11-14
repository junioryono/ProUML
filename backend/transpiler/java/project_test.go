package java

import (
	"bytes"
	"errors"
	"reflect"
	"strconv"
	"testing"

	types "github.com/junioryono/ProUML/backend/transpiler/types"
)

func TestProjectParse(t *testing.T) {
	var tests = []types.TestProject{}

	for testIndex, tt := range tests {
		t.Run("Test index "+strconv.Itoa(testIndex), func(subtest *testing.T) {
			_, err := ParseProject(tt.Input)

			incorrectError := !errors.Is(err, tt.Err)

			if incorrectError {
				subtest.Errorf("incorrect error")
			}

			if incorrectError {
				subtest.Fail()
			}
		})
	}
}

func TestGetClassRelations(t *testing.T) {
	type TestIsVar struct {
		Input  []types.FileResponse
		Output []types.Relation
	}

	var tests = []TestIsVar{
		{
			Input: []types.FileResponse{
				{
					Package: []byte(""),
					Data:    []any{},
				},
			},
			Output: []types.Relation{},
		},
	}

	for testIndex, tt := range tests {
		t.Run("Test index "+strconv.Itoa(testIndex), func(subtest *testing.T) {
			actualOutput := getClassRelations(tt.Input)

			if len(actualOutput) != len(tt.Output) {
				subtest.Errorf("incorrect number of relations.\nExpected %s. Got %s\n", strconv.Itoa(len(tt.Output)), strconv.Itoa(len(actualOutput)))
				subtest.FailNow()
			}

			for index, relation := range tt.Output {
				if !bytes.Equal(relation.FromClassId, actualOutput[index].FromClassId) {
					subtest.Errorf("incorrect relation.\nExpected %s. Got %s\n", string(relation.FromClassId), actualOutput[index].FromClassId)
					subtest.FailNow()
				} else if !bytes.Equal(relation.ToClassId, actualOutput[index].ToClassId) {
					subtest.Errorf("incorrect relation.\nExpected %s. Got %s\n", string(relation.ToClassId), actualOutput[index].ToClassId)
					subtest.FailNow()
				} else if reflect.TypeOf(relation.Type) != reflect.TypeOf(actualOutput[index].Type) {
					subtest.Errorf("incorrect relation.\nExpected %s. Got %s\n", reflect.TypeOf(relation.Type).String(), reflect.TypeOf(actualOutput[index].Type).String())
					subtest.FailNow()
				} else if relation.Type.GetFromArrow() != actualOutput[index].Type.GetFromArrow() {
					subtest.Errorf("incorrect relation.\nExpected %t. Got %t\n", relation.Type.GetFromArrow(), actualOutput[index].Type.GetFromArrow())
					subtest.FailNow()
				} else if relation.Type.GetToArrow() != actualOutput[index].Type.GetToArrow() {
					subtest.Errorf("incorrect relation.\nExpected %t. Got %t\n", relation.Type.GetFromArrow(), actualOutput[index].Type.GetFromArrow())
					subtest.FailNow()
				}
			}
		})
	}
}
