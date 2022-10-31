package transpiler_test

import (
	java "github.com/junioryono/ProUML/backend/transpiler/java"
)

type Test struct {
	name   string
	input  java.Package
	output []byte
	err    error
}
