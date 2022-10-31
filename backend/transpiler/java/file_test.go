package transpiler_test

import (
	"bytes"
	"errors"
	"testing"

	java "github.com/junioryono/ProUML/backend/transpiler/java"
	types "github.com/junioryono/ProUML/backend/transpiler/types"
)

func TestFileParse(t *testing.T) {
	var test1 = Test{
		name:   "empty input string",
		input:  java.Package{Original: []byte("")},
		output: []byte(""),
		err:    &types.CannotParseText{},
	}

	var tests = []Test{test1}

	for _, tt := range tests {
		t.Run(tt.name, func(subtest *testing.T) {
			subtest.Parallel()

			var (
				res []byte
				err error
			)

			res, err = tt.input.Parse()

			incorrectResponse := !bytes.Equal(res, tt.output)
			incorrectError := !errors.Is(err, tt.err)

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
