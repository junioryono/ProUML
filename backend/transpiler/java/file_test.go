package java

import (
	"bytes"
	"strconv"
	"testing"

	types "github.com/junioryono/ProUML/backend/transpiler/types"
)

func byteSliceExists(slice [][]byte, expected []byte) bool {
	for _, current := range slice {
		if bytes.Equal(current, expected) {
			return true
		}
	}

	return false
}

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
			Output: &types.FileResponse{},
		},
		// {
		// 	Input: types.File{
		// 		Name:      "AdvancedCharacter",
		// 		Extension: "java",
		// 		Code: []byte(`
		// 		import java.util.*;

		// 		public class AdvancedCharacter implements CharacterInterface {
		// 			public String stance = "Standing";
		// 			public double maxSpeed = 70.4;
		// 			public int maxWeapons = 2;
		// 			public List<String> selectionPanel = Collections.unmodifiableList(Arrays.asList("AC1", "AC2", "AC3"));

		// 			@Override
		// 			public List<String> getSelectionPanel() {
		// 				return this.selectionPanel;
		// 			}

		// 			@Override
		// 			public void setStance(String stance) {
		// 				this.stance = stance;
		// 			}
		// 		}
		// 		`),
		// 	},
		// 	Output: &types.FileResponse{
		// 		Package: []byte("default"),
		// 		Imports: [][]byte{
		// 			[]byte("java.util.*;"),
		// 		},
		// 		Data: []any{
		// 			types.JavaClass{
		// 				Package:    []byte("default"),
		// 				Name:       []byte("AdvancedCharacter"),
		// 				Implements: [][]byte{[]byte("CharacterInterface")},
		// 			},
		// 		},
		// 	},
		// },
		{
			Input: types.File{
				Name:      "Test2",
				Extension: "java",
				Code:      []byte("import java.awt.Cursor;public class Test2{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
			},
			Output: &types.FileResponse{
				Package: []byte("default"),
				Imports: [][]byte{
					[]byte("java.awt.Cursor"),
				},
				Data: []any{
					types.JavaClass{
						Package: []byte("default"),
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
								Abstract:      false,
								Static:        true,
								Final:         false,
								Functionality: []byte("System.out.println('Hello');System.out.println('Hello');"),
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
								Abstract:      false,
								Static:        true,
								Final:         false,
								Functionality: []byte("System.out.println('Hello');System.out.println('Hello');"),
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
								Abstract:      false,
								Static:        true,
								Final:         false,
								Functionality: []byte("System.out.println('Hello');System.out.println('Hello');"),
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
								Abstract:      false,
								Static:        true,
								Final:         false,
								Functionality: []byte("System.out.println('Hello');System.out.println('Hello');"),
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
				Code:      []byte("public class Test6 extends Test,Hello,Yes{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
			},
			Output: &types.FileResponse{
				Package: []byte("default"),
				Data: []any{
					types.JavaClass{
						Package: []byte("default"),
						Name:    []byte("Test6"),
						Extends: []types.CustomByteSlice{[]byte("Test"), []byte("Hello"), []byte("Yes")},
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
								Abstract:      false,
								Static:        true,
								Final:         false,
								Functionality: []byte("System.out.println('Hello');System.out.println('Hello');"),
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
				Code:      []byte("import java.util.*;class Test{protected interface Yes{void show();}public void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{public static void main(String[] args){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}}"),
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
								Name:           []byte("Test"),
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
								Functionality:  []byte("System.out.println('show method of interface');"),
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
								Abstract:      false,
								Static:        true,
								Final:         false,
								Functionality: []byte("Test.Yes obj;Testing t=new Testing();obj=t;obj.show();"),
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
								Functionality:  []byte("System.out.println('show method of interface');"),
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
								Abstract:      false,
								Static:        true,
								Final:         false,
								Functionality: []byte("Test.Yes obj;Testing t=new Testing();obj=t;obj.show();"),
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
						}

						for index, word := range expected.Extends {
							if !byteSliceExistsCustom(response.Extends, word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(word), string(response.Extends[index]))
							}
						}

						for index, word := range expected.Implements {
							if !byteSliceExistsCustom(response.Extends, word) {
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
							} else if !bytes.Equal(response.Methods[index].Functionality, variable.Functionality) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Functionality), string(response.Methods[index].Functionality))
							}

							if len(response.Methods[index].Parameters) != len(variable.Parameters) {
								subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods[index].Parameters)), strconv.Itoa(len(variable.Parameters)))
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
							} else if !bytes.Equal(response.Methods[index].Functionality, variable.Functionality) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Functionality), string(response.Methods[index].Functionality))
							}

							if len(response.Methods[index].Parameters) != len(variable.Parameters) {
								subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods[index].Parameters)), strconv.Itoa(len(variable.Parameters)))
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
							} else if !bytes.Equal(response.Methods[index].Functionality, variable.Functionality) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Functionality), string(response.Methods[index].Functionality))
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

func TestRemoveComments(t *testing.T) {
	type CommentsTest struct {
		Input  []byte
		Output []byte
	}

	var tests = []CommentsTest{
		{
			Input:  []byte(`/* IOEWJQIOJE */System.out.println('Hello Java');`),
			Output: []byte(`System.out.println('Hello Java');`),
		},
		{
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
		},
		{
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
		},
		{
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
		},
	}

	for testIndex, tt := range tests {
		t.Run("Test index "+strconv.Itoa(testIndex), func(subtest *testing.T) {
			res := removeComments(tt.Input)

			if !bytes.Equal(res, tt.Output) {
				subtest.Errorf("incorrect response.\nexpected: %s\ngot: %s\n", string(tt.Output), string(res))
			}
		})
	}
}

func TestRemoveSpacing(t *testing.T) {
	type SpacingTest struct {
		Input  []byte
		Output []byte
	}

	var tests = []SpacingTest{
		{
			Input:  []byte(`boolean t=animal instanceof Animal;`),
			Output: []byte("boolean t=animal&&Animal;"),
		},
		{
			Input:  []byte(`public strictfp varT = false;`),
			Output: []byte("public varT=false;"),
		},
		{
			Input:  []byte(` strictfp `),
			Output: []byte(""),
		},
		{
			Input:  []byte(`public class Test{public void writeList()throws IOException,IndexOutOfBoundsException{System.out.println();};}`),
			Output: []byte("public class Test{public void writeList(){System.out.println();};}"),
		},
		{
			Input: []byte(`
			public class Test {
				Integer test = (int x, int y) -> (x + y) / (x - y);
				Integer test = (int x) -> x + x;
				Integer test = (x) -> (x + x);
				Integer test = (x) -> x + x;
				Integer test = x -> x + x;
				Integer test = x -> (x + x);
				Integer test = () -> 7;
				String s = invoke(() -> 'done');
			}`),
			Output: []byte("public class Test{Integer test=(int x,int y)->(x+y)/(x-y);Integer test=(int x)->x+x;Integer test=(x)->(x+x);Integer test=(x)->x+x;Integer test=x->x+x;Integer test=x->(x+x);Integer test=()->7;String s=invoke(()->'done');}"),
		},
		{
			Input: []byte(`
			import java.util.*;

			public class AdvancedCharacter implements CharacterInterface {
				public String stance = "Standing";
				public double maxSpeed = 70.4;
				public int maxWeapons = 2;
				public List<String> selectionPanel = Collections.unmodifiableList(Arrays.asList("AC1", "AC2", "AC3"));

				@Override
				public List<String> getSelectionPanel() {
					return this.selectionPanel;
				}

				@Override
				public void setStance(String stance) {
					this.stance = stance;
				}
			}
			`),
			Output: []byte("import java.util.*;public class AdvancedCharacter implements CharacterInterface{public String stance=\"Standing\";public double maxSpeed=70.4;public int maxWeapons=2;public List<String>selectionPanel=Collections.unmodifiableList(Arrays.asList(\"AC1\",\"AC2\",\"AC3\"));@Override public List<String>getSelectionPanel(){return this.selectionPanel;}@Override public void setStance(String stance){this.stance=stance;}}"),
		},
		{
			Input: []byte(`
			import java.util.List;

			public class Client {
				private static void printSelectionPanel(String title, List<String> list) {
					System.out.println(title);
					list.forEach(item -> {
						System.out.println(item);
					});
					System.out.println();
				}

				public static void main(String[] args) {
					ModeInterface beginnerFactory = new ModeFactory().createFactory("Beginner");
					CharacterInterface beginnerCharacter = beginnerFactory.createCharacter();
					printSelectionPanel("Beginner Character Selection Panel:", beginnerCharacter.getSelectionPanel());
					WeaponInterface beginnerWeapon = beginnerFactory.createWeapon();
					printSelectionPanel("Beginner Weapon Selection Panel:", beginnerWeapon.getSelectionPanel());

					ModeInterface advancedFactory = new ModeFactory().createFactory("Advanced");
					CharacterInterface advancedCharacter = advancedFactory.createCharacter();
					printSelectionPanel("Advanced Character Selection Panel:", advancedCharacter.getSelectionPanel());
					WeaponInterface advancedWeapon = advancedFactory.createWeapon();
					printSelectionPanel("Advanced Weapon Selection Panel:", advancedWeapon.getSelectionPanel());

					ModeInterface intermediateFactory = new ModeFactory().createFactory("Intermediate");
					CharacterInterface intermediateCharacter = intermediateFactory.createCharacter();
					printSelectionPanel("Intermediate Character Selection Panel:", intermediateCharacter.getSelectionPanel());
					WeaponInterface intermediateWeapon = intermediateFactory.createWeapon();
					printSelectionPanel("Intermediate Weapon Selection Panel:", intermediateWeapon.getSelectionPanel());
				}
			}
			`),
			Output: []byte("import java.util.List;public class Client{private static void printSelectionPanel(String title,List<String>list){System.out.println(title);list.forEach(item->{System.out.println(item);});System.out.println();}public static void main(String[] args){ModeInterface beginnerFactory=new ModeFactory().createFactory(\"Beginner\");CharacterInterface beginnerCharacter=beginnerFactory.createCharacter();printSelectionPanel(\"Beginner Character Selection Panel:\",beginnerCharacter.getSelectionPanel());WeaponInterface beginnerWeapon=beginnerFactory.createWeapon();printSelectionPanel(\"Beginner Weapon Selection Panel:\",beginnerWeapon.getSelectionPanel());ModeInterface advancedFactory=new ModeFactory().createFactory(\"Advanced\");CharacterInterface advancedCharacter=advancedFactory.createCharacter();printSelectionPanel(\"Advanced Character Selection Panel:\",advancedCharacter.getSelectionPanel());WeaponInterface advancedWeapon=advancedFactory.createWeapon();printSelectionPanel(\"Advanced Weapon Selection Panel:\",advancedWeapon.getSelectionPanel());ModeInterface intermediateFactory=new ModeFactory().createFactory(\"Intermediate\");CharacterInterface intermediateCharacter=intermediateFactory.createCharacter();printSelectionPanel(\"Intermediate Character Selection Panel:\",intermediateCharacter.getSelectionPanel());WeaponInterface intermediateWeapon=intermediateFactory.createWeapon();printSelectionPanel(\"Intermediate Weapon Selection Panel:\",intermediateWeapon.getSelectionPanel());}}"),
		},
		{
			Input: []byte(`
			public class Test {
				button.addActionListener(e -> System.out.println('Hello'));
				button.addActionListener(e -> {
					System.out.println('Hello');
					System.out.println('Hello');
				});
				button.addActionListener((e) -> {
					System.out.println('Hello');
					System.out.println('Hello');
				});
			}`),
			Output: []byte("public class Test{button.addActionListener(e->System.out.println('Hello'));button.addActionListener(e->{System.out.println('Hello');System.out.println('Hello');});button.addActionListener((e)->{System.out.println('Hello');System.out.println('Hello');});}"),
		},
		{
			Input: []byte(`
			public class Test {

				word;;;;; , double     , the      , 
				word;;     ,    double        , the         ,  
				the ; comma ; the      ; yelp   ; hello        ;
				the @ comma @ the      @ yelp   @ hello        @
				the ) comma ) the      ( yelp   ) hello        (
				"   Hello\"   "
				"   Yes   "
				c==v
				==v
				c==
				d
				Hello==Yes
				Hello = Yes
				Hello =Yes
				Hello= Yes
				Hello=Yes
			}`),
			Output: []byte("public class Test{word;,double,the,word;,double,the,the;comma;the;yelp;hello;the@comma@the@yelp@hello@the)comma)the(yelp)hello(\"   Hello\\\"   \" \"   Yes   \" c==v==v c==d Hello==Yes Hello=Yes Hello=Yes Hello=Yes Hello=Yes}"),
		},
		{
			Input: []byte(`
			public class Test {
				if(  true     &&    true  &&    (  true   ||  false)   ) {}
				if   (  true     &&    true  &&(  true   ||  false)   ) {}
				if (  true     ||    true  ||    (  true   &&  false)   ) {}
				if (  true     ||    true  ||(  true   &&  false)   ) {}
			}`),
			Output: []byte("public class Test{if(true&&true&&(true||false)){}if(true&&true&&(true||false)){}if(true||true||(true&&false)){}if(true||true||(true&&false)){}}"),
		},
		{
			Input: []byte(`
			package hello    ;

			@ Annotation
			class Test {
				String test = " @   \"   "   ;
			}`),
			Output: []byte("package hello;@Annotation class Test{String test=\" @   \\\"   \";}"),
		},
		{
			Input: []byte(`

			public class Test {
				private Test test = new Test [ 5 ];

				public static void main(String[ ] args) {

					System.out.println('Hello');;;

					 System.out.println('Hello');
				}

										}   `),
			Output: []byte("public class Test{private Test test=new Test[5];public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
		},
		{
			Input: []byte(`

			public class Test2 {
				String var1;
				String var2 = "Hello";
				String var3 = "Hello", var4;
				String  var5   =   "Hello"  ,   var6 = "Hello" , var7  ;
				List  <  ClassName  >  ;
				List  <  ClassName  <  ClassName  >  >  ;
				List  <  ClassName1  ,  ClassName2   >  ;

				Test2() {
					this.var4 = "J";
					System.out.println("Hello");

				}

				void Test3(  String  var1  );
			}`),
			Output: []byte("public class Test2{String var1;String var2=\"Hello\";String var3=\"Hello\",var4;String var5=\"Hello\",var6=\"Hello\",var7;List<ClassName>;List<ClassName<ClassName>>;List<ClassName1,ClassName2>;Test2(){this.var4=\"J\";System.out.println(\"Hello\");}void Test3(String var1);}"),
		},
		{
			Input:  []byte("import java.util.*  ;     @   Annotation  {qi = \"ddd\", qd  }  class Test{protected interface Yes{void show();}public void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{public static void main(String[] args){Test.Yes obj;Testing t = new Testing();obj = t;obj.show();}}"),
			Output: []byte("import java.util.*;@Annotation{qi=\"ddd\",qd}class Test{protected interface Yes{void show();}public void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{public static void main(String[] args){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}}"),
		},
		{
			Input:  []byte("import java.util.*  ;     @   Annotation  (qi = \"ddd\", qd  )  class Test{protected interface Yes{void show();}public void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{public static void main(String[] args){Test.Yes obj;Testing t = new Testing();obj = t;obj.show();}}"),
			Output: []byte("import java.util.*;@Annotation(qi=\"ddd\",qd)class Test{protected interface Yes{void show();}public void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{public static void main(String[] args){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}}"),
		},
		{
			Input:  []byte("import java.util.*  ;     @   Annotation    class Test{protected interface Yes{void show();}public void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{public static void main(String[] args){Test.Yes obj;Testing t = new Testing();obj = t;obj.show();}}"),
			Output: []byte("import java.util.*;@Annotation class Test{protected interface Yes{void show();}public void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{public static void main(String[] args){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}}"),
		},
		{
			Input:  []byte("import java.util.*;class Test{public static void main(String[] args   ,  Test hello ){Test.Yes obj;Testing t = new Testing();obj = t;obj.show();}}"),
			Output: []byte("import java.util.*;class Test{public static void main(String[] args,Test hello){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}}"),
		},
	}

	for testIndex, tt := range tests {
		t.Run("Test index "+strconv.Itoa(testIndex), func(subtest *testing.T) {
			res := removeSpacing(tt.Input)

			if !bytes.Equal(res, tt.Output) {
				subtest.Errorf("incorrect response.\nexpected: %s\ngot: %s\n", string(tt.Output), string(res))
			}
		})
	}
}

func TestRemoveAnnotations(t *testing.T) {
	type AnnotiationsTest struct {
		Input  []byte
		Output []byte
	}

	var tests = []AnnotiationsTest{
		{
			Input:  []byte("new @Readonly ArrayList<>()"),
			Output: []byte("new ArrayList<>()"),
		},
		{
			Input:  []byte("@SuppressWarnings(\"unchecked\")static void wordsList();"),
			Output: []byte("static void wordsList();"),
		},
		{
			Input:  []byte("@Override public void wordList();"),
			Output: []byte("public void wordList();"),
		},
		{
			Input:  []byte("@AnnotationName(elementName=\"elementValue\");"),
			Output: []byte(";"),
		},
		{
			Input:  []byte("@SuppressWarnings(\"unchecked\")"),
			Output: []byte(""),
		},
		{
			Input:  []byte("@NonNull String str;"),
			Output: []byte("String str;"),
		},
		{
			Input:  []byte("class Warning extends @Localized Message"),
			Output: []byte("class Warning extends Message"),
		},
		{
			Input:  []byte("newStr=(@NonNull String) str;"),
			Output: []byte("newStr=(String) str;"),
		},
		{
			Input:  []byte("import java.util.*;@Annotation{qi=\"ddd\", qd}class Test{protected interface Yes{void show();}public void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{public static void main(String[] args){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}}"),
			Output: []byte("import java.util.*;class Test{protected interface Yes{void show();}public void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{public static void main(String[] args){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}}"),
		},
		{
			Input:  []byte("@Annotation{qi=\"ddd\",qd}class Test{protected interface Yes{void show();}public void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{public static void main(String[] args){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}}"),
			Output: []byte("class Test{protected interface Yes{void show();}public void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{public static void main(String[] args){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}}"),
		},
		{
			Input:  []byte("@Annotation{qi={{({\"ddd\",qd})}}}class Test{protected interface Yes{void show();}public void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{public static void main(String[] args){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}}"),
			Output: []byte("class Test{protected interface Yes{void show();}public void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{public static void main(String[] args){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}}"),
		},
		{
			Input:  []byte("@Annotation(qi=(\"ddd\",qd))class Test{protected interface Yes{void show();}public void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{public static void main(String[] args){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}}"),
			Output: []byte("class Test{protected interface Yes{void show();}public void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{public static void main(String[] args){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}}"),
		},
		{
			Input:  []byte("@Annotation class Test{protected interface Yes{void show();}public void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{public static void main(String[] args){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}}"),
			Output: []byte("class Test{protected interface Yes{void show();}public void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{public static void main(String[] args){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}}"),
		},
	}

	for testIndex, tt := range tests {
		t.Run("Test index "+strconv.Itoa(testIndex), func(subtest *testing.T) {
			res := removeAnnotations(tt.Input)

			if !bytes.Equal(res, tt.Output) {
				subtest.Errorf("incorrect response.\nexpected: %s\ngot: %s\n", string(tt.Output), string(res))
			}
		})
	}
}

func TestGetPackageImports(t *testing.T) {
	type PackageImportsTest struct {
		Input  []byte
		Output [][]byte
	}

	var tests = []PackageImportsTest{
		{
			Input: []byte("import java.util.*;class Test{public static void main(String[] args,Test hello){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}}"),
			Output: [][]byte{
				[]byte("java.util.*"),
			},
		},
		{
			Input: []byte("import java.util.*;import java.util.Scanner;class Test{public static void main(String[] args,Test hello){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}}"),
			Output: [][]byte{
				[]byte("java.util.*"),
				[]byte("java.util.Scanner"),
			},
		},
		{
			Input: []byte("package Test;import java.util.*;import java.util.Scanner;class Test{public static void main(String[] args,Test hello){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}}"),
			Output: [][]byte{
				[]byte("java.util.*"),
				[]byte("java.util.Scanner"),
			},
		},
	}

	for testIndex, tt := range tests {
		t.Run("Test index "+strconv.Itoa(testIndex), func(subtest *testing.T) {
			actualOutput := getPackageImports(tt.Input)

			if len(tt.Output) != len(actualOutput) {
				subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(tt.Output)), strconv.Itoa(len(actualOutput)))
				subtest.FailNow()
			}

			for index, expected := range tt.Output {
				if !byteSliceExists(actualOutput, expected) {
					subtest.Errorf("bytes are not equal.\nexpected: %s\ngot: %s\n", string(expected), string(actualOutput[index]))
				}
			}
		})
	}
}

func TestGetPackageName(t *testing.T) {
	type PackageNameTest struct {
		Input  []byte
		Output []byte
	}

	var tests = []PackageNameTest{
		{
			Input:  []byte(`package com.houarizegai.calculator;import java.awt.Cursor;import java.awt.Font;import java.awt.event.ActionListener;import java.awt.event.ItemEvent;import java.util.function.Consumer;import java.util.regex.Pattern;import java.awt.Color;import javax.swing.*;import java.lang.Math;public class Calculator{private static final int WINDOW_WIDTH=410;private static final int WINDOW_HEIGHT=600;private static final int BUTTON_WIDTH=80;}`),
			Output: []byte("com.houarizegai.calculator"),
		},
		{
			Input:  []byte(`import java.awt.Cursor;import java.awt.Font;import java.awt.event.ActionListener;import java.awt.event.ItemEvent;import java.util.function.Consumer;import java.util.regex.Pattern;import java.awt.Color;import javax.swing.*;import java.lang.Math;public class Calculator{private static final int WINDOW_WIDTH=410;private static final int WINDOW_HEIGHT=600;private static final int BUTTON_WIDTH=80;}`),
			Output: []byte("default"),
		},
		{
			Input:  []byte(`import java.awt.Cursor;import java.awt.Font;import java.awt.event.ActionListener;import java.awt.event.ItemEvent;import java.util.function.Consumer;import java.util.regex.Pattern;import java.awt.Color;import javax.swing.*;import java.lang.Math;public class Calculator{package com.houarizegai.calculator;private static final int WINDOW_WIDTH=410;private static final int WINDOW_HEIGHT=600;private static final int BUTTON_WIDTH=80;}`),
			Output: []byte("default"),
		},
	}

	for testIndex, tt := range tests {
		t.Run("Test index "+strconv.Itoa(testIndex), func(subtest *testing.T) {
			actualOutput := getPackageName(tt.Input)

			if !bytes.Equal(actualOutput, tt.Output) {
				subtest.Errorf("incorrect response.\nexpected: %s\ngot: %s\n", string(tt.Output), string(actualOutput))
			}
		})
	}
}

func TestGetFileClasses(t *testing.T) {
	type FileClassesTest struct {
		Input  []byte
		Output []any
	}

	var tests = []FileClassesTest{
		{
			Input: []byte("import java.util.List;public class Client{private static void printSelectionPanel(String title,List<String>list){System.out.println(title);list.forEach(item->{System.out.println(item);});System.out.println();}public static void main(String[] args){ModeInterface beginnerFactory=new ModeFactory().createFactory(\"Beginner\");CharacterInterface beginnerCharacter=beginnerFactory.createCharacter();printSelectionPanel(\"Beginner Character Selection Panel:\",beginnerCharacter.getSelectionPanel());WeaponInterface beginnerWeapon=beginnerFactory.createWeapon();printSelectionPanel(\"Beginner Weapon Selection Panel:\",beginnerWeapon.getSelectionPanel());ModeInterface advancedFactory=new ModeFactory().createFactory(\"Advanced\");CharacterInterface advancedCharacter=advancedFactory.createCharacter();printSelectionPanel(\"Advanced Character Selection Panel:\",advancedCharacter.getSelectionPanel());WeaponInterface advancedWeapon=advancedFactory.createWeapon();printSelectionPanel(\"Advanced Weapon Selection Panel:\",advancedWeapon.getSelectionPanel());ModeInterface intermediateFactory=new ModeFactory().createFactory(\"Intermediate\");CharacterInterface intermediateCharacter=intermediateFactory.createCharacter();printSelectionPanel(\"Intermediate Character Selection Panel:\",intermediateCharacter.getSelectionPanel());WeaponInterface intermediateWeapon=intermediateFactory.createWeapon();printSelectionPanel(\"Intermediate Weapon Selection Panel:\",intermediateWeapon.getSelectionPanel());}}"),
			Output: []any{
				types.JavaClass{
					Package: []byte("default"),
					Name:    []byte("Client"),
					Methods: []types.JavaMethod{
						{
							Type:           []byte("void"),
							Name:           []byte("printSelectionPanel"),
							AccessModifier: []byte("private"),
							Parameters: []types.JavaMethodParameter{
								{
									Type: []byte("String"),
									Name: []byte("title"),
								},
								{
									Type: []byte("List<String>"),
									Name: []byte("list"),
								},
							},
							Static:        true,
							Functionality: []byte("System.out.println(title);list.forEach(item->{System.out.println(item);});System.out.println();"),
						},
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
							Static:        true,
							Functionality: []byte("ModeInterface beginnerFactory=new ModeFactory().createFactory(\"Beginner\");CharacterInterface beginnerCharacter=beginnerFactory.createCharacter();printSelectionPanel(\"Beginner Character Selection Panel:\",beginnerCharacter.getSelectionPanel());WeaponInterface beginnerWeapon=beginnerFactory.createWeapon();printSelectionPanel(\"Beginner Weapon Selection Panel:\",beginnerWeapon.getSelectionPanel());ModeInterface advancedFactory=new ModeFactory().createFactory(\"Advanced\");CharacterInterface advancedCharacter=advancedFactory.createCharacter();printSelectionPanel(\"Advanced Character Selection Panel:\",advancedCharacter.getSelectionPanel());WeaponInterface advancedWeapon=advancedFactory.createWeapon();printSelectionPanel(\"Advanced Weapon Selection Panel:\",advancedWeapon.getSelectionPanel());ModeInterface intermediateFactory=new ModeFactory().createFactory(\"Intermediate\");CharacterInterface intermediateCharacter=intermediateFactory.createCharacter();printSelectionPanel(\"Intermediate Character Selection Panel:\",intermediateCharacter.getSelectionPanel());WeaponInterface intermediateWeapon=intermediateFactory.createWeapon();printSelectionPanel(\"Intermediate Weapon Selection Panel:\",intermediateWeapon.getSelectionPanel());"),
						},
					},
				},
			},
		},
		{
			Input: []byte("package com.houarizegai.calculator;import java.awt.Cursor;public class Test1{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
			Output: []any{
				types.JavaClass{
					Package: []byte("com.houarizegai.calculator"),
					Name:    []byte("Test1"),
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
							Abstract:      false,
							Static:        true,
							Final:         false,
							Functionality: []byte("System.out.println('Hello');System.out.println('Hello');"),
						},
					},
				},
			},
		},
		{
			Input: []byte("package com.houarizegai.calculator;public class Test2{public static void main(String[] args){if(true)System.out.print('Hello');else{System.out.println('Hello');}}}"),
			Output: []any{
				types.JavaClass{
					Package: []byte("com.houarizegai.calculator"),
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
							Abstract:      false,
							Static:        true,
							Final:         false,
							Functionality: []byte("if(true)System.out.print('Hello');else{System.out.println('Hello');}"),
						},
					},
				},
			},
		},
		{
			Input: []byte("import java.awt.Cursor;public class Test3{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
			Output: []any{
				types.JavaClass{
					Package: []byte("default"),
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
							Abstract:      false,
							Static:        true,
							Final:         false,
							Functionality: []byte("System.out.println('Hello');System.out.println('Hello');"),
						},
					},
				},
			},
		},
		{
			Input: []byte("public class Test4{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
			Output: []any{
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
							Abstract:      false,
							Static:        true,
							Final:         false,
							Functionality: []byte("System.out.println('Hello');System.out.println('Hello');"),
						},
					},
				},
			},
		},
		{
			Input: []byte("public class Test5 extends Test,Hello,Yes{public static void main(String[] args){System.out.println('Hello');System.out.println('Hello');}}"),
			Output: []any{
				types.JavaClass{
					Package: []byte("default"),
					Name:    []byte("Test5"),
					Extends: []types.CustomByteSlice{[]byte("Test"), []byte("Hello"), []byte("Yes")},
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
							Abstract:      false,
							Static:        true,
							Final:         false,
							Functionality: []byte("System.out.println('Hello');System.out.println('Hello');"),
						},
					},
				},
			},
		},
		{
			Input: []byte("import java.util.*;class Test{boolean testVar1=true==true;boolean testVar2=(true==true)||(true==false);protected interface Yes{void show();}public static void Test(){}}class Testing implements Test.Yes{public void show(){System.out.println();}}class A{public static void main(String[] args){System.out.println();Type1 var1=new Type2(,new Type3());Type1 var2;ActionListener task=new ActionListener(){boolean alreadyDisposed=false;public void actionPerformed(ActionEvent e){if(frame.isDisplayable()){alreadyDisposed=true;frame.dispose();}System.out.println();}System.out.println();};System.out.println(new Type26[][]{{20},{40}});if(new Type4()>new Type5()&&new Type20()){}if(new Type6().getTest()>=(new Type7().hello())){}for(Type8 p:roster){}for(Type9 t=new Type10(new Type11());t<new Type12(new Type13());t++){}switch(new Type14(new Type15()).get()){case new Type16(new Type17()).get():new Type18();new Type19();}while(new Type21()<new Type22()){new Type23();}do{new Type24();}while(new Type 25());}}"),
			Output: []any{
				types.JavaClass{
					Package: []byte("default"),
					Name:    []byte("Test"),
					Variables: []types.JavaVariable{
						{
							Type:           []byte("boolean"),
							Name:           []byte("testVar1"),
							Value:          []byte("true==true"),
							AccessModifier: []byte(""),
							Static:         false,
							Final:          false,
						},
						{
							Type:           []byte("boolean"),
							Name:           []byte("testVar2"),
							Value:          []byte("(true==true)||(true==false)"),
							AccessModifier: []byte(""),
							Static:         false,
							Final:          false,
						},
					},
					Methods: []types.JavaMethod{
						{
							Type:           []byte("void"),
							Name:           []byte("Test"),
							AccessModifier: []byte("public"),
							Abstract:       false,
							Static:         true,
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
							Functionality:  []byte("System.out.println();"),
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
							Abstract:      false,
							Static:        true,
							Final:         false,
							Functionality: []byte("System.out.println();Type1 var1=new Type2(,new Type3());Type1 var2;ActionListener task=new ActionListener(){boolean alreadyDisposed=false;public void actionPerformed(ActionEvent e){if(frame.isDisplayable()){alreadyDisposed=true;frame.dispose();}System.out.println();}System.out.println();};System.out.println(new Type26[][]{{20},{40}});if(new Type4()>new Type5()&&new Type20()){}if(new Type6().getTest()>=(new Type7().hello())){}for(Type8 p:roster){}for(Type9 t=new Type10(new Type11());t<new Type12(new Type13());t++){}switch(new Type14(new Type15()).get()){case new Type16(new Type17()).get():new Type18();new Type19();}while(new Type21()<new Type22()){new Type23();}do{new Type24();}while(new Type 25());"),
						},
					},
				},
			},
		},
		{
			Input: []byte("import java.util.*;class Test{protected interface Yes{void show();}public void TestVoid(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{Test inner1;public Testing inner2=new Testing();private static Test.Yes inner3=new Testing();protected final Test.Yes inner4=\"Hello\";static final Test.Yes inner5=null;protected static final Test.Yes inner6=null;public static void main(String[] args){Test.Yes obj;Testing t=new Testing();obj=t;obj.show();}Testing function1(Test.Yes var1,Map<String,String> var2){};Testing function2();abstract void function3(){};static Testing function4(){}final Testing function5();static final void function6(){};public abstract void function7();private static Testing function8(){};protected final Testing function9(){};public static final void function10(){};}"),
			Output: []any{
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
							Functionality:  []byte("System.out.println('show method of interface');"),
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
							Abstract:      false,
							Static:        true,
							Final:         false,
							Functionality: []byte("Test.Yes obj;Testing t=new Testing();obj=t;obj.show();"),
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
									Type: []byte("Map<String,String>"),
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
		{
			Input: []byte("enum Test8{H(\"Hydrogen\"),HE(\"Helium\"),NE(\"Neon\");public final String label;private Element(String label){this.label=label;}}"),
			Output: []any{
				types.JavaEnum{
					Package: []byte("default"),
					Name:    []byte("Test8"),
					Declarations: []types.CustomByteSlice{
						[]byte("H"),
						[]byte("HE"),
						[]byte("NE"),
					},
				},
			},
		},
		{
			Input: []byte("enum Test9{Hello,}"),
			Output: []any{
				types.JavaEnum{
					Package: []byte("default"),
					Name:    []byte("Test9"),
					Declarations: []types.CustomByteSlice{
						[]byte("Hello"),
					},
				},
			},
		},
		{
			Input: []byte("enum Test10{Hello;}"),
			Output: []any{
				types.JavaEnum{
					Package: []byte("default"),
					Name:    []byte("Test10"),
					Declarations: []types.CustomByteSlice{
						[]byte("Hello"),
					},
				},
			},
		},
	}

	for testIndex, tt := range tests {
		t.Run("Test index "+strconv.Itoa(testIndex), func(subtest *testing.T) {
			classes := getFileClasses(tt.Input, getPackageName(tt.Input))

			if len(classes) != len(tt.Output) {
				subtest.Errorf("incorrect number of classes.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(tt.Output)), strconv.Itoa(len(classes)))
				subtest.FailNow()
			}

			for i, class := range classes {
				switch response := class.(type) {
				case types.JavaAbstract:
					switch expected := tt.Output[i].(type) {
					case types.JavaAbstract:
						if !bytes.Equal(response.Package, expected.Package) {
							subtest.Errorf("testIndex: %s. incorrect package.\nexpected: %s\ngot: %s\n", strconv.Itoa(testIndex), string(expected.Package), string(response.Package))
						} else if !bytes.Equal(response.Name, expected.Name) {
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
							} else if !bytes.Equal(response.Methods[index].Functionality, variable.Functionality) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Functionality), string(response.Methods[index].Functionality))
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

				case types.JavaClass:
					switch expected := tt.Output[i].(type) {
					case types.JavaClass:
						if !bytes.Equal(response.Package, expected.Package) {
							subtest.Errorf("testIndex: %s. incorrect package.\nexpected: %s\ngot: %s\n", strconv.Itoa(testIndex), string(expected.Package), string(response.Package))
						} else if !bytes.Equal(response.Name, expected.Name) {
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
							} else if !bytes.Equal(response.Methods[index].Functionality, variable.Functionality) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Functionality), string(response.Methods[index].Functionality))
							}

							// Print method name
							subtest.Logf("method: %s\n", string(variable.Name))

							// Print response method name
							subtest.Logf("response method: %s\n", string(response.Methods[index].Name))

							if len(response.Methods[index].Parameters) != len(variable.Parameters) {
								// Print all response parameters
								for _, param := range response.Methods[index].Parameters {
									subtest.Logf("response param: %s %s\n", string(param.Type), string(param.Name))
								}

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

				case types.JavaInterface:
					switch expected := tt.Output[i].(type) {
					case types.JavaInterface:
						if !bytes.Equal(response.Package, expected.Package) {
							subtest.Errorf("testIndex: %s. incorrect package.\nexpected: %s\ngot: %s\n", strconv.Itoa(testIndex), string(expected.Package), string(response.Package))
						} else if !bytes.Equal(response.Name, expected.Name) {
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
							} else if !bytes.Equal(response.Methods[index].Functionality, variable.Functionality) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(variable.Functionality), string(response.Methods[index].Functionality))
							}

							if len(response.Methods[index].Parameters) != len(variable.Parameters) {
								subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(expected.Methods[index].Parameters)), strconv.Itoa(len(variable.Parameters)))
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
					switch expected := tt.Output[i].(type) {
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

func TestGetEnumDeclarations(t *testing.T) {
	type EnumTest struct {
		Input  []byte
		Output [][]byte
	}

	var tests = []EnumTest{
		{
			[]byte("H(\"Hydrogen\"),HE(\"Helium\"),NE(\"Neon\");public final String label;private Element(String label){this.label=label;}"),
			[][]byte{
				[]byte("H"),
				[]byte("HE"),
				[]byte("NE"),
			},
		},
		{
			[]byte("Hello1,Hello2,Hello3"),
			[][]byte{
				[]byte("Hello1"),
				[]byte("Hello2"),
				[]byte("Hello3"),
			},
		},
		{
			[]byte("Hello1,Hello2;"),
			[][]byte{
				[]byte("Hello1"),
				[]byte("Hello2"),
			},
		},
		{
			[]byte("Hello1;"),
			[][]byte{
				[]byte("Hello1"),
			},
		},
		{
			[]byte("Hello1,"),
			[][]byte{
				[]byte("Hello1"),
			},
		},
		{
			[]byte("Hello1,Hello2,"),
			[][]byte{
				[]byte("Hello1"),
				[]byte("Hello2"),
			},
		},
		{
			[]byte("Hello1"),
			[][]byte{
				[]byte("Hello1"),
			},
		},
	}

	for testIndex, tt := range tests {
		t.Run("Test index "+strconv.Itoa(testIndex), func(subtest *testing.T) {
			response := getEnumDeclarations(tt.Input)

			if len(response) != len(tt.Output) {
				subtest.Errorf("incorrect length.\nexpected: %s\ngot: %s\n", strconv.Itoa(len(tt.Output)), strconv.Itoa(len(response)))
				subtest.FailNow()
			}

			for index, expected := range tt.Output {
				if !bytes.Equal(response[index], expected) {
					subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected), string(response[index]))
				}
			}
		})
	}
}
