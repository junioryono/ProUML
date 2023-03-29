package java

import (
	"bytes"
	"strconv"
	"testing"

	types "github.com/junioryono/ProUML/backend/transpiler/types"
)

func byteSliceExistsCustom(slice []types.CustomByteSlice, expected []byte) bool {
	for _, current := range slice {
		if bytes.Equal(current, expected) {
			return true
		}
	}

	return false
}

func TestParseFile(t *testing.T) {
	type ParseFileTest struct {
		Input  types.File
		Output *types.FileResponse
	}

	var tests = []ParseFileTest{
		{
			Input: types.File{
				Name:      "Test1",
				Extension: "java",
				Code:      nil,
			},
			Output: &types.FileResponse{
				Package: []byte("default"),
			},
		},
		{
			Input: types.File{
				Name:      "Test2",
				Extension: "java",
				Code:      []byte("package hello;import java.awt.Cursor;public class Test2{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
			},
			Output: &types.FileResponse{
				Package: []byte("hello"),
				Imports: [][]byte{
					[]byte("java.awt.Cursor"),
				},
				Data: []any{
					types.JavaClass{
						Package: []byte("hello"),
						Name:    []byte("Test2"),
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
		},
		{
			Input: types.File{
				Name:      "Test3",
				Extension: "java",
				Code:      []byte("package com.houarizegai.calculator;public class Test3{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
			},
			Output: &types.FileResponse{
				Package: []byte("com.houarizegai.calculator"),
				Data: []any{
					types.JavaClass{
						Package: []byte("com.houarizegai.calculator"),
						Name:    []byte("Test3"),
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
		},
		{
			Input: types.File{
				Name:      "Test4",
				Extension: "java",
				Code:      []byte("import java.awt.Cursor;public class Test4{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
			},
			Output: &types.FileResponse{
				Package: []byte("default"),
				Imports: [][]byte{
					[]byte("java.awt.Cursor"),
				},
				Data: []any{
					types.JavaClass{
						Package: []byte("default"),
						Name:    []byte("Test4"),
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
		},
		{
			Input: types.File{
				Name:      "Test5",
				Extension: "java",
				Code:      []byte("public class Test5{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
			},
			Output: &types.FileResponse{
				Package: []byte("default"),
				Data: []any{
					types.JavaClass{
						Package: []byte("default"),
						Name:    []byte("Test5"),
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
		},
		{
			Input: types.File{
				Name:      "Test6",
				Extension: "java",
				Code:      []byte("public class Test6 extends Hello{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
			},
			Output: &types.FileResponse{
				Package: []byte("default"),
				Data: []any{
					types.JavaClass{
						Package: []byte("default"),
						Name:    []byte("Test6"),
						Extends: []byte("Hello"),
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
		},
		{
			Input: types.File{
				Name:      "A",
				Extension: "java",
				Code:      []byte("import java.util.*;class Test{protected interface Yes extends Hello1{void show();}public void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{public static void main(String[] args){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}}"),
			},
			Output: &types.FileResponse{
				Package: []byte("default"),
				Imports: [][]byte{
					[]byte("java.util.*"),
				},
				Data: []any{
					types.JavaInterface{
						DefinedWithin: []byte("Test"),
						Package:       []byte("default"),
						Name:          []byte("Yes"),
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("show"),
								AccessModifier: []byte(""),
								Abstract:       false,
								Static:         false,
								Final:          false,
							},
						},
					},
					types.JavaClass{
						Package: []byte("default"),
						Name:    []byte("Test"),
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("Test"),
								AccessModifier: []byte("public"),
								Abstract:       false,
								Static:         false,
								Final:          false,
							},
						},
					},
					types.JavaClass{
						Package:    []byte("default"),
						Name:       []byte("Testing"),
						Implements: []types.CustomByteSlice{[]byte("Test.Yes")},
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("show"),
								AccessModifier: []byte("public"),
								Abstract:       false,
								Static:         false,
								Final:          false,
							},
						},
					},
					types.JavaClass{
						Package: []byte("default"),
						Name:    []byte("A"),
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
		},
		{
			Input: types.File{
				Name:      "A",
				Extension: "java",
				Code:      []byte("import java.util.*;class Test{protected interface Yes{void show();}public void TestVoid(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{Test inner1;public Testing inner2=new Testing();private static Test.Yes inner3=new Testing();protected final Test.Yes inner4=\"Hello\";static final Test.Yes inner5 =null;protected static final Test.Yes inner6=null;public static void main(String[] args){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}Testing function1(Test.Yes var1,Test var2){};Testing function2();abstract void function3(){};static Testing function4(){}final Testing function5();static final void function6(){};public abstract void function7();private static Testing function8(){};protected final Testing function9(){};public static final void function10(){};}"),
			},
			Output: &types.FileResponse{
				Package: []byte("default"),
				Imports: [][]byte{
					[]byte("java.util.*"),
				},
				Data: []any{
					types.JavaClass{
						Package: []byte("default"),
						Name:    []byte("Test"),
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("TestVoid"),
								AccessModifier: []byte("public"),
								Abstract:       false,
								Static:         false,
								Final:          false,
							},
						},
					},
					types.JavaInterface{
						DefinedWithin: []byte("Test"),
						Package:       []byte("default"),
						Name:          []byte("Yes"),
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("show"),
								AccessModifier: []byte(""),
								Abstract:       false,
								Static:         false,
								Final:          false,
							},
						},
					},
					types.JavaClass{
						Package:    []byte("default"),
						Name:       []byte("Testing"),
						Implements: []types.CustomByteSlice{[]byte("Test.Yes")},
						Methods: []types.JavaMethod{
							{
								Type:           []byte("void"),
								Name:           []byte("show"),
								AccessModifier: []byte("public"),
								Abstract:       false,
								Static:         false,
								Final:          false,
							},
						},
					},
					types.JavaClass{
						Package: []byte("default"),
						Name:    []byte("A"),
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
								Abstract:       false,
								Static:         false,
								Final:          false,
							},
							{
								Type:           []byte("void"),
								Name:           []byte("function3"),
								AccessModifier: []byte(""),
								Abstract:       true,
								Static:         false,
								Final:          false,
							},
							{
								Type:           []byte("Testing"),
								Name:           []byte("function4"),
								AccessModifier: []byte(""),
								Abstract:       false,
								Static:         true,
								Final:          false,
							},
							{
								Type:           []byte("Testing"),
								Name:           []byte("function5"),
								AccessModifier: []byte(""),
								Abstract:       false,
								Static:         false,
								Final:          true,
							},
							{
								Type:           []byte("void"),
								Name:           []byte("function6"),
								AccessModifier: []byte(""),
								Abstract:       false,
								Static:         true,
								Final:          true,
							},
							{
								Type:           []byte("void"),
								Name:           []byte("function7"),
								AccessModifier: []byte("public"),
								Abstract:       true,
								Static:         false,
								Final:          false,
							},
							{
								Type:           []byte("Testing"),
								Name:           []byte("function8"),
								AccessModifier: []byte("private"),
								Abstract:       false,
								Static:         true,
								Final:          false,
							},
							{
								Type:           []byte("Testing"),
								Name:           []byte("function9"),
								AccessModifier: []byte("protected"),
								Abstract:       false,
								Static:         false,
								Final:          true,
							},
							{
								Type:           []byte("void"),
								Name:           []byte("function10"),
								AccessModifier: []byte("public"),
								Abstract:       false,
								Static:         true,
								Final:          true,
							},
						},
					},
				},
			},
		},
	}

	for testIndex, tt := range tests {
		t.Run("Test index "+strconv.Itoa(testIndex), func(subtest *testing.T) {
			actualOutput := parseFile(tt.Input)

			if !bytes.Equal(actualOutput.Package, tt.Output.Package) {
				subtest.Errorf("testIndex: %s. incorrect package.\nexpected: %s\ngot: %s\n", strconv.Itoa(testIndex), string(tt.Output.Package), string(actualOutput.Package))
			}

			if len(actualOutput.Imports) != len(tt.Output.Imports) {
				subtest.Errorf("incorrect number of imports.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(tt.Output.Imports)), strconv.Itoa(len(actualOutput.Imports)))
				subtest.FailNow()
			}

			if len(actualOutput.Data) != len(tt.Output.Data) {
				subtest.Errorf("incorrect number of classes.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(tt.Output.Data)), strconv.Itoa(len(actualOutput.Data)))
				subtest.FailNow()
			}

			if len(actualOutput.Data) != len(tt.Output.Data) {
				subtest.Errorf("incorrect number of classes.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(tt.Output.Data)), strconv.Itoa(len(actualOutput.Data)))
				subtest.FailNow()
			}

			for i, class := range actualOutput.Data {
				switch response := class.(type) {
				case types.JavaAbstract:
					switch expected := tt.Output.Data[i].(type) {
					case types.JavaAbstract:
						if !bytes.Equal(response.Package, expected.Package) {
							subtest.Errorf("testIndex: %s. incorrect package.\nexpected: %s\ngot: %s\n", strconv.Itoa(testIndex), string(expected.Package), string(response.Package))
						} else if !bytes.Equal(response.Name, expected.Name) {
							subtest.Errorf("incorrect class name on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.Name, response.Name)
						} else if !bytes.Equal(response.DefinedWithin, expected.DefinedWithin) {
							subtest.Errorf("incorrect defined within on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.DefinedWithin, response.DefinedWithin)
						}

						subtest.Logf("class name: %s\n", string(response.Name))
						if len(expected.Implements) != len(response.Implements) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Implements)), strconv.Itoa(len(response.Implements)))
							subtest.FailNow()
						} else if len(expected.Variables) != len(response.Variables) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Variables)), strconv.Itoa(len(response.Variables)))
							subtest.FailNow()
						} else if len(expected.Methods) != len(response.Methods) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods)), strconv.Itoa(len(response.Methods)))
							subtest.FailNow()
						}

						if !bytes.Equal(response.Extends, expected.Extends) {
							subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Extends), string(response.Extends))
						}

						for index, word := range expected.Implements {
							if !byteSliceExistsCustom(response.Implements, word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(word), string(response.Implements[index]))
							}
						}

						for index, variable := range expected.Variables {
							if !bytes.Equal(response.Variables[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Variables[index].Type))
							} else if !bytes.Equal(response.Variables[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Variables[index].Name))
							} else if !bytes.Equal(response.Variables[index].Value, variable.Value) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Value), string(response.Variables[index].Value))
							} else if !bytes.Equal(response.Variables[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Variables[index].AccessModifier))
							} else if response.Variables[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Variables[index].Static)
							} else if response.Variables[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Variables[index].Final)
							}
						}

						for index, variable := range expected.Methods {
							if !bytes.Equal(response.Methods[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Methods[index].Type))
							} else if !bytes.Equal(response.Methods[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Methods[index].Name))
							} else if !bytes.Equal(response.Methods[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Methods[index].AccessModifier))
							} else if response.Methods[index].Abstract != variable.Abstract {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Abstract, response.Methods[index].Abstract)
							} else if response.Methods[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Methods[index].Static)
							} else if response.Methods[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Methods[index].Final)
							}

							if len(response.Methods[index].Parameters) != len(variable.Parameters) {
								subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(variable.Parameters)), strconv.Itoa(len(response.Methods[index].Parameters)))
								subtest.FailNow()
							}

							for indexParam, parameter := range variable.Parameters {
								if !bytes.Equal(response.Methods[index].Parameters[indexParam].Type, parameter.Type) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Type), string(response.Methods[index].Parameters[indexParam].Type))
								} else if !bytes.Equal(response.Methods[index].Parameters[indexParam].Name, parameter.Name) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Name), string(response.Methods[index].Parameters[indexParam].Type))
								}
							}
						}
					default:
						subtest.Errorf("incorrect response type")
					}

				case types.JavaClass:
					switch expected := tt.Output.Data[i].(type) {
					case types.JavaClass:
						if !bytes.Equal(response.Package, expected.Package) {
							subtest.Errorf("testIndex: %s. incorrect package.\nexpected: %s\ngot: %s\n", strconv.Itoa(testIndex), string(expected.Package), string(response.Package))
						} else if !bytes.Equal(response.Name, expected.Name) {
							subtest.Errorf("incorrect class name on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.Name, response.Name)
						} else if !bytes.Equal(response.DefinedWithin, expected.DefinedWithin) {
							subtest.Errorf("incorrect defined within on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.DefinedWithin, response.DefinedWithin)
						}

						subtest.Logf("class name: %s\n", string(response.Name))
						if len(expected.Implements) != len(response.Implements) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Implements)), strconv.Itoa(len(response.Implements)))
							subtest.FailNow()
						} else if len(expected.Variables) != len(response.Variables) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Variables)), strconv.Itoa(len(response.Variables)))
							subtest.FailNow()
						} else if len(expected.Methods) != len(response.Methods) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods)), strconv.Itoa(len(response.Methods)))
							subtest.FailNow()
						}

						if !bytes.Equal(response.Extends, expected.Extends) {
							subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Extends), string(response.Extends))
						}

						for index, word := range expected.Implements {
							if !byteSliceExistsCustom(response.Implements, word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(word), string(response.Implements[index]))
							}
						}

						for index, variable := range expected.Variables {
							if !bytes.Equal(response.Variables[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Variables[index].Type))
							} else if !bytes.Equal(response.Variables[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Variables[index].Name))
							} else if !bytes.Equal(response.Variables[index].Value, variable.Value) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Value), string(response.Variables[index].Value))
							} else if !bytes.Equal(response.Variables[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Variables[index].AccessModifier))
							} else if response.Variables[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Variables[index].Static)
							} else if response.Variables[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Variables[index].Final)
							}
						}

						for index, variable := range expected.Methods {
							if !bytes.Equal(response.Methods[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Methods[index].Type))
							} else if !bytes.Equal(response.Methods[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Methods[index].Name))
							} else if !bytes.Equal(response.Methods[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Methods[index].AccessModifier))
							} else if response.Methods[index].Abstract != variable.Abstract {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Abstract, response.Methods[index].Abstract)
							} else if response.Methods[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Methods[index].Static)
							} else if response.Methods[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Methods[index].Final)
							}

							if len(response.Methods[index].Parameters) != len(variable.Parameters) {
								subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(variable.Parameters)), strconv.Itoa(len(response.Methods[index].Parameters)))
								subtest.FailNow()
							}

							for indexParam, parameter := range variable.Parameters {
								if !bytes.Equal(response.Methods[index].Parameters[indexParam].Type, parameter.Type) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Type), string(response.Methods[index].Parameters[indexParam].Type))
								} else if !bytes.Equal(response.Methods[index].Parameters[indexParam].Name, parameter.Name) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Name), string(response.Methods[index].Parameters[indexParam].Type))
								}
							}
						}
					default:
						subtest.Errorf("incorrect response type")
					}

				case types.JavaInterface:
					switch expected := tt.Output.Data[i].(type) {
					case types.JavaInterface:
						if !bytes.Equal(response.Package, expected.Package) {
							subtest.Errorf("testIndex: %s. incorrect package.\nexpected: %s\ngot: %s\n", strconv.Itoa(testIndex), string(expected.Package), string(response.Package))
						} else if !bytes.Equal(response.Name, expected.Name) {
							subtest.Errorf("incorrect class name on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.Name, response.Name)
						} else if !bytes.Equal(response.DefinedWithin, expected.DefinedWithin) {
							subtest.Errorf("incorrect defined within on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.DefinedWithin, response.DefinedWithin)
						}

						subtest.Logf("class name: %s\n", string(response.Name))
						if len(expected.Variables) != len(response.Variables) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Variables)), strconv.Itoa(len(response.Variables)))
							subtest.FailNow()
						} else if len(expected.Methods) != len(response.Methods) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods)), strconv.Itoa(len(response.Methods)))
							subtest.FailNow()
						}

						if !bytes.Equal(response.Extends, expected.Extends) {
							subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Extends), string(response.Extends))
						}

						for index, variable := range expected.Variables {
							if !bytes.Equal(response.Variables[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Variables[index].Type))
							} else if !bytes.Equal(response.Variables[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Variables[index].Name))
							} else if !bytes.Equal(response.Variables[index].Value, variable.Value) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Value), string(response.Variables[index].Value))
							} else if !bytes.Equal(response.Variables[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Variables[index].AccessModifier))
							} else if response.Variables[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Variables[index].Static)
							} else if response.Variables[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Variables[index].Final)
							}
						}

						for index, variable := range expected.Methods {
							if !bytes.Equal(response.Methods[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Type), string(response.Methods[index].Type))
							} else if !bytes.Equal(response.Methods[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Name), string(response.Methods[index].Name))
							} else if !bytes.Equal(response.Methods[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.AccessModifier), string(response.Methods[index].AccessModifier))
							} else if response.Methods[index].Abstract != variable.Abstract {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Abstract, response.Methods[index].Abstract)
							} else if response.Methods[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Static, response.Methods[index].Static)
							} else if response.Methods[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", variable.Final, response.Methods[index].Final)
							}

							if len(response.Methods[index].Parameters) != len(variable.Parameters) {
								subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(response.Methods[index].Parameters)), strconv.Itoa(len(variable.Parameters)))
								subtest.FailNow()
							}

							for indexParam, parameter := range variable.Parameters {
								if !bytes.Equal(response.Methods[index].Parameters[indexParam].Type, parameter.Type) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Type), string(response.Methods[index].Parameters[indexParam].Type))
								} else if !bytes.Equal(response.Methods[index].Parameters[indexParam].Name, parameter.Name) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(parameter.Name), string(response.Methods[index].Parameters[indexParam].Type))
								}
							}
						}
					default:
						subtest.Errorf("incorrect response type")
					}

				case types.JavaEnum:
					switch expected := tt.Output.Data[i].(type) {
					case types.JavaEnum:
						if !bytes.Equal(response.Package, expected.Package) {
							subtest.Errorf("testIndex: %s. incorrect package.\nexpected: %s\ngot: %s\n", strconv.Itoa(testIndex), string(expected.Package), string(response.Package))
						} else if !bytes.Equal(response.Name, expected.Name) {
							subtest.Errorf("incorrect class name on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.Name, response.Name)
						} else if !bytes.Equal(response.DefinedWithin, expected.DefinedWithin) {
							subtest.Errorf("incorrect defined within on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.DefinedWithin, response.DefinedWithin)
						} else if len(expected.Declarations) != len(response.Declarations) {
							subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Declarations)), strconv.Itoa(len(response.Declarations)))
							subtest.FailNow()
						}

						for _, declarations := range expected.Declarations {
							if !byteSliceExistsCustom(response.Declarations, declarations) {
								subtest.Errorf("bytes are not equal")
							}
						}
					default:
						subtest.Errorf("incorrect response type")
					}
				default:
					subtest.Errorf("cannot get language response")
					subtest.Fail()
				}
			}
		})
	}
}
