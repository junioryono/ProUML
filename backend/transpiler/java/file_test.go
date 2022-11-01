package java

import (
	"bytes"
	"errors"
	"testing"

	types "github.com/junioryono/ProUML/backend/transpiler/types"
)

func TestFileParse(t *testing.T) {
	var test1 = types.TestFile{
		Name: "invalid - no code inside file",
		Input: types.File{
			Name:      "Test",
			Extension: "java",
			Code:      []byte(""),
		},
		Output: []byte(""),
		Err:    &types.CannotParseText{},
	}

	var test2 = types.TestFile{
		Name: "valid - test class",
		Input: types.File{
			Name:      "Test",
			Extension: "java",
			Code:      []byte("public class Test { public static void main(String args[]){ System.out.println('Hello Java'); } }"),
		},
		Output: []byte(""),
		Err:    &types.CannotParseText{},
	}

	var tests = []types.TestFile{test1, test2}

	for _, tt := range tests {
		t.Run(tt.Name, func(subtest *testing.T) {
			subtest.Parallel()

			var (
				res []byte
				err error
			)

			res, err = parseFile(&tt.Input)

			incorrectResponse := !bytes.Equal(res, tt.Output)
			incorrectError := !errors.Is(err, tt.Err)

			if incorrectResponse {
				subtest.Errorf("incorrect response")
			}

			if incorrectError {
				subtest.Errorf("incorrect error")
			}

			if incorrectResponse || incorrectError {
				subtest.Fail()
			}
		})
	}
}
