package java

import (
	"bytes"
	"errors"
	"testing"

	types "github.com/junioryono/ProUML/backend/transpiler/types"
)

func TestPackageParse(t *testing.T) {
	var test1Files = []types.File{}
	var test1 = types.TestPackage{
		Name: "empty input string",
		Input: types.Package{
			Files: test1Files,
		},
		Output: nil,
		Err:    &types.CannotParseText{},
	}

	var tests = []types.TestPackage{test1}

	for _, tt := range tests {
		t.Run(tt.Name, func(subtest *testing.T) {
			subtest.Parallel()

			var (
				res []byte
				err error
			)

			res, err = parsePackage(&tt.Input)

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
