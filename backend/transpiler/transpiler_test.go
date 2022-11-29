package transpiler

import (
	"errors"
	"testing"

	"github.com/junioryono/ProUML/backend/transpiler/types"
)

type ProjectParseTest struct {
	Name   string
	Input  types.Project
	Output []byte
	Err    error
}

func TestProjectParse(t *testing.T) {
	var tests = []ProjectParseTest{
		getProject1(),
	}

	for _, tt := range tests {
		t.Run(tt.Name, func(subtest *testing.T) {
			language, err := getProjectLanguage(tt.Input.Files)
			if err != nil {
				subtest.Errorf("error getting project language %s", err.Error())
				subtest.Fail()
			}

			_, err = parseProjectByLanguage(language, tt.Input.Files)
			if err != nil {
				subtest.Errorf("error parsing language %s, %s", language, err.Error())
				subtest.Fail()
			}

			if !errors.Is(err, tt.Err) {
				subtest.Errorf("incorrect error")
				subtest.Fail()
			}
		})
	}
}

func getProject1() ProjectParseTest {
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
	return ProjectParseTest{
		Name: "empty input string",
		Input: types.Project{
			Files: []types.File{file1, file2},
		},
		Output: nil,
		Err:    &types.CannotParseText{},
	}
}
