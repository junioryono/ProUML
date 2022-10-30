package transpiler_test

import (
	"bytes"
	"errors"
	"testing"

	java "github.com/junioryono/ProUML/backend/transpiler/java"
	types "github.com/junioryono/ProUML/backend/transpiler/types"
)

type Test struct {
	name   string
	input  interface{}
	output []byte
	err    error
}

func TestParse(t *testing.T) {
	var test1 = Test{
		name:   "empty input string",
		input:  java.Project{Original: []byte("")},
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

			switch language := tt.input.(type) {
			case java.Project:
				res, err = language.Parse()
			default:
				subtest.Errorf("can't detect language")
				subtest.Fail()
			}

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
