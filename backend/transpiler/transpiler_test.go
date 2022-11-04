package transpiler

import (
	"bytes"
	"errors"
	"testing"

	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func TestProjectParse(t *testing.T) {
	project1 := getProject1()

	tests := []types.TestProject{project1}

	for _, tt := range tests {
		t.Run(tt.Name, func(subtest *testing.T) {
			subtest.Parallel()

			language, err := getProjectLanguage(tt.Input.Files)
			if err != nil {
				subtest.Errorf("error getting project language %s", err.Error())
				subtest.Fail()
			}

			parserResponse, err := parseProjectByLanguage(language, tt.Input.Files)
			if err != nil {
				subtest.Errorf("error parsing language %s, %s", language, err.Error())
				subtest.Fail()
			}

			incorrectResponse := !bytes.Equal(parserResponse, tt.Output)
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

func getProject1() types.TestProject {
	file1 := types.File{
		Name:      "Test",
		Extension: "java",
		Code:      []byte("public class Test { public static void main(String args[]){ System.out.println('Hello Java'); } }"),
	}
	file2 := types.File{
		Name:      "Test2",
		Extension: "java",
		Code:      []byte("public class Test2 { public void test(){ System.out.println('test2'); } }"),
	}
	return types.TestProject{
		Name: "empty input string",
		Input: types.Project{
			Files: []types.File{file1, file2},
		},
		Output: nil,
		Err:    &types.CannotParseText{},
	}
}
