package java

import (
	"errors"
	"testing"

	types "github.com/junioryono/ProUML/backend/transpiler/types"
)

func TestProjectParse(t *testing.T) {
	var tests = []types.TestProject{}

	for _, tt := range tests {
		t.Run(tt.Name, func(subtest *testing.T) {
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
