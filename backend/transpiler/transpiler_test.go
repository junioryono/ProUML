package transpiler_test

import (
	"bytes"
	"errors"
	"testing"

	java "github.com/junioryono/ProUML/backend/transpiler/java"
)

type Test struct {
	name   string
	input  interface{}
	output []byte
	err    error
}

func TestParse(t *testing.T) {
	// var test1 = types.TestProject{
	// 	name:   "empty input string",
	// 	input:  java.Project{Original: []byte("")},
	// 	output: []byte(""),
	// 	err:    &types.CannotParseText{},
	// }

	var tests = []Test{}

	for _, tt := range tests {
		t.Run(tt.name, func(subtest *testing.T) {
			subtest.Parallel()

			var (
				res []byte
				err error
			)

			switch language := tt.input.(type) {
			case java.Package:
				java.ParseProject()
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
