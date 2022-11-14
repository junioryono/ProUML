package java

import (
	"bytes"
	"errors"
	"strconv"
	"testing"

	types "github.com/junioryono/ProUML/backend/transpiler/types"
)

func TestParseFile(t *testing.T) {
	var tests = []types.TestFileResponse{
		{
			Name: "invalid - no code inside file",
			Input: types.File{
				Name:      "Test1",
				Extension: "java",
				Code:      nil,
			},
			Output: &types.FileResponse{
				Package: []byte(""),
				Data:    nil,
			},
			Err: &types.CannotParseText{},
		},
		{
			Name: "valid - includes package, import, class",
			Input: types.File{
				Name:      "Test2",
				Extension: "java",
				Code:      []byte("import java.awt.Cursor;public class Test2{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
			},
			Output: &types.FileResponse{
				Package: []byte(""),
				Data: []any{
					types.JavaClass{
						Name: []byte("Test2"),
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("main"),
								AccessModifier: []byte("public"),
								Parameters: []types.JavaMethodParameter{
									{
										Type: []byte("String[]"),
										Name: []byte("args"),
									},
								},
								Abstract: false,
								Static:   true,
								Final:    false,
							},
						},
					},
				},
			},
			Err: nil,
		},
		{
			Name: "valid - includes package, class",
			Input: types.File{
				Name:      "Test3",
				Extension: "java",
				Code:      []byte("package com.houarizegai.calculator;public class Test3{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
			},
			Output: &types.FileResponse{
				Package: []byte("com.houarizegai.calculator"),
				Data: []any{
					types.JavaClass{
						Name: []byte("Test3"),
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("main"),
								AccessModifier: []byte("public"),
								Parameters: []types.JavaMethodParameter{
									{
										Type: []byte("String[]"),
										Name: []byte("args"),
									},
								},
								Abstract: false,
								Static:   true,
								Final:    false,
							},
						},
					},
				},
			},
			Err: nil,
		},
		{
			Name: "valid - includes package, import",
			Input: types.File{
				Name:      "Test4",
				Extension: "java",
				Code:      []byte("import java.awt.Cursor;public class Test4{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
			},
			Output: &types.FileResponse{
				Package: []byte(""),
				Data: []any{
					types.JavaClass{
						Name: []byte("Test4"),
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("main"),
								AccessModifier: []byte("public"),
								Parameters: []types.JavaMethodParameter{
									{
										Type: []byte("String[]"),
										Name: []byte("args"),
									},
								},
								Abstract: false,
								Static:   true,
								Final:    false,
							},
						},
					},
				},
			},
			Err: nil,
		},
		{
			Name: "valid - includes class",
			Input: types.File{
				Name:      "Test5",
				Extension: "java",
				Code:      []byte("public class Test5{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
			},
			Output: &types.FileResponse{
				Package: []byte(""),
				Data: []any{
					types.JavaClass{
						Name: []byte("Test5"),
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("main"),
								AccessModifier: []byte("public"),
								Parameters: []types.JavaMethodParameter{
									{
										Type: []byte("String[]"),
										Name: []byte("args"),
									},
								},
								Abstract: false,
								Static:   true,
								Final:    false,
							},
						},
					},
				},
			},
			Err: nil,
		},
		{
			Name: "valid - includes class, extends",
			Input: types.File{
				Name:      "Test6",
				Extension: "java",
				Code:      []byte("public class Test6 extends Test,Hello,Yes{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
			},
			Output: &types.FileResponse{
				Package: []byte(""),
				Data: []any{
					types.JavaClass{
						Name:    []byte("Test6"),
						Extends: [][]byte{[]byte("Test"), []byte("Hello"), []byte("Yes")},
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("main"),
								AccessModifier: []byte("public"),
								Parameters: []types.JavaMethodParameter{
									{
										Type: []byte("String[]"),
										Name: []byte("args"),
									},
								},
								Abstract: false,
								Static:   true,
								Final:    false,
							},
						},
					},
				},
			},
			Err: nil,
		},
		{
			Name: "valid - includes class, extends",
			Input: types.File{
				Name:      "A",
				Extension: "java",
				Code:      []byte("import java.util.*;class Test{protected interface Yes{void show();}public void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{public static void main(String[] args){Test.Yes obj;Testing t = new Testing();obj=t;obj.show();}}"),
			},
			Output: &types.FileResponse{
				Package: []byte(""),
				Data: []any{
					types.JavaClass{
						Name: []byte("Test"),
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("Test"),
								AccessModifier: []byte("public"),
								Parameters:     nil,
								Abstract:       false,
								Static:         true,
								Final:          false,
							},
						},
					},
					types.JavaInterface{
						DefinedWithin: []byte("Test"),
						Name:          []byte("Yes"),
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("show"),
								AccessModifier: []byte(""),
								Parameters:     nil,
								Abstract:       false,
								Static:         false,
								Final:          false,
							},
						},
					},
					types.JavaClass{
						Name:       []byte("Testing"),
						Implements: [][]byte{[]byte("Test.Yes")},
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("show"),
								AccessModifier: []byte("public"),
								Parameters:     nil,
								Abstract:       false,
								Static:         false,
								Final:          false,
							},
						},
					},
					types.JavaClass{
						Name: []byte("A"),
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("main"),
								AccessModifier: []byte("public"),
								Parameters: []types.JavaMethodParameter{
									{
										Type: []byte("String[]"),
										Name: []byte("args"),
									},
								},
								Abstract: false,
								Static:   true,
								Final:    false,
							},
						},
						Invokes: [][]byte{
							[]byte("Testing"),
						},
					},
				},
			},
			Err: nil,
		},
		{
			Name: "valid - includes class, extends",
			Input: types.File{
				Name:      "A",
				Extension: "java",
				Code:      []byte("import java.util.*;class Test{protected interface Yes{void show();}public void TestVoid(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{Test inner1;public Testing inner2 = new Testing();private static Test.Yes inner3 = new Testing();protected final Test.Yes inner4 = \"Hello\";static final Test.Yes inner5 = null;protected static final Test.Yes inner6 = null;public static void main(String[] args){Test.Yes obj;Testing t = new Testing();obj = t;obj.show();}Testing function1(Test.Yes var1, Test var2){};Testing function2();abstract void function3(){};static Testing function4(){}final Testing function5();static final void function6(){};public abstract void function7();private static Testing function8(){};protected final Testing function9(){};public static final void function10(){};}"),
			},
			Output: &types.FileResponse{
				Package: []byte(""),
				Data: []any{
					types.JavaClass{
						Name:       []byte("Test"),
						Implements: nil,
						Extends:    nil,
						Variables:  nil,
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("TestVoid"),
								AccessModifier: []byte("public"),
								Parameters:     nil,
								Abstract:       false,
								Static:         false,
								Final:          false,
							},
						},
					},
					types.JavaInterface{
						DefinedWithin: []byte("Test"),
						Name:          []byte("Yes"),
						Extends:       nil,
						Variables:     nil,
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("show"),
								AccessModifier: []byte(""),
								Parameters:     nil,
								Abstract:       false,
								Static:         false,
								Final:          false,
							},
						},
					},
					types.JavaClass{
						Name:       []byte("Testing"),
						Implements: [][]byte{[]byte("Test.Yes")},
						Extends:    nil,
						Variables:  nil,
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("show"),
								AccessModifier: []byte(""),
								Parameters:     nil,
								Abstract:       false,
								Static:         false,
								Final:          false,
							},
						},
					},
					types.JavaClass{
						Name:       []byte("A"),
						Implements: nil,
						Extends:    nil,
						Variables: []types.JavaVariable{
							{
								Type:           []byte("Test"),
								Name:           []byte("inner1"),
								Value:          []byte(""),
								AccessModifier: []byte(""),
								Static:         false,
								Final:          false,
							},
							{
								Type:           []byte("Testing"),
								Name:           []byte("inner2"),
								Value:          []byte("new Testing()"),
								AccessModifier: []byte("public"),
								Static:         false,
								Final:          false,
							},
							{
								Type:           []byte("Test.Yes"),
								Name:           []byte("inner3"),
								Value:          []byte("new Testing()"),
								AccessModifier: []byte("private"),
								Static:         true,
								Final:          false,
							},
							{
								Type:           []byte("Test.Yes"),
								Name:           []byte("inner4"),
								Value:          []byte("\"Hello\""),
								AccessModifier: []byte("protected"),
								Static:         false,
								Final:          true,
							},
							{
								Type:           []byte("Test.Yes"),
								Name:           []byte("inner5"),
								Value:          []byte("null"),
								AccessModifier: []byte(""),
								Static:         true,
								Final:          true,
							},
							{
								Type:           []byte("Test.Yes"),
								Name:           []byte("inner6"),
								Value:          []byte("null"),
								AccessModifier: []byte("protected"),
								Static:         true,
								Final:          true,
							},
						},
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("main"),
								AccessModifier: []byte("public"),
								Parameters: []types.JavaMethodParameter{
									{
										Type: []byte("String[]"),
										Name: []byte("args"),
									},
								},
								Abstract: false,
								Static:   true,
								Final:    false,
							},
							{
								Type:           []byte("Testing"),
								Name:           []byte("function1"),
								AccessModifier: []byte(""),
								Parameters: []types.JavaMethodParameter{
									{
										Type: []byte("Test.Yes"),
										Name: []byte("var1"),
									},
									{
										Type: []byte("Test"),
										Name: []byte("var2"),
									},
								},
								Abstract: false,
								Static:   false,
								Final:    false,
							},
							{
								Type:           []byte("Testing"),
								Name:           []byte("function2"),
								AccessModifier: []byte(""),
								Parameters:     nil,
								Abstract:       false,
								Static:         false,
								Final:          false,
							},
							{
								Type:           []byte("void"),
								Name:           []byte("function3"),
								AccessModifier: []byte(""),
								Parameters:     nil,
								Abstract:       true,
								Static:         false,
								Final:          false,
							},
							{
								Type:           []byte("Testing"),
								Name:           []byte("function4"),
								AccessModifier: []byte(""),
								Parameters:     nil,
								Abstract:       false,
								Static:         true,
								Final:          false,
							},
							{
								Type:           []byte("Testing"),
								Name:           []byte("function5"),
								AccessModifier: []byte(""),
								Parameters:     nil,
								Abstract:       false,
								Static:         false,
								Final:          true,
							},
							{
								Type:           []byte("void"),
								Name:           []byte("function6"),
								AccessModifier: []byte(""),
								Parameters:     nil,
								Abstract:       false,
								Static:         true,
								Final:          true,
							},
							{
								Type:           []byte("void"),
								Name:           []byte("function7"),
								AccessModifier: []byte("public"),
								Parameters:     nil,
								Abstract:       true,
								Static:         false,
								Final:          false,
							},
							{
								Type:           []byte("Testing"),
								Name:           []byte("function8"),
								AccessModifier: []byte("private"),
								Parameters:     nil,
								Abstract:       false,
								Static:         true,
								Final:          false,
							},
							{
								Type:           []byte("Testing"),
								Name:           []byte("function9"),
								AccessModifier: []byte("protected"),
								Parameters:     nil,
								Abstract:       false,
								Static:         false,
								Final:          true,
							},
							{
								Type:           []byte("void"),
								Name:           []byte("function10"),
								AccessModifier: []byte("public"),
								Parameters:     nil,
								Abstract:       false,
								Static:         true,
								Final:          true,
							},
						},
						Invokes: [][]byte{
							[]byte("Testing"),
						},
					},
				},
			},
			Err: nil,
		},
	}

	for testIndex, tt := range tests {
		t.Run(tt.Name, func(subtest *testing.T) {
			actualOutput, err := parseFile(tt.Input)

			if !errors.Is(err, tt.Err) {
				subtest.Errorf("incorrect error")
			}

			if err != nil {
				return
			}

			if !bytes.Equal(actualOutput.Package, tt.Output.Package) {
				subtest.Errorf("testIndex: %s. incorrect package.\ngot:\n%s\nneed:\n%s\n", strconv.Itoa(testIndex), string(actualOutput.Package), string(tt.Output.Package))
			}

			if len(actualOutput.Data) != len(tt.Output.Data) {
				subtest.Errorf("incorrect number of classes.\nExpected %s. Got %s\n", strconv.Itoa(len(tt.Output.Data)), strconv.Itoa(len(actualOutput.Data)))
				subtest.FailNow()
			}

			if !errors.Is(err, tt.Err) {
				subtest.Errorf("incorrect error on test %s", strconv.Itoa(testIndex))
			}

			if err != nil {
				return
			}

			if len(actualOutput.Data) != len(tt.Output.Data) {
				subtest.Errorf("incorrect number of classes.\nExpected %s. Got %s\n", strconv.Itoa(len(tt.Output.Data)), strconv.Itoa(len(actualOutput.Data)))
				subtest.FailNow()
			}

			for i, class := range actualOutput.Data {
				switch response := class.(type) {
				case types.JavaAbstract:
					switch expected := tt.Output.Data[i].(type) {
					case types.JavaAbstract:
						if !bytes.Equal(response.Name, expected.Name) {
							subtest.Errorf("incorrect class name on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.Name, response.Name)
						} else if !bytes.Equal(response.DefinedWithin, expected.DefinedWithin) {
							subtest.Errorf("incorrect defined within on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.DefinedWithin, response.DefinedWithin)
						}

						subtest.Logf("class name: %s\n", string(response.Name))
						if len(expected.Extends) != len(response.Extends) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Extends)), strconv.Itoa(len(response.Extends)))
							subtest.FailNow()
						} else if len(expected.Implements) != len(response.Implements) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Implements)), strconv.Itoa(len(response.Implements)))
							subtest.FailNow()
						} else if len(expected.Variables) != len(response.Variables) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Variables)), strconv.Itoa(len(response.Variables)))
							subtest.FailNow()
						} else if len(expected.Methods) != len(response.Methods) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods)), strconv.Itoa(len(response.Methods)))
							subtest.FailNow()
						} else if len(expected.Invokes) != len(response.Invokes) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Invokes)), strconv.Itoa(len(response.Invokes)))
							subtest.FailNow()
						}

						for index, word := range expected.Extends {
							if !bytes.Equal(response.Extends[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(word), string(response.Extends[index]))
							}
						}

						for index, word := range expected.Implements {
							if !bytes.Equal(response.Implements[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(word), string(response.Implements[index]))
							}
						}

						for index, variable := range expected.Variables {
							if !bytes.Equal(expected.Variables[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Variables[index].Type))
							} else if !bytes.Equal(expected.Variables[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Variables[index].Name))
							} else if !bytes.Equal(expected.Variables[index].Value, variable.Value) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Value), string(response.Variables[index].Value))
							} else if !bytes.Equal(expected.Variables[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Variables[index].AccessModifier))
							} else if expected.Variables[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Variables[index].Static)
							} else if expected.Variables[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Variables[index].Final)
							}
						}

						for index, variable := range expected.Methods {
							if !bytes.Equal(expected.Methods[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Methods[index].Type))
							} else if !bytes.Equal(expected.Methods[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Methods[index].Name))
							} else if !bytes.Equal(expected.Methods[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Methods[index].AccessModifier))
							} else if expected.Methods[index].Abstract != variable.Abstract {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Abstract, response.Methods[index].Abstract)
							} else if expected.Methods[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Methods[index].Static)
							} else if expected.Methods[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Methods[index].Final)
							}

							if len(expected.Methods[index].Parameters) != len(variable.Parameters) {
								subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods[index].Parameters)), strconv.Itoa(len(variable.Parameters)))
								subtest.FailNow()
							}

							for indexParam, parameter := range variable.Parameters {
								if !bytes.Equal(expected.Methods[index].Parameters[indexParam].Type, parameter.Type) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Type), string(response.Methods[index].Parameters[indexParam].Type))
								} else if !bytes.Equal(expected.Methods[index].Parameters[indexParam].Name, parameter.Name) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Name), string(response.Methods[index].Parameters[indexParam].Type))
								}
							}
						}

						for index, variable := range expected.Invokes {
							if !bytes.Equal(expected.Invokes[index], variable) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable), string(response.Invokes[index]))
							}
						}
					default:
						subtest.Errorf("incorrect response type")
					}

				case types.JavaClass:
					switch expected := tt.Output.Data[i].(type) {
					case types.JavaClass:
						if !bytes.Equal(response.Name, expected.Name) {
							subtest.Errorf("incorrect class name on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.Name, response.Name)
						} else if !bytes.Equal(response.DefinedWithin, expected.DefinedWithin) {
							subtest.Errorf("incorrect defined within on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.DefinedWithin, response.DefinedWithin)
						}

						subtest.Logf("class name: %s\n", string(response.Name))
						if len(expected.Extends) != len(response.Extends) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Extends)), strconv.Itoa(len(response.Extends)))
							subtest.FailNow()
						} else if len(expected.Implements) != len(response.Implements) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Implements)), strconv.Itoa(len(response.Implements)))
							subtest.FailNow()
						} else if len(expected.Variables) != len(response.Variables) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Variables)), strconv.Itoa(len(response.Variables)))
							subtest.FailNow()
						} else if len(expected.Methods) != len(response.Methods) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods)), strconv.Itoa(len(response.Methods)))
							subtest.FailNow()
						} else if len(expected.Invokes) != len(response.Invokes) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Invokes)), strconv.Itoa(len(response.Invokes)))
							subtest.FailNow()
						}

						for index, word := range expected.Extends {
							if !bytes.Equal(response.Extends[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(word), string(response.Extends[index]))
							}
						}

						for index, word := range expected.Implements {
							if !bytes.Equal(response.Implements[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(word), string(response.Implements[index]))
							}
						}

						for index, variable := range expected.Variables {
							if !bytes.Equal(expected.Variables[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Variables[index].Type))
							} else if !bytes.Equal(expected.Variables[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Variables[index].Name))
							} else if !bytes.Equal(expected.Variables[index].Value, variable.Value) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Value), string(response.Variables[index].Value))
							} else if !bytes.Equal(expected.Variables[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Variables[index].AccessModifier))
							} else if expected.Variables[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Variables[index].Static)
							} else if expected.Variables[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Variables[index].Final)
							}
						}

						for index, variable := range expected.Methods {
							if !bytes.Equal(expected.Methods[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Methods[index].Type))
							} else if !bytes.Equal(expected.Methods[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Methods[index].Name))
							} else if !bytes.Equal(expected.Methods[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Methods[index].AccessModifier))
							} else if expected.Methods[index].Abstract != variable.Abstract {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Abstract, response.Methods[index].Abstract)
							} else if expected.Methods[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Methods[index].Static)
							} else if expected.Methods[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Methods[index].Final)
							}

							if len(expected.Methods[index].Parameters) != len(variable.Parameters) {
								subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods[index].Parameters)), strconv.Itoa(len(variable.Parameters)))
								subtest.FailNow()
							}

							for indexParam, parameter := range variable.Parameters {
								if !bytes.Equal(expected.Methods[index].Parameters[indexParam].Type, parameter.Type) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Type), string(response.Methods[index].Parameters[indexParam].Type))
								} else if !bytes.Equal(expected.Methods[index].Parameters[indexParam].Name, parameter.Name) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Name), string(response.Methods[index].Parameters[indexParam].Type))
								}
							}
						}

						for index, variable := range expected.Invokes {
							if !bytes.Equal(expected.Invokes[index], variable) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable), string(response.Invokes[index]))
							}
						}
					default:
						subtest.Errorf("incorrect response type")
					}

				case types.JavaInterface:
					switch expected := tt.Output.Data[i].(type) {
					case types.JavaInterface:
						if !bytes.Equal(response.Name, expected.Name) {
							subtest.Errorf("incorrect class name on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.Name, response.Name)
						} else if !bytes.Equal(response.DefinedWithin, expected.DefinedWithin) {
							subtest.Errorf("incorrect defined within on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.DefinedWithin, response.DefinedWithin)
						}

						subtest.Logf("class name: %s\n", string(response.Name))
						if len(expected.Extends) != len(response.Extends) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Extends)), strconv.Itoa(len(response.Extends)))
							subtest.FailNow()
						} else if len(expected.Variables) != len(response.Variables) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Variables)), strconv.Itoa(len(response.Variables)))
							subtest.FailNow()
						} else if len(expected.Methods) != len(response.Methods) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods)), strconv.Itoa(len(response.Methods)))
							subtest.FailNow()
						}

						for index, word := range expected.Extends {
							if !bytes.Equal(response.Extends[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(word), string(response.Extends[index]))
							}
						}

						for index, variable := range expected.Variables {
							if !bytes.Equal(expected.Variables[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Variables[index].Type))
							} else if !bytes.Equal(expected.Variables[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Variables[index].Name))
							} else if !bytes.Equal(expected.Variables[index].Value, variable.Value) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Value), string(response.Variables[index].Value))
							} else if !bytes.Equal(expected.Variables[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Variables[index].AccessModifier))
							} else if expected.Variables[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Variables[index].Static)
							} else if expected.Variables[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Variables[index].Final)
							}
						}

						for index, variable := range expected.Methods {
							if !bytes.Equal(expected.Methods[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Methods[index].Type))
							} else if !bytes.Equal(expected.Methods[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Methods[index].Name))
							} else if !bytes.Equal(expected.Methods[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Methods[index].AccessModifier))
							} else if expected.Methods[index].Abstract != variable.Abstract {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Abstract, response.Methods[index].Abstract)
							} else if expected.Methods[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Methods[index].Static)
							} else if expected.Methods[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Methods[index].Final)
							}

							if len(expected.Methods[index].Parameters) != len(variable.Parameters) {
								subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods[index].Parameters)), strconv.Itoa(len(variable.Parameters)))
								subtest.FailNow()
							}

							for indexParam, parameter := range variable.Parameters {
								if !bytes.Equal(expected.Methods[index].Parameters[indexParam].Type, parameter.Type) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Type), string(response.Methods[index].Parameters[indexParam].Type))
								} else if !bytes.Equal(expected.Methods[index].Parameters[indexParam].Name, parameter.Name) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Name), string(response.Methods[index].Parameters[indexParam].Type))
								}
							}
						}
					default:
						subtest.Errorf("incorrect response type")
					}

				case types.JavaEnum:
				default:
					subtest.Errorf("cannot get language response")
					subtest.Fail()
				}
			}
		})
	}
}

func TestRemoveComments(t *testing.T) {
	test1 := types.TestByteSlice{
		Name:   "invalid - empty file",
		Input:  nil,
		Output: nil,
		Err:    &types.CannotParseText{},
	}

	test2 := types.TestByteSlice{
		Name:   "valid - multi line commment",
		Input:  []byte(`/* IOEWJQIOJE */System.out.println('Hello Java');`),
		Output: []byte(`System.out.println('Hello Java');`),
		Err:    nil,
	}

	test3 := types.TestByteSlice{
		Name: "valid - test class 3",
		Input: []byte(`
			// Hello   // qwmeiqw //wqeqweqw
			public class Test {
				/// WEI0ojqwoije
				public static void main(String[] args) {
					// wjqiehnwijken
					System.out.println('Hello Java'); // UIEHQW

					/* IOEWJQIOJE
						*
						* wopqkepoqk
						* q
						* q
						* q
						*
						*/ System.out.println('Hello Java');
				}

				/*
					* Hello
					*/
										}   `),
		Output: []byte(`
			
			public class Test {
				
				public static void main(String[] args) {
					
					System.out.println('Hello Java'); 

					 System.out.println('Hello Java');
				}

				
										}   `),
		Err: nil,
	}

	test4 := types.TestByteSlice{
		Name: "valid - test class 4",
		Input: []byte(`
			// Hello   // qwmeiqw //wqeqweqw
			public class Test {
				/// WEI0ojqwoije
				public static void main(String[] args) {
					// wjqiehnwijken
					System.out.println('Hello // Java'); // UIEHQW

					/* IOEWJQIOJE
						*
						* wopqkepoqk
						* q
						* q
						* q
						*
						*/ System.out.println('Hello Java');
				}

				/*
					* Hello
					*/
										}   `),
		Output: []byte(`
			
			public class Test {
				
				public static void main(String[] args) {
					
					System.out.println('Hello // Java'); 

					 System.out.println('Hello Java');
				}

				
										}   `),
		Err: nil,
	}

	test5 := types.TestByteSlice{
		Name: "valid - test class 5",
		Input: []byte(`   package com.houarizegai.calculator  ;

		import java.awt.Cursor;
		import java.awt.Font;
		import java.awt.event.ActionListener;
		import java.awt.event.ItemEvent;
		import java.util.function.Consumer;
		import java.util.regex.Pattern;
		import java.awt.Color;
		import javax.swing.*;
		import java.lang.Math;
			// Hello   // qwmeiqw //wqeqweqw
			public class Test {
				/// WEI0ojqwoije
				public static void main(String[] args) {
					// wjqiehnwijken
					System.out.println('Hello /* wmkqoem */ Java'); // UIEHQW

					/* IOEWJQIOJE
						*
						* wopqkepoqk
						* q
						* q
						* q
						*
						*/ System.out.println('Hello Java');
				}

				/*
					* Hello
					*/
										}   `),
		Output: []byte(`   package com.houarizegai.calculator  ;

		import java.awt.Cursor;
		import java.awt.Font;
		import java.awt.event.ActionListener;
		import java.awt.event.ItemEvent;
		import java.util.function.Consumer;
		import java.util.regex.Pattern;
		import java.awt.Color;
		import javax.swing.*;
		import java.lang.Math;
			
			public class Test {
				
				public static void main(String[] args) {
					
					System.out.println('Hello /* wmkqoem */ Java'); 

					 System.out.println('Hello Java');
				}

				
										}   `),
		Err: nil,
	}

	var tests = []types.TestByteSlice{test1, test2, test3, test4, test5}

	for _, tt := range tests {
		t.Run(tt.Name, func(subtest *testing.T) {
			res, err := removeComments(tt.Input)

			if !bytes.Equal(res, tt.Output) {
				subtest.Errorf("incorrect response.\ngot:\n%s\nneed:\n%s\n", string(res), string(tt.Output))
			}

			if !errors.Is(err, tt.Err) {
				subtest.Errorf("incorrect error")
			}

		})
	}
}

func TestGetPackageName(t *testing.T) {
	test1 := types.TestByteSlice{
		Name:   "invalid - empty file",
		Input:  nil,
		Output: nil,
		Err:    &types.CannotParseText{},
	}

	test2 := types.TestByteSlice{
		Name: "valid - has package",
		Input: []byte(`   package com.houarizegai.calculator  ;

		import java.awt.Cursor;
		import java.awt.Font;
		import java.awt.event.ActionListener;
		import java.awt.event.ItemEvent;
		import java.util.function.Consumer;
		import java.util.regex.Pattern;
		import java.awt.Color;
		import javax.swing.*;
		import java.lang.Math;
		
		public class Calculator {
		
			private static final int WINDOW_WIDTH = 410;
			private static final int WINDOW_HEIGHT = 600;
			private static final int BUTTON_WIDTH = 80;
		}`),
		Output: []byte("com.houarizegai.calculator"),
		Err:    nil,
	}

	test3 := types.TestByteSlice{
		Name: "valid - no package",
		Input: []byte(` 

		import java.awt.Cursor;
		import java.awt.Font;
		import java.awt.event.ActionListener;
		import java.awt.event.ItemEvent;
		import java.util.function.Consumer;
		import java.util.regex.Pattern;
		import java.awt.Color;
		import javax.swing.*;
		import java.lang.Math;
		
		public class Calculator {
		
			private static final int WINDOW_WIDTH = 410;
			private static final int WINDOW_HEIGHT = 600;
			private static final int BUTTON_WIDTH = 80;
		}`),
		Output: nil,
		Err:    nil,
	}

	test4 := types.TestByteSlice{
		Name: "valid - has package inside inner scope",
		Input: []byte(` 

		import java.awt.Cursor;
		import java.awt.Font;
		import java.awt.event.ActionListener;
		import java.awt.event.ItemEvent;
		import java.util.function.Consumer;
		import java.util.regex.Pattern;
		import java.awt.Color;
		import javax.swing.*;
		import java.lang.Math;
		
		public class Calculator {package com.houarizegai.calculator  ;
		
			private static final int WINDOW_WIDTH = 410;
			private static final int WINDOW_HEIGHT = 600;
			private static final int BUTTON_WIDTH = 80;
		}`),
		Output: nil,
		Err:    nil,
	}

	var tests = []types.TestByteSlice{test1, test2, test3, test4}

	for _, tt := range tests {
		t.Run(tt.Name, func(subtest *testing.T) {
			res, err := getPackageName(tt.Input)

			if !bytes.Equal(res, tt.Output) {
				subtest.Errorf("incorrect response.\ngot:\n%s\nneed:\n%s\n", string(res), string(tt.Output))
			}

			if !errors.Is(err, tt.Err) {
				subtest.Errorf("incorrect error")
			}
		})
	}
}

func TestRemoveSpacing(t *testing.T) {
	test1 := types.TestByteSlice{
		Name:   "invalid - empty file",
		Input:  nil,
		Output: nil,
		Err:    &types.CannotParseText{},
	}

	test2 := types.TestByteSlice{
		Name: "valid - test class",
		Input: []byte(`
			
		public class Test {
			
			public static void main(String[] args) {
				
				System.out.println('Hello'); 

				 System.out.println('Hello'); 
			}

			
									}   `),
		Output: []byte("public class Test{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
		Err:    nil,
	}

	test3 := types.TestByteSlice{
		Name: "valid - test class",
		Input: []byte(`
			
		public class Test2 {
			String var1;
			String var2 = "Hello";
			String var3 = "Hello", var4;
			String  var5   =   "Hello"  ,   var6 = "Hello" , var7  ;
		
			Test2() {
				this.var4 = "J";
				System.out.println("Hello");
		
			}
		}`),
		Output: []byte("public class Test2{String var1;String var2 = \"Hello\";String var3 = \"Hello\",var4;String var5 = \"Hello\",var6 = \"Hello\",var7;Test2(){this.var4 = \"J\";System.out.println(\"Hello\");}}"),
		Err:    nil,
	}

	var tests = []types.TestByteSlice{test1, test2, test3}

	for _, tt := range tests {
		t.Run(tt.Name, func(subtest *testing.T) {
			res, err := removeSpacing(tt.Input)

			if !bytes.Equal(res, tt.Output) {
				subtest.Errorf("incorrect response.\ngot:\n%s\nneed:\n%s\n", string(res), string(tt.Output))
			}

			if !errors.Is(err, tt.Err) {
				subtest.Errorf("incorrect error")
			}
		})
	}
}

func TestGetFileClasses(t *testing.T) {
	test1 := types.TestFileResponse{
		Name: "invalid - no code inside file",
		Input: types.File{
			Name:      "Test1",
			Extension: "java",
			Code:      nil,
		},
		Output: &types.FileResponse{
			Package: []byte(""),
			Data:    nil,
		},
		Err: &types.CannotParseText{},
	}

	test2 := types.TestFileResponse{
		Name: "valid - includes package, import, class",
		Input: types.File{
			Name:      "Test2",
			Extension: "java",
			Code:      []byte("package com.houarizegai.calculator;import java.awt.Cursor;public class Test2{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
		},
		Output: &types.FileResponse{
			Package: []byte(""),
			Data: []any{
				types.JavaClass{
					Name: []byte("Test2"),
					Methods: []types.JavaMethod{
						{
							Type:           []byte("void"),
							Name:           []byte("main"),
							AccessModifier: []byte("public"),
							Parameters: []types.JavaMethodParameter{
								{
									Type: []byte("String[]"),
									Name: []byte("args"),
								},
							},
							Abstract: false,
							Static:   true,
							Final:    false,
						},
					},
				},
			},
		},
		Err: nil,
	}

	test3 := types.TestFileResponse{
		Name: "valid - includes package, class",
		Input: types.File{
			Name:      "Test3",
			Extension: "java",
			Code:      []byte("package com.houarizegai.calculator;public class Test3{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
		},
		Output: &types.FileResponse{
			Package: []byte(""),
			Data: []any{
				types.JavaClass{
					Name: []byte("Test3"),
					Methods: []types.JavaMethod{
						{
							Type:           []byte("void"),
							Name:           []byte("main"),
							AccessModifier: []byte("public"),
							Parameters: []types.JavaMethodParameter{
								{
									Type: []byte("String[]"),
									Name: []byte("args"),
								},
							},
							Abstract: false,
							Static:   true,
							Final:    false,
						},
					},
				},
			},
		},
		Err: nil,
	}

	test4 := types.TestFileResponse{
		Name: "valid - includes package, import",
		Input: types.File{
			Name:      "Test4",
			Extension: "java",
			Code:      []byte("import java.awt.Cursor;public class Test4{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
		},
		Output: &types.FileResponse{
			Package: []byte(""),
			Data: []any{
				types.JavaClass{
					Name: []byte("Test4"),
					Methods: []types.JavaMethod{
						{
							Type:           []byte("void"),
							Name:           []byte("main"),
							AccessModifier: []byte("public"),
							Parameters: []types.JavaMethodParameter{
								{
									Type: []byte("String[]"),
									Name: []byte("args"),
								},
							},
							Abstract: false,
							Static:   true,
							Final:    false,
						},
					},
				},
			},
		},
		Err: nil,
	}

	test5 := types.TestFileResponse{
		Name: "valid - includes class",
		Input: types.File{
			Name:      "Test5",
			Extension: "java",
			Code:      []byte("public class Test5{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
		},
		Output: &types.FileResponse{
			Package: []byte(""),
			Data: []any{
				types.JavaClass{
					Name: []byte("Test5"),
					Methods: []types.JavaMethod{
						{
							Type:           []byte("void"),
							Name:           []byte("main"),
							AccessModifier: []byte("public"),
							Parameters: []types.JavaMethodParameter{
								{
									Type: []byte("String[]"),
									Name: []byte("args"),
								},
							},
							Abstract: false,
							Static:   true,
							Final:    false,
						},
					},
				},
			},
		},
		Err: nil,
	}

	test6 := types.TestFileResponse{
		Name: "valid - includes class, extends",
		Input: types.File{
			Name:      "Test6",
			Extension: "java",
			Code:      []byte("public class Test6 extends Test,Hello,Yes{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
		},
		Output: &types.FileResponse{
			Package: []byte(""),
			Data: []any{
				types.JavaClass{
					Name:    []byte("Test6"),
					Extends: [][]byte{[]byte("Test"), []byte("Hello"), []byte("Yes")},
					Methods: []types.JavaMethod{
						{
							Type:           []byte("void"),
							Name:           []byte("main"),
							AccessModifier: []byte("public"),
							Parameters: []types.JavaMethodParameter{
								{
									Type: []byte("String[]"),
									Name: []byte("args"),
								},
							},
							Abstract: false,
							Static:   true,
							Final:    false,
						},
					},
				},
			},
		},
		Err: nil,
	}

	test7 := types.TestFileResponse{
		Name: "valid - includes class, extends",
		Input: types.File{
			Name:      "A",
			Extension: "java",
			Code:      []byte("import java.util.*;class Test{protected interface Yes{void show();}public void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{public static void main(String[] args){Test.Yes obj;Testing t = new Testing();obj=t;obj.show();}}"),
		},
		Output: &types.FileResponse{
			Package: []byte(""),
			Data: []any{
				types.JavaClass{
					Name: []byte("Test"),
					Methods: []types.JavaMethod{
						{
							Type:           []byte("void"),
							Name:           []byte("Test"),
							AccessModifier: []byte("public"),
							Parameters:     nil,
							Abstract:       false,
							Static:         true,
							Final:          false,
						},
					},
				},
				types.JavaInterface{
					DefinedWithin: []byte("Test"),
					Name:          []byte("Yes"),
					Methods: []types.JavaMethod{
						{
							Type:           []byte("void"),
							Name:           []byte("show"),
							AccessModifier: []byte(""),
							Parameters:     nil,
							Abstract:       false,
							Static:         false,
							Final:          false,
						},
					},
				},
				types.JavaClass{
					Name:       []byte("Testing"),
					Implements: [][]byte{[]byte("Test.Yes")},
					Methods: []types.JavaMethod{
						{
							Type:           []byte("void"),
							Name:           []byte("show"),
							AccessModifier: []byte("public"),
							Parameters:     nil,
							Abstract:       false,
							Static:         false,
							Final:          false,
						},
					},
				},
				types.JavaClass{
					Name: []byte("A"),
					Methods: []types.JavaMethod{
						{
							Type:           []byte("void"),
							Name:           []byte("main"),
							AccessModifier: []byte("public"),
							Parameters: []types.JavaMethodParameter{
								{
									Type: []byte("String[]"),
									Name: []byte("args"),
								},
							},
							Abstract: false,
							Static:   true,
							Final:    false,
						},
					},
					Invokes: [][]byte{
						[]byte("Testing"),
					},
				},
			},
		},
		Err: nil,
	}

	test8 := types.TestFileResponse{
		Name: "valid - includes class, extends",
		Input: types.File{
			Name:      "A",
			Extension: "java",
			Code:      []byte("import java.util.*;class Test{protected interface Yes{void show();}public void TestVoid(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{Test inner1;public Testing inner2 = new Testing();private static Test.Yes inner3 = new Testing();protected final Test.Yes inner4 = \"Hello\";static final Test.Yes inner5 = null;protected static final Test.Yes inner6 = null;public static void main(String[] args){Test.Yes obj;Testing t = new Testing();obj = t;obj.show();}Testing function1(Test.Yes var1, Test var2){};Testing function2();abstract void function3(){};static Testing function4(){}final Testing function5();static final void function6(){};public abstract void function7();private static Testing function8(){};protected final Testing function9(){};public static final void function10(){};}"),
		},
		Output: &types.FileResponse{
			Package: []byte(""),
			Data: []any{
				types.JavaClass{
					Name:       []byte("Test"),
					Implements: nil,
					Extends:    nil,
					Variables:  nil,
					Methods: []types.JavaMethod{
						{
							Type:           []byte("void"),
							Name:           []byte("TestVoid"),
							AccessModifier: []byte("public"),
							Parameters:     nil,
							Abstract:       false,
							Static:         false,
							Final:          false,
						},
					},
				},
				types.JavaInterface{
					DefinedWithin: []byte("Test"),
					Name:          []byte("Yes"),
					Extends:       nil,
					Variables:     nil,
					Methods: []types.JavaMethod{
						{
							Type:           []byte("void"),
							Name:           []byte("show"),
							AccessModifier: []byte(""),
							Parameters:     nil,
							Abstract:       false,
							Static:         false,
							Final:          false,
						},
					},
				},
				types.JavaClass{
					Name:       []byte("Testing"),
					Implements: [][]byte{[]byte("Test.Yes")},
					Extends:    nil,
					Variables:  nil,
					Methods: []types.JavaMethod{
						{
							Type:           []byte("void"),
							Name:           []byte("show"),
							AccessModifier: []byte(""),
							Parameters:     nil,
							Abstract:       false,
							Static:         false,
							Final:          false,
						},
					},
				},
				types.JavaClass{
					Name:       []byte("A"),
					Implements: nil,
					Extends:    nil,
					Variables: []types.JavaVariable{
						{
							Type:           []byte("Test"),
							Name:           []byte("inner1"),
							Value:          []byte(""),
							AccessModifier: []byte(""),
							Static:         false,
							Final:          false,
						},
						{
							Type:           []byte("Testing"),
							Name:           []byte("inner2"),
							Value:          []byte("new Testing()"),
							AccessModifier: []byte("public"),
							Static:         false,
							Final:          false,
						},
						{
							Type:           []byte("Test.Yes"),
							Name:           []byte("inner3"),
							Value:          []byte("new Testing()"),
							AccessModifier: []byte("private"),
							Static:         true,
							Final:          false,
						},
						{
							Type:           []byte("Test.Yes"),
							Name:           []byte("inner4"),
							Value:          []byte("\"Hello\""),
							AccessModifier: []byte("protected"),
							Static:         false,
							Final:          true,
						},
						{
							Type:           []byte("Test.Yes"),
							Name:           []byte("inner5"),
							Value:          []byte("null"),
							AccessModifier: []byte(""),
							Static:         true,
							Final:          true,
						},
						{
							Type:           []byte("Test.Yes"),
							Name:           []byte("inner6"),
							Value:          []byte("null"),
							AccessModifier: []byte("protected"),
							Static:         true,
							Final:          true,
						},
					},
					Methods: []types.JavaMethod{
						{
							Type:           []byte("void"),
							Name:           []byte("main"),
							AccessModifier: []byte("public"),
							Parameters: []types.JavaMethodParameter{
								{
									Type: []byte("String[]"),
									Name: []byte("args"),
								},
							},
							Abstract: false,
							Static:   true,
							Final:    false,
						},
						{
							Type:           []byte("Testing"),
							Name:           []byte("function1"),
							AccessModifier: []byte(""),
							Parameters: []types.JavaMethodParameter{
								{
									Type: []byte("Test.Yes"),
									Name: []byte("var1"),
								},
								{
									Type: []byte("Test"),
									Name: []byte("var2"),
								},
							},
							Abstract: false,
							Static:   false,
							Final:    false,
						},
						{
							Type:           []byte("Testing"),
							Name:           []byte("function2"),
							AccessModifier: []byte(""),
							Parameters:     nil,
							Abstract:       false,
							Static:         false,
							Final:          false,
						},
						{
							Type:           []byte("void"),
							Name:           []byte("function3"),
							AccessModifier: []byte(""),
							Parameters:     nil,
							Abstract:       true,
							Static:         false,
							Final:          false,
						},
						{
							Type:           []byte("Testing"),
							Name:           []byte("function4"),
							AccessModifier: []byte(""),
							Parameters:     nil,
							Abstract:       false,
							Static:         true,
							Final:          false,
						},
						{
							Type:           []byte("Testing"),
							Name:           []byte("function5"),
							AccessModifier: []byte(""),
							Parameters:     nil,
							Abstract:       false,
							Static:         false,
							Final:          true,
						},
						{
							Type:           []byte("void"),
							Name:           []byte("function6"),
							AccessModifier: []byte(""),
							Parameters:     nil,
							Abstract:       false,
							Static:         true,
							Final:          true,
						},
						{
							Type:           []byte("void"),
							Name:           []byte("function7"),
							AccessModifier: []byte("public"),
							Parameters:     nil,
							Abstract:       true,
							Static:         false,
							Final:          false,
						},
						{
							Type:           []byte("Testing"),
							Name:           []byte("function8"),
							AccessModifier: []byte("private"),
							Parameters:     nil,
							Abstract:       false,
							Static:         true,
							Final:          false,
						},
						{
							Type:           []byte("Testing"),
							Name:           []byte("function9"),
							AccessModifier: []byte("protected"),
							Parameters:     nil,
							Abstract:       false,
							Static:         false,
							Final:          true,
						},
						{
							Type:           []byte("void"),
							Name:           []byte("function10"),
							AccessModifier: []byte("public"),
							Parameters:     nil,
							Abstract:       false,
							Static:         true,
							Final:          true,
						},
					},
					Invokes: [][]byte{
						[]byte("Testing"),
					},
				},
			},
		},
		Err: nil,
	}

	var tests = []types.TestFileResponse{test1, test2, test3, test4, test5, test6, test7, test8}

	for testIndex, tt := range tests {
		t.Run(tt.Name, func(subtest *testing.T) {
			classes, err := getFileClasses(tt.Input.Name, tt.Input.Code)

			if !errors.Is(err, tt.Err) {
				subtest.Errorf("incorrect error on test %s", strconv.Itoa(testIndex))
			}

			if err != nil {
				return
			}

			if len(classes) != len(tt.Output.Data) {
				subtest.Errorf("incorrect number of classes.\nExpected %s. Got %s\n", strconv.Itoa(len(tt.Output.Data)), strconv.Itoa(len(classes)))
				subtest.FailNow()
			}

			for i, class := range classes {
				switch response := class.(type) {
				case types.JavaAbstract:
					switch expected := tt.Output.Data[i].(type) {
					case types.JavaAbstract:
						if !bytes.Equal(response.Name, expected.Name) {
							subtest.Errorf("incorrect class name on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.Name, response.Name)
						} else if !bytes.Equal(response.DefinedWithin, expected.DefinedWithin) {
							subtest.Errorf("incorrect defined within on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.DefinedWithin, response.DefinedWithin)
						}

						subtest.Logf("class name: %s\n", string(response.Name))
						if len(expected.Extends) != len(response.Extends) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Extends)), strconv.Itoa(len(response.Extends)))
							subtest.FailNow()
						} else if len(expected.Implements) != len(response.Implements) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Implements)), strconv.Itoa(len(response.Implements)))
							subtest.FailNow()
						} else if len(expected.Variables) != len(response.Variables) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Variables)), strconv.Itoa(len(response.Variables)))
							subtest.FailNow()
						} else if len(expected.Methods) != len(response.Methods) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods)), strconv.Itoa(len(response.Methods)))
							subtest.FailNow()
						} else if len(expected.Invokes) != len(response.Invokes) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Invokes)), strconv.Itoa(len(response.Invokes)))
							subtest.FailNow()
						}

						for index, word := range expected.Extends {
							if !bytes.Equal(response.Extends[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(word), string(response.Extends[index]))
							}
						}

						for index, word := range expected.Implements {
							if !bytes.Equal(response.Implements[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(word), string(response.Implements[index]))
							}
						}

						for index, variable := range expected.Variables {
							if !bytes.Equal(expected.Variables[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Variables[index].Type))
							} else if !bytes.Equal(expected.Variables[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Variables[index].Name))
							} else if !bytes.Equal(expected.Variables[index].Value, variable.Value) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Value), string(response.Variables[index].Value))
							} else if !bytes.Equal(expected.Variables[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Variables[index].AccessModifier))
							} else if expected.Variables[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Variables[index].Static)
							} else if expected.Variables[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Variables[index].Final)
							}
						}

						for index, variable := range expected.Methods {
							if !bytes.Equal(expected.Methods[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Methods[index].Type))
							} else if !bytes.Equal(expected.Methods[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Methods[index].Name))
							} else if !bytes.Equal(expected.Methods[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Methods[index].AccessModifier))
							} else if expected.Methods[index].Abstract != variable.Abstract {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Abstract, response.Methods[index].Abstract)
							} else if expected.Methods[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Methods[index].Static)
							} else if expected.Methods[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Methods[index].Final)
							}

							if len(expected.Methods[index].Parameters) != len(variable.Parameters) {
								subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods[index].Parameters)), strconv.Itoa(len(variable.Parameters)))
								subtest.FailNow()
							}

							for indexParam, parameter := range variable.Parameters {
								if !bytes.Equal(expected.Methods[index].Parameters[indexParam].Type, parameter.Type) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Type), string(response.Methods[index].Parameters[indexParam].Type))
								} else if !bytes.Equal(expected.Methods[index].Parameters[indexParam].Name, parameter.Name) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Name), string(response.Methods[index].Parameters[indexParam].Type))
								}
							}
						}

						for index, variable := range expected.Invokes {
							if !bytes.Equal(expected.Invokes[index], variable) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable), string(response.Invokes[index]))
							}
						}
					default:
						subtest.Errorf("incorrect response type")
					}

				case types.JavaClass:
					switch expected := tt.Output.Data[i].(type) {
					case types.JavaClass:
						if !bytes.Equal(response.Name, expected.Name) {
							subtest.Errorf("incorrect class name on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.Name, response.Name)
						} else if !bytes.Equal(response.DefinedWithin, expected.DefinedWithin) {
							subtest.Errorf("incorrect defined within on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.DefinedWithin, response.DefinedWithin)
						}

						subtest.Logf("class name: %s\n", string(response.Name))
						if len(expected.Extends) != len(response.Extends) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Extends)), strconv.Itoa(len(response.Extends)))
							subtest.FailNow()
						} else if len(expected.Implements) != len(response.Implements) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Implements)), strconv.Itoa(len(response.Implements)))
							subtest.FailNow()
						} else if len(expected.Variables) != len(response.Variables) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Variables)), strconv.Itoa(len(response.Variables)))
							subtest.FailNow()
						} else if len(expected.Methods) != len(response.Methods) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods)), strconv.Itoa(len(response.Methods)))
							subtest.FailNow()
						} else if len(expected.Invokes) != len(response.Invokes) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Invokes)), strconv.Itoa(len(response.Invokes)))
							subtest.FailNow()
						}

						for index, word := range expected.Extends {
							if !bytes.Equal(response.Extends[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(word), string(response.Extends[index]))
							}
						}

						for index, word := range expected.Implements {
							if !bytes.Equal(response.Implements[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(word), string(response.Implements[index]))
							}
						}

						for index, variable := range expected.Variables {
							if !bytes.Equal(expected.Variables[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Variables[index].Type))
							} else if !bytes.Equal(expected.Variables[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Variables[index].Name))
							} else if !bytes.Equal(expected.Variables[index].Value, variable.Value) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Value), string(response.Variables[index].Value))
							} else if !bytes.Equal(expected.Variables[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Variables[index].AccessModifier))
							} else if expected.Variables[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Variables[index].Static)
							} else if expected.Variables[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Variables[index].Final)
							}
						}

						for index, variable := range expected.Methods {
							if !bytes.Equal(expected.Methods[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Methods[index].Type))
							} else if !bytes.Equal(expected.Methods[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Methods[index].Name))
							} else if !bytes.Equal(expected.Methods[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Methods[index].AccessModifier))
							} else if expected.Methods[index].Abstract != variable.Abstract {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Abstract, response.Methods[index].Abstract)
							} else if expected.Methods[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Methods[index].Static)
							} else if expected.Methods[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Methods[index].Final)
							}

							if len(expected.Methods[index].Parameters) != len(variable.Parameters) {
								subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods[index].Parameters)), strconv.Itoa(len(variable.Parameters)))
								subtest.FailNow()
							}

							for indexParam, parameter := range variable.Parameters {
								if !bytes.Equal(expected.Methods[index].Parameters[indexParam].Type, parameter.Type) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Type), string(response.Methods[index].Parameters[indexParam].Type))
								} else if !bytes.Equal(expected.Methods[index].Parameters[indexParam].Name, parameter.Name) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Name), string(response.Methods[index].Parameters[indexParam].Type))
								}
							}
						}

						for index, variable := range expected.Invokes {
							if !bytes.Equal(expected.Invokes[index], variable) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable), string(response.Invokes[index]))
							}
						}
					default:
						subtest.Errorf("incorrect response type")
					}

				case types.JavaInterface:
					switch expected := tt.Output.Data[i].(type) {
					case types.JavaInterface:
						if !bytes.Equal(response.Name, expected.Name) {
							subtest.Errorf("incorrect class name on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.Name, response.Name)
						} else if !bytes.Equal(response.DefinedWithin, expected.DefinedWithin) {
							subtest.Errorf("incorrect defined within on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.DefinedWithin, response.DefinedWithin)
						}

						subtest.Logf("class name: %s\n", string(response.Name))
						if len(expected.Extends) != len(response.Extends) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Extends)), strconv.Itoa(len(response.Extends)))
							subtest.FailNow()
						} else if len(expected.Variables) != len(response.Variables) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Variables)), strconv.Itoa(len(response.Variables)))
							subtest.FailNow()
						} else if len(expected.Methods) != len(response.Methods) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods)), strconv.Itoa(len(response.Methods)))
							subtest.FailNow()
						}

						for index, word := range expected.Extends {
							if !bytes.Equal(response.Extends[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(word), string(response.Extends[index]))
							}
						}

						for index, variable := range expected.Variables {
							if !bytes.Equal(expected.Variables[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Variables[index].Type))
							} else if !bytes.Equal(expected.Variables[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Variables[index].Name))
							} else if !bytes.Equal(expected.Variables[index].Value, variable.Value) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Value), string(response.Variables[index].Value))
							} else if !bytes.Equal(expected.Variables[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Variables[index].AccessModifier))
							} else if expected.Variables[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Variables[index].Static)
							} else if expected.Variables[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Variables[index].Final)
							}
						}

						for index, variable := range expected.Methods {
							if !bytes.Equal(expected.Methods[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Methods[index].Type))
							} else if !bytes.Equal(expected.Methods[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Methods[index].Name))
							} else if !bytes.Equal(expected.Methods[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Methods[index].AccessModifier))
							} else if expected.Methods[index].Abstract != variable.Abstract {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Abstract, response.Methods[index].Abstract)
							} else if expected.Methods[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Methods[index].Static)
							} else if expected.Methods[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Methods[index].Final)
							}

							if len(expected.Methods[index].Parameters) != len(variable.Parameters) {
								subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods[index].Parameters)), strconv.Itoa(len(variable.Parameters)))
								subtest.FailNow()
							}

							for indexParam, parameter := range variable.Parameters {
								if !bytes.Equal(expected.Methods[index].Parameters[indexParam].Type, parameter.Type) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Type), string(response.Methods[index].Parameters[indexParam].Type))
								} else if !bytes.Equal(expected.Methods[index].Parameters[indexParam].Name, parameter.Name) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Name), string(response.Methods[index].Parameters[indexParam].Type))
								}
							}
						}
					default:
						subtest.Errorf("incorrect response type")
					}

				case types.JavaEnum:
				default:
					subtest.Errorf("cannot get language response")
					subtest.Fail()
				}
			}
		})
	}
}

func TestSplitVariablesAndMethods(t *testing.T) {
	type TestSplit struct {
		Input  []byte
		Output [][]byte
	}

	var tests = []TestSplit{
		{
			[]byte("public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}"),
			[][]byte{[]byte("public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}")},
		},
		{
			[]byte("void show();"),
			[][]byte{[]byte("void show();")},
		},
		{
			[]byte("public void show(){System.out.println('show method of interface');}"),
			[][]byte{[]byte("public void show(){System.out.println('show method of interface');}")},
		},
		{
			[]byte("public static void main(String[] args){Test.Yes obj;Testing t = new Testing();obj=t;obj.show();}"),
			[][]byte{[]byte("public static void main(String[] args){Test.Yes obj;Testing t = new Testing();obj=t;obj.show();}")},
		},
		{
			[]byte("protected interface Yes{void show();}public void TestVoid(){}"),
			[][]byte{
				[]byte("protected interface Yes{void show();}"),
				[]byte("public void TestVoid(){}"),
			},
		},
		{
			[]byte("void Hello(String var1, String var2);"),
			[][]byte{[]byte("void Hello(String var1, String var2);")},
		},
		{
			[]byte("String hello1, hello2;String bye1, bye2;"),
			[][]byte{
				[]byte("String hello1, hello2;"),
				[]byte("String bye1, bye2;"),
			},
		},
		{
			[]byte("Test inner1;public Testing inner2 = new Testing();private static Test.Yes inner3 = new Testing();protected final Test.Yes inner4 = \"Hello\";static final Test.Yes inner5 = null;protected static final Test.Yes inner6 = null;public static void main(String[] args){Test.Yes obj;Testing t = new Testing();obj = t;obj.show();}Testing function1(Test.Yes var1, Test var2){};Testing function2();abstract void function3(){};static Testing function4(){}final Testing function5();static final void function6(){};public abstract void function7();private static Testing function8(){};protected final Testing function9(){};public static final void function10(){};"),
			[][]byte{
				[]byte("Test inner1;"),
				[]byte("public Testing inner2 = new Testing();"),
				[]byte("private static Test.Yes inner3 = new Testing();"),
				[]byte("protected final Test.Yes inner4 = \"Hello\";"),
				[]byte("static final Test.Yes inner5 = null;"),
				[]byte("protected static final Test.Yes inner6 = null;"),
				[]byte("public static void main(String[] args){Test.Yes obj;Testing t = new Testing();obj = t;obj.show();}"),
				[]byte("Testing function1(Test.Yes var1, Test var2){};"),
				[]byte("Testing function2();"),
				[]byte("abstract void function3(){};"),
				[]byte("static Testing function4(){}"),
				[]byte("final Testing function5();"),
				[]byte("static final void function6(){};"),
				[]byte("public abstract void function7();"),
				[]byte("private static Testing function8(){};"),
				[]byte("protected final Testing function9(){};"),
				[]byte("public static final void function10(){};"),
			},
		},
	}

	for testIndex, tt := range tests {
		t.Run("Test index "+strconv.Itoa(testIndex), func(subtest *testing.T) {
			actualOutput := splitVariablesAndMethods(tt.Input)

			if len(tt.Output) != len(actualOutput) {
				subtest.Errorf("incorrect length.\ngot: %s\nneed: %s\n", strconv.Itoa(len(actualOutput)), strconv.Itoa(len(tt.Output)))
				subtest.FailNow()
			}

			for index, expected := range tt.Output {
				if !bytes.Equal(actualOutput[index], expected) {
					subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected), string(actualOutput[index]))
				}
			}
		})
	}
}

func TestGetVariablesOrMethod(t *testing.T) {
	type TestGetVarsOrMethod struct {
		Input           []byte
		VariablesOutput []types.JavaVariable
		MethodOutput    types.JavaMethod
	}

	var tests = []TestGetVarsOrMethod{
		{
			Input:           []byte("void function1();"),
			VariablesOutput: nil,
			MethodOutput: types.JavaMethod{
				Type:           []byte("void"),
				Name:           []byte("function1"),
				AccessModifier: []byte(""),
				Parameters:     nil,
				Abstract:       false,
				Static:         false,
				Final:          false,
			},
		},
		{
			Input:           []byte("void function2(){};"),
			VariablesOutput: nil,
			MethodOutput: types.JavaMethod{
				Type:           []byte("void"),
				Name:           []byte("function2"),
				AccessModifier: []byte(""),
				Parameters:     nil,
				Abstract:       false,
				Static:         false,
				Final:          false,
			},
		},
		{
			Input:           []byte("abstract void function3(){};"),
			VariablesOutput: nil,
			MethodOutput: types.JavaMethod{
				Type:           []byte("void"),
				Name:           []byte("function3"),
				AccessModifier: []byte(""),
				Parameters:     nil,
				Abstract:       true,
				Static:         false,
				Final:          false,
			},
		},
		{
			Input:           []byte("static Testing function4(){}"),
			VariablesOutput: nil,
			MethodOutput: types.JavaMethod{
				Type:           []byte("Testing"),
				Name:           []byte("function4"),
				AccessModifier: []byte(""),
				Parameters:     nil,
				Abstract:       false,
				Static:         true,
				Final:          false,
			},
		},
		{
			Input:           []byte("final Testing function5();"),
			VariablesOutput: nil,
			MethodOutput: types.JavaMethod{
				Type:           []byte("Testing"),
				Name:           []byte("function5"),
				AccessModifier: []byte(""),
				Parameters:     nil,
				Abstract:       false,
				Static:         false,
				Final:          true,
			},
		},
		{
			Input:           []byte("static final void function6(){};"),
			VariablesOutput: nil,
			MethodOutput: types.JavaMethod{
				Type:           []byte("void"),
				Name:           []byte("function6"),
				AccessModifier: []byte(""),
				Parameters:     nil,
				Abstract:       false,
				Static:         true,
				Final:          true,
			},
		},
		{
			Input:           []byte("public abstract void function7(String var1);"),
			VariablesOutput: nil,
			MethodOutput: types.JavaMethod{
				Type:           []byte("void"),
				Name:           []byte("function7"),
				AccessModifier: []byte("public"),
				Parameters: []types.JavaMethodParameter{
					{
						Type: []byte("String"),
						Name: []byte("var1"),
					},
				},
				Abstract: true,
				Static:   false,
				Final:    false,
			},
		},
		{
			Input:           []byte("private static Testing function8(String var1, String var2){};"),
			VariablesOutput: nil,
			MethodOutput: types.JavaMethod{
				Type:           []byte("Testing"),
				Name:           []byte("function8"),
				AccessModifier: []byte("private"),
				Parameters: []types.JavaMethodParameter{
					{
						Type: []byte("String"),
						Name: []byte("var1"),
					},
					{
						Type: []byte("String"),
						Name: []byte("var2"),
					},
				},
				Abstract: false,
				Static:   true,
				Final:    false,
			},
		},
		{
			Input:           []byte("protected final Testing function9(String var1, String var2){};"),
			VariablesOutput: nil,
			MethodOutput: types.JavaMethod{
				Type:           []byte("Testing"),
				Name:           []byte("function9"),
				AccessModifier: []byte("protected"),
				Parameters: []types.JavaMethodParameter{
					{
						Type: []byte("String"),
						Name: []byte("var1"),
					},
					{
						Type: []byte("String"),
						Name: []byte("var2"),
					},
				},
				Abstract: false,
				Static:   false,
				Final:    true,
			},
		},
		{
			Input:           []byte("public static final void function10(){};"),
			VariablesOutput: nil,
			MethodOutput: types.JavaMethod{
				Type:           []byte("void"),
				Name:           []byte("function10"),
				AccessModifier: []byte("public"),
				Parameters:     nil,
				Abstract:       false,
				Static:         true,
				Final:          true,
			},
		},
		{
			Input: []byte("String var;"),
			VariablesOutput: []types.JavaVariable{
				{
					Type:           []byte("String"),
					Name:           []byte("var"),
					Value:          []byte(""),
					AccessModifier: []byte(""),
					Static:         false,
					Final:          false,
				},
			},
			MethodOutput: types.JavaMethod{},
		},
		{
			Input: []byte("String var = \"Hello\";"),
			VariablesOutput: []types.JavaVariable{
				{
					Type:           []byte("String"),
					Name:           []byte("var"),
					Value:          []byte("\"Hello\""),
					AccessModifier: []byte(""),
					Static:         false,
					Final:          false,
				},
			},
			MethodOutput: types.JavaMethod{},
		},
		{
			Input: []byte("String var = 'Hello';"),
			VariablesOutput: []types.JavaVariable{
				{
					Type:           []byte("String"),
					Name:           []byte("var"),
					Value:          []byte("'Hello'"),
					AccessModifier: []byte(""),
					Static:         false,
					Final:          false,
				},
			},
			MethodOutput: types.JavaMethod{},
		},
		{
			Input: []byte("String var = `Hello`;"),
			VariablesOutput: []types.JavaVariable{
				{
					Type:           []byte("String"),
					Name:           []byte("var"),
					Value:          []byte("`Hello`"),
					AccessModifier: []byte(""),
					Static:         false,
					Final:          false,
				},
			},
			MethodOutput: types.JavaMethod{},
		},
		{
			Input: []byte("String var = '(Hello';"),
			VariablesOutput: []types.JavaVariable{
				{
					Type:           []byte("String"),
					Name:           []byte("var"),
					Value:          []byte("'(Hello'"),
					AccessModifier: []byte(""),
					Static:         false,
					Final:          false,
				},
			},
			MethodOutput: types.JavaMethod{},
		},
		{
			Input: []byte("Test var = new Test();"),
			VariablesOutput: []types.JavaVariable{
				{
					Type:           []byte("Test"),
					Name:           []byte("var"),
					Value:          []byte("new Test()"),
					AccessModifier: []byte(""),
					Static:         false,
					Final:          false,
				},
			},
			MethodOutput: types.JavaMethod{},
		},
		{
			Input: []byte("String var1,var2,var3;"),
			VariablesOutput: []types.JavaVariable{
				{
					Type:           []byte("String"),
					Name:           []byte("var1"),
					Value:          []byte(""),
					AccessModifier: []byte(""),
					Static:         false,
					Final:          false,
				},
				{
					Type:           []byte("String"),
					Name:           []byte("var2"),
					Value:          []byte(""),
					AccessModifier: []byte(""),
					Static:         false,
					Final:          false,
				},
				{
					Type:           []byte("String"),
					Name:           []byte("var3"),
					Value:          []byte(""),
					AccessModifier: []byte(""),
					Static:         false,
					Final:          false,
				},
			},
			MethodOutput: types.JavaMethod{},
		},
		{
			Input: []byte("String var1 = 'Hello',var2 = 'Hello',var3 = 'Hello';"),
			VariablesOutput: []types.JavaVariable{
				{
					Type:           []byte("String"),
					Name:           []byte("var1"),
					Value:          []byte("'Hello'"),
					AccessModifier: []byte(""),
					Static:         false,
					Final:          false,
				},
				{
					Type:           []byte("String"),
					Name:           []byte("var2"),
					Value:          []byte("'Hello'"),
					AccessModifier: []byte(""),
					Static:         false,
					Final:          false,
				},
				{
					Type:           []byte("String"),
					Name:           []byte("var3"),
					Value:          []byte("'Hello'"),
					AccessModifier: []byte(""),
					Static:         false,
					Final:          false,
				},
			},
			MethodOutput: types.JavaMethod{},
		},
		{
			Input: []byte("public static final String var1;"),
			VariablesOutput: []types.JavaVariable{
				{
					Type:           []byte("String"),
					Name:           []byte("var1"),
					Value:          []byte(""),
					AccessModifier: []byte("public"),
					Static:         true,
					Final:          true,
				},
			},
			MethodOutput: types.JavaMethod{},
		},
		{
			Input: []byte("public static String var1;"),
			VariablesOutput: []types.JavaVariable{
				{
					Type:           []byte("String"),
					Name:           []byte("var1"),
					Value:          []byte(""),
					AccessModifier: []byte("public"),
					Static:         true,
					Final:          false,
				},
			},
			MethodOutput: types.JavaMethod{},
		},
		{
			Input: []byte("public static String var1;"),
			VariablesOutput: []types.JavaVariable{
				{
					Type:           []byte("String"),
					Name:           []byte("var1"),
					Value:          []byte(""),
					AccessModifier: []byte("public"),
					Static:         true,
					Final:          false,
				},
			},
			MethodOutput: types.JavaMethod{},
		},
		{
			Input: []byte("public final String var1 = \"Yes\",var2 = \"No\",var3;"),
			VariablesOutput: []types.JavaVariable{
				{
					Type:           []byte("String"),
					Name:           []byte("var1"),
					Value:          []byte("\"Yes\""),
					AccessModifier: []byte("public"),
					Static:         false,
					Final:          true,
				},
				{
					Type:           []byte("String"),
					Name:           []byte("var2"),
					Value:          []byte("\"No\""),
					AccessModifier: []byte("public"),
					Static:         false,
					Final:          true,
				},
				{
					Type:           []byte("String"),
					Name:           []byte("var3"),
					Value:          []byte(""),
					AccessModifier: []byte("public"),
					Static:         false,
					Final:          true,
				},
			},
			MethodOutput: types.JavaMethod{},
		},
		{
			Input: []byte("static final String var1;"),
			VariablesOutput: []types.JavaVariable{
				{
					Type:           []byte("String"),
					Name:           []byte("var1"),
					Value:          []byte(""),
					AccessModifier: []byte(""),
					Static:         true,
					Final:          true,
				},
			},
			MethodOutput: types.JavaMethod{},
		},
		{
			Input: []byte("static String var1;"),
			VariablesOutput: []types.JavaVariable{
				{
					Type:           []byte("String"),
					Name:           []byte("var1"),
					Value:          []byte(""),
					AccessModifier: []byte(""),
					Static:         true,
					Final:          false,
				},
			},
			MethodOutput: types.JavaMethod{},
		},
		{
			Input: []byte("final String var1;"),
			VariablesOutput: []types.JavaVariable{
				{
					Type:           []byte("String"),
					Name:           []byte("var1"),
					Value:          []byte(""),
					AccessModifier: []byte(""),
					Static:         false,
					Final:          true,
				},
			},
			MethodOutput: types.JavaMethod{},
		},
	}

	for testIndex, tt := range tests {
		t.Run("Test index "+strconv.Itoa(testIndex), func(subtest *testing.T) {
			actualVariables, actualMethod := getVariablesOrMethod(tt.Input)

			if len(actualVariables) != len(tt.VariablesOutput) {
				subtest.Errorf("incorrect amount of variables.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(len(tt.VariablesOutput)), strconv.Itoa(len(actualVariables)))
			}

			if !bytes.Equal(actualMethod.Type, tt.MethodOutput.Type) {
				subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(tt.MethodOutput.Type), string(actualMethod.Type))
			} else if !bytes.Equal(actualMethod.Name, tt.MethodOutput.Name) {
				subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(tt.MethodOutput.Name), string(actualMethod.Name))
			} else if !bytes.Equal(actualMethod.AccessModifier, tt.MethodOutput.AccessModifier) {
				subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(tt.MethodOutput.AccessModifier), string(actualMethod.AccessModifier))
			} else if actualMethod.Abstract != tt.MethodOutput.Abstract {
				subtest.Errorf("incorrect.\nexpected:\n%t\ngot:\n%t\n", tt.MethodOutput.Abstract, actualMethod.Abstract)
			} else if actualMethod.Static != tt.MethodOutput.Static {
				subtest.Errorf("incorrect.\nexpected:\n%t\ngot:\n%t\n", tt.MethodOutput.Static, actualMethod.Static)
			} else if actualMethod.Final != tt.MethodOutput.Final {
				subtest.Errorf("incorrect.\nexpected:\n%t\ngot:\n%t\n", tt.MethodOutput.Final, actualMethod.Final)
			}

			if len(actualMethod.Parameters) != len(tt.MethodOutput.Parameters) {
				subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(tt.MethodOutput.Parameters)), strconv.Itoa(len(actualMethod.Parameters)))
				subtest.FailNow()
			} else if len(actualVariables) != len(tt.VariablesOutput) {
				subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(tt.VariablesOutput)), strconv.Itoa(len(actualVariables)))
				subtest.FailNow()
			}

			for index, expectedParameter := range tt.MethodOutput.Parameters {
				if !bytes.Equal(actualMethod.Parameters[index].Type, expectedParameter.Type) {
					subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expectedParameter.Type), string(actualMethod.Parameters[index].Type))
				} else if !bytes.Equal(actualMethod.Parameters[index].Name, expectedParameter.Name) {
					subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expectedParameter.Name), string(actualMethod.Parameters[index].Name))
				}
			}

			for index, expectedVariable := range tt.VariablesOutput {
				if !bytes.Equal(actualVariables[index].Type, expectedVariable.Type) {
					subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expectedVariable.Type), string(actualVariables[index].Type))
				} else if !bytes.Equal(actualVariables[index].Name, expectedVariable.Name) {
					subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expectedVariable.Name), string(actualVariables[index].Name))
				} else if !bytes.Equal(actualVariables[index].Value, expectedVariable.Value) {
					subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expectedVariable.Value), string(actualVariables[index].Value))
				} else if !bytes.Equal(actualVariables[index].AccessModifier, expectedVariable.AccessModifier) {
					subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expectedVariable.AccessModifier), string(actualVariables[index].AccessModifier))
				} else if actualVariables[index].Static != expectedVariable.Static {
					subtest.Errorf("incorrect.\nexpected:\n%t\ngot:\n%t\n", expectedVariable.Static, actualVariables[index].Static)
				} else if actualVariables[index].Final != expectedVariable.Final {
					subtest.Errorf("incorrect.\nexpected:\n%t\ngot:\n%t\n", expectedVariable.Final, actualVariables[index].Final)
				}

			}
		})
	}
}

func TestIsVariable(t *testing.T) {
	type TestIsVar struct {
		Input      []byte
		BoolOutput bool
		IntOutput  int
	}

	var tests = []TestIsVar{
		{
			[]byte("void Hello();"),
			false,
			10,
		},
		{
			[]byte("void Hello(){}"),
			false,
			10,
		},
		{
			[]byte("void Hello(){};"),
			false,
			10,
		},
		{
			[]byte("void Hello(String var1)"),
			false,
			10,
		},
		{
			[]byte("void Hello(String var1);"),
			false,
			10,
		},
		{
			[]byte("void Hello(String var1, String var2)"),
			false,
			10,
		},
		{
			[]byte("void Hello(String var1, String var2);"),
			false,
			10,
		},
		{
			[]byte("String var;"),
			true,
			0,
		},
		{
			[]byte("String var = \"Hello\";"),
			true,
			0,
		},
		{
			[]byte("String var = 'Hello';"),
			true,
			0,
		},
		{
			[]byte("String var = `Hello`;"),
			true,
			0,
		},
		{
			[]byte("String var = '(Hello';"),
			true,
			0,
		},
		{
			[]byte("Test var = new Test();"),
			true,
			0,
		},
		{
			[]byte("String var1, var2, var3;"),
			true,
			0,
		},
		{
			[]byte("String var1 = 'Hello', var2 = 'Hello', var3 = 'Hello';"),
			true,
			0,
		},
	}

	for testIndex, tt := range tests {
		t.Run("Test index "+strconv.Itoa(testIndex), func(subtest *testing.T) {
			actualBoolOutput, actualIntOutput := isVariable(tt.Input)

			if tt.BoolOutput != actualBoolOutput {
				subtest.Errorf("incorrect response.\ngot:\n%t\nneed:\n%t\n", actualBoolOutput, tt.BoolOutput)
			} else if tt.IntOutput != actualIntOutput {
				subtest.Errorf("incorrect response.\ngot:\n%s\nneed:\n%s\n", strconv.Itoa(actualIntOutput), strconv.Itoa(tt.IntOutput))
			}
		})
	}
}

func TestGetTypeInvocations(t *testing.T) {
	type TestSplit struct {
		Input  []byte
		Output [][]byte
	}

	var tests = []TestSplit{
		{
			[]byte("Test inner1;public Testing inner2 = new Testing();private static Test.Yes inner3 = new Testing();protected final Test.Yes inner4 = \"Hello\";static final Test.Yes inner5 = null;protected static final Test.Yes inner6 = null;public static void main(String[] args){Test.Yes obj;Testing t = new Testing();obj = t;obj.show();}Testing function1(Test.Yes var1, Test var2){};Testing function2();abstract void function3(){};static Testing function4(){}final Testing function5();static final void function6(){};public abstract void function7();private static Testing function8(){};protected final Testing function9(){};public static final void function10(){};"),
			[][]byte{[]byte("Testing")},
		},
	}

	for testIndex, tt := range tests {
		t.Run("Test index "+strconv.Itoa(testIndex), func(subtest *testing.T) {
			actualOutput := getTypeInvocations(tt.Input)

			if len(tt.Output) != len(actualOutput) {
				subtest.Errorf("incorrect length.\ngot: %s\nneed: %s\n", strconv.Itoa(len(actualOutput)), strconv.Itoa(len(tt.Output)))
				subtest.FailNow()
			}

			for index, expected := range tt.Output {
				if !bytes.Equal(actualOutput[index], expected) {
					subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected), string(actualOutput[index]))
				}
			}
		})
	}
}
