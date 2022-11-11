package java

import (
	"bytes"
	"errors"
	"reflect"
	"strconv"
	"testing"

	types "github.com/junioryono/ProUML/backend/transpiler/types"
)

func TestParseFile(t *testing.T) {
	test1 := types.TestFileResponse{
		Name: "invalid - no code inside file",
		Input: types.File{
			Name:      "Test1",
			Extension: "java",
			Code:      nil,
		},
		Output: &types.FileResponse{
			Package: "",
			Data:    nil,
		},
		Err: &types.CannotParseText{},
	}

	test2 := types.TestFileResponse{
		Name: "valid - includes package, import, class",
		Input: types.File{
			Name:      "Test2",
			Extension: "java",
			Code:      []byte("package com.houarizegai.calculator;import java.awt.Cursor;public class Test2{public static void main(String args[]){System.out.println('Hello');System.out.println('Hello');}}"),
		},
		Output: &types.FileResponse{
			Package: "com.houarizegai.calculator",
			Data: []any{
				types.JavaClass{
					Name:       []byte("Test2"),
					Implements: nil,
					Extends:    nil,
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
			Code:      []byte("package com.houarizegai.calculator;public class Test3{public static void main(String args[]){System.out.println('Hello');System.out.println('Hello');}}"),
		},
		Output: &types.FileResponse{
			Package: "com.houarizegai.calculator",
			Data: []any{
				types.JavaClass{
					Name:       []byte("Test3"),
					Implements: nil,
					Extends:    nil,
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
			Code:      []byte("import java.awt.Cursor;public class Test4{public static void main(String args[]){System.out.println('Hello');System.out.println('Hello');}}"),
		},
		Output: &types.FileResponse{
			Package: "",
			Data: []any{
				types.JavaClass{
					Name:       []byte("Test4"),
					Implements: nil,
					Extends:    nil,
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
			Code:      []byte("public class Test5{public static void main(String args[]){System.out.println('Hello');System.out.println('Hello');}}"),
		},
		Output: &types.FileResponse{
			Package: "",
			Data: []any{
				types.JavaClass{
					Name:       []byte("Test5"),
					Implements: nil,
					Extends:    nil,
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
			Code:      []byte("public class Test6 extends Test,Hello,Yes{public static void main(String args[]){System.out.println('Hello');System.out.println('Hello');}}"),
		},
		Output: &types.FileResponse{
			Package: "",
			Data: []any{
				types.JavaClass{
					Name:       []byte("Test6"),
					Implements: nil,
					Extends:    [][]byte{[]byte("Test"), []byte("Hello"), []byte("Yes")},
				},
			},
		},
		Err: nil,
	}

	var tests = []types.TestFileResponse{test1, test2, test3, test4, test5, test6}

	for _, tt := range tests {
		t.Run(tt.Name, func(subtest *testing.T) {
			// subtest.Parallel()

			actualOutput, err := parseFile(tt.Input)

			if !errors.Is(err, tt.Err) {
				subtest.Errorf("incorrect error")
			}

			if err != nil {
				return
			}

			if actualOutput.Package != tt.Output.Package {
				subtest.Errorf("incorrect package.\ngot:\n%s\nneed:\n%s\n", actualOutput.Package, tt.Output.Package)
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
							subtest.Errorf("incorrect class name on index %s", strconv.Itoa(i))
						} else if !bytes.Equal(response.DefinedWithin, expected.DefinedWithin) {
							subtest.Errorf("incorrect defined within on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.DefinedWithin, response.DefinedWithin)
						}

						for index, word := range response.Extends {
							if index > len(expected.Extends)-1 {
								subtest.Errorf("out of bounds error")
							} else if !bytes.Equal(expected.Extends[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Extends[index]), string(word))
							}
						}

						for index, word := range response.Implements {
							if index > len(expected.Implements)-1 {
								subtest.Errorf("out of bounds error")
							} else if !bytes.Equal(expected.Implements[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Implements[index]), string(word))
							}
						}
					default:
						subtest.Errorf("incorrect response type")
					}

				case types.JavaClass:
					switch expected := tt.Output.Data[i].(type) {
					case types.JavaClass:
						if !bytes.Equal(response.Name, expected.Name) {
							subtest.Errorf("incorrect class name on index %s", strconv.Itoa(i))
						} else if !bytes.Equal(response.DefinedWithin, expected.DefinedWithin) {
							subtest.Errorf("incorrect defined within on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.DefinedWithin, response.DefinedWithin)
						}

						for index, word := range response.Extends {
							if index > len(expected.Extends)-1 {
								subtest.Errorf("out of bounds error")
							} else if !bytes.Equal(expected.Extends[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Extends[index]), string(word))
							}
						}

						for index, word := range response.Implements {
							if index > len(expected.Implements)-1 {
								subtest.Errorf("out of bounds error")
							} else if !bytes.Equal(expected.Implements[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Implements[index]), string(word))
							}
						}
					default:
						subtest.Errorf("incorrect response type")
					}

				case types.JavaInterface:
					switch expected := tt.Output.Data[i].(type) {
					case types.JavaInterface:
						if !bytes.Equal(response.Name, expected.Name) {
							subtest.Errorf("incorrect class name on index %s", strconv.Itoa(i))
						} else if !bytes.Equal(response.DefinedWithin, expected.DefinedWithin) {
							subtest.Errorf("incorrect defined within on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.DefinedWithin, response.DefinedWithin)
						}

						for index, word := range response.Extends {
							if index > len(expected.Extends)-1 {
								subtest.Errorf("out of bounds error")
							} else if !bytes.Equal(expected.Extends[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Extends[index]), string(word))
							}
						}
					default:
						subtest.Errorf("incorrect response type")
					}

				case types.JavaEnum:
				default:
					subtest.Errorf("cannot get language response %s", reflect.TypeOf(class))
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
				public static void main(String args[]) {
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
				
				public static void main(String args[]) {
					
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
				public static void main(String args[]) {
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
				
				public static void main(String args[]) {
					
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
				public static void main(String args[]) {
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
				
				public static void main(String args[]) {
					
					System.out.println('Hello /* wmkqoem */ Java'); 

					 System.out.println('Hello Java');
				}

				
										}   `),
		Err: nil,
	}

	var tests = []types.TestByteSlice{test1, test2, test3, test4, test5}

	for _, tt := range tests {
		t.Run(tt.Name, func(subtest *testing.T) {
			// subtest.Parallel()

			var (
				res []byte
				err error
			)

			res, err = removeComments(tt.Input)

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
			// subtest.Parallel()

			var (
				res []byte
				err error
			)

			res, err = getPackageName(tt.Input)

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
			
			public static void main(String args[]) {
				
				System.out.println('Hello'); 

				 System.out.println('Hello'); 
			}

			
									}   `),
		Output: []byte("public class Test{public static void main(String args[]){System.out.println('Hello');System.out.println('Hello');}}"),
		Err:    nil,
	}

	var tests = []types.TestByteSlice{test1, test2}

	for _, tt := range tests {
		t.Run(tt.Name, func(subtest *testing.T) {
			// subtest.Parallel()

			var (
				res []byte
				err error
			)

			res, err = removeSpacing(tt.Input)

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
			Package: "",
			Data:    nil,
		},
		Err: &types.CannotParseText{},
	}

	test2 := types.TestFileResponse{
		Name: "valid - includes package, import, class",
		Input: types.File{
			Name:      "Test2",
			Extension: "java",
			Code:      []byte("package com.houarizegai.calculator;import java.awt.Cursor;public class Test2{public static void main(String args[]){System.out.println('Hello');System.out.println('Hello');}}"),
		},
		Output: &types.FileResponse{
			Package: "",
			Data: []any{
				types.JavaClass{
					Name:       []byte("Test2"),
					Implements: nil,
					Extends:    nil,
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
			Code:      []byte("package com.houarizegai.calculator;public class Test3{public static void main(String args[]){System.out.println('Hello');System.out.println('Hello');}}"),
		},
		Output: &types.FileResponse{
			Package: "",
			Data: []any{
				types.JavaClass{
					Name:       []byte("Test3"),
					Implements: nil,
					Extends:    nil,
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
			Code:      []byte("import java.awt.Cursor;public class Test4{public static void main(String args[]){System.out.println('Hello');System.out.println('Hello');}}"),
		},
		Output: &types.FileResponse{
			Package: "",
			Data: []any{
				types.JavaClass{
					Name:       []byte("Test4"),
					Implements: nil,
					Extends:    nil,
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
			Code:      []byte("public class Test5{public static void main(String args[]){System.out.println('Hello');System.out.println('Hello');}}"),
		},
		Output: &types.FileResponse{
			Package: "",
			Data: []any{
				types.JavaClass{
					Name:       []byte("Test5"),
					Implements: nil,
					Extends:    nil,
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
			Code:      []byte("public class Test6 extends Test,Hello,Yes{public static void main(String args[]){System.out.println('Hello');System.out.println('Hello');}}"),
		},
		Output: &types.FileResponse{
			Package: "",
			Data: []any{
				types.JavaClass{
					Name:       []byte("Test6"),
					Implements: nil,
					Extends:    [][]byte{[]byte("Test"), []byte("Hello"), []byte("Yes")},
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
			Package: "",
			Data: []any{
				types.JavaClass{
					Name:       []byte("Test"),
					Implements: nil,
					Extends:    nil,
				},
				types.JavaInterface{
					DefinedWithin: []byte("Test"),
					Name:          []byte("Yes"),
					Extends:       nil,
				},
				types.JavaClass{
					Name:       []byte("Testing"),
					Implements: [][]byte{[]byte("Test.Yes")},
					Extends:    nil,
				},
				types.JavaClass{
					Name:       []byte("A"),
					Implements: nil,
					Extends:    nil,
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
			Code:      []byte("import java.util.*;class Test{protected interface Yes{void show();}public void TestVoid(){}}class Testing implements Test.Yes{public void show(){System.out.println('show method of interface');}}class A{Test inner1;public Testing inner2 = new Testing();private static Test.Yes inner3 = new Testing();protected final Test.Yes inner4 = \"Hello\";static final Test.Yes inner5 = null;protected static final Test.Yes inner6 = null;public static void main(String[] args){Test.Yes obj;Testing t = new Testing();obj = t;obj.show();}Testing function1(Test.Yes var1, Test var2){};Testing function2();abstract void function3() {};static Testing function4(){}final Testing function5();static final void function6(){};public abstract void function7();private static Testing function8(){};protected final Testing function9() {};public static final void function10() {};}"),
		},
		Output: &types.FileResponse{
			Package: "",
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
				},
			},
		},
		Err: nil,
	}

	var tests = []types.TestFileResponse{test1, test2, test3, test4, test5, test6, test7, test8}

	for testIndex, tt := range tests {
		t.Run(tt.Name, func(subtest *testing.T) {
			// subtest.Parallel()

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

						for index, word := range response.Extends {
							if index > len(expected.Extends)-1 {
								subtest.Errorf("out of bounds error")
							} else if !bytes.Equal(expected.Extends[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Extends[index]), string(word))
							}
						}

						for index, word := range response.Implements {
							if index > len(expected.Implements)-1 {
								subtest.Errorf("out of bounds error")
							} else if !bytes.Equal(expected.Implements[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Implements[index]), string(word))
							}
						}

						for index, variable := range response.Variables {
							if index > len(expected.Variables)-1 {
								subtest.Errorf("out of bounds error")
							} else if !bytes.Equal(expected.Variables[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Variables[index].Type), string(variable.Type))
							} else if !bytes.Equal(expected.Variables[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Variables[index].Name), string(variable.Name))
							} else if !bytes.Equal(expected.Variables[index].Value, variable.Value) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Variables[index].Value), string(variable.Value))
							} else if !bytes.Equal(expected.Variables[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Variables[index].AccessModifier), string(variable.AccessModifier))
							} else if expected.Variables[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", expected.Variables[index].Static, variable.Static)
							} else if expected.Variables[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", expected.Variables[index].Final, variable.Final)
							}
						}

						for index, variable := range response.Methods {
							if index > len(expected.Methods)-1 {
								subtest.Errorf("out of bounds error")
							} else if !bytes.Equal(expected.Methods[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Methods[index].Type), string(variable.Type))
							} else if !bytes.Equal(expected.Methods[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Methods[index].Name), string(variable.Name))
							} else if !bytes.Equal(expected.Methods[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Methods[index].AccessModifier), string(variable.AccessModifier))
							} else if expected.Methods[index].Abstract != variable.Abstract {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", expected.Methods[index].Abstract, variable.Abstract)
							} else if expected.Methods[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", expected.Methods[index].Static, variable.Static)
							} else if expected.Methods[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", expected.Methods[index].Final, variable.Final)
							}

							for indexParam, parameter := range variable.Parameters {
								if indexParam > len(variable.Parameters)-1 {
									subtest.Errorf("out of bounds error")
								} else if !bytes.Equal(expected.Methods[index].Parameters[indexParam].Type, parameter.Type) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Methods[index].Parameters[indexParam].Type), string(parameter.Type))
								} else if !bytes.Equal(expected.Methods[index].Parameters[indexParam].Name, parameter.Name) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Methods[index].Parameters[indexParam].Name), string(variable.Name))
								}
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

						for index, word := range response.Extends {
							if index > len(expected.Extends)-1 {
								subtest.Errorf("out of bounds error")
							} else if !bytes.Equal(expected.Extends[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Extends[index]), string(word))
							}
						}

						for index, word := range response.Implements {
							if index > len(expected.Implements)-1 {
								subtest.Errorf("out of bounds error")
							} else if !bytes.Equal(expected.Implements[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Implements[index]), string(word))
							}
						}

						for index, variable := range response.Variables {
							if index > len(expected.Variables)-1 {
								subtest.Errorf("out of bounds error")
							} else if !bytes.Equal(expected.Variables[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Variables[index].Type), string(variable.Type))
							} else if !bytes.Equal(expected.Variables[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Variables[index].Name), string(variable.Name))
							} else if !bytes.Equal(expected.Variables[index].Value, variable.Value) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Variables[index].Value), string(variable.Value))
							} else if !bytes.Equal(expected.Variables[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Variables[index].AccessModifier), string(variable.AccessModifier))
							} else if expected.Variables[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", expected.Variables[index].Static, variable.Static)
							} else if expected.Variables[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", expected.Variables[index].Final, variable.Final)
							}
						}

						for index, variable := range response.Methods {
							if index > len(expected.Methods)-1 {
								subtest.Errorf("out of bounds error")
							} else if !bytes.Equal(expected.Methods[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Methods[index].Type), string(variable.Type))
							} else if !bytes.Equal(expected.Methods[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Methods[index].Name), string(variable.Name))
							} else if !bytes.Equal(expected.Methods[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Methods[index].AccessModifier), string(variable.AccessModifier))
							} else if expected.Methods[index].Abstract != variable.Abstract {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", expected.Methods[index].Abstract, variable.Abstract)
							} else if expected.Methods[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", expected.Methods[index].Static, variable.Static)
							} else if expected.Methods[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", expected.Methods[index].Final, variable.Final)
							}

							for indexParam, parameter := range variable.Parameters {
								if indexParam > len(variable.Parameters)-1 {
									subtest.Errorf("out of bounds error")
								} else if !bytes.Equal(expected.Methods[index].Parameters[indexParam].Type, parameter.Type) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Methods[index].Parameters[indexParam].Type), string(parameter.Type))
								} else if !bytes.Equal(expected.Methods[index].Parameters[indexParam].Name, parameter.Name) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Methods[index].Parameters[indexParam].Name), string(variable.Name))
								}
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

						for index, word := range response.Extends {
							if index > len(expected.Extends)-1 {
								subtest.Errorf("out of bounds error")
							} else if !bytes.Equal(expected.Extends[index], word) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Extends[index]), string(word))
							}
						}

						for index, variable := range response.Variables {
							if index > len(expected.Variables)-1 {
								subtest.Errorf("out of bounds error")
							} else if !bytes.Equal(expected.Variables[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Variables[index].Type), string(variable.Type))
							} else if !bytes.Equal(expected.Variables[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Variables[index].Name), string(variable.Name))
							} else if !bytes.Equal(expected.Variables[index].Value, variable.Value) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Variables[index].Value), string(variable.Value))
							} else if !bytes.Equal(expected.Variables[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Variables[index].AccessModifier), string(variable.AccessModifier))
							} else if expected.Variables[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", expected.Variables[index].Static, variable.Static)
							} else if expected.Variables[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", expected.Variables[index].Final, variable.Final)
							}
						}

						for index, variable := range response.Methods {
							if index > len(expected.Methods)-1 {
								subtest.Errorf("out of bounds error")
							} else if !bytes.Equal(expected.Methods[index].Type, variable.Type) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Methods[index].Type), string(variable.Type))
							} else if !bytes.Equal(expected.Methods[index].Name, variable.Name) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Methods[index].Name), string(variable.Name))
							} else if !bytes.Equal(expected.Methods[index].AccessModifier, variable.AccessModifier) {
								subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Methods[index].AccessModifier), string(variable.AccessModifier))
							} else if expected.Methods[index].Abstract != variable.Abstract {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", expected.Methods[index].Abstract, variable.Abstract)
							} else if expected.Methods[index].Static != variable.Static {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", expected.Methods[index].Static, variable.Static)
							} else if expected.Methods[index].Final != variable.Final {
								subtest.Errorf("bytes are not equal.\nexpected:\n%t\ngot:\n%t\n", expected.Methods[index].Final, variable.Final)
							}

							for indexParam, parameter := range variable.Parameters {
								if indexParam > len(variable.Parameters)-1 {
									subtest.Errorf("out of bounds error")
								} else if !bytes.Equal(expected.Methods[index].Parameters[indexParam].Type, parameter.Type) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Methods[index].Parameters[indexParam].Type), string(parameter.Type))
								} else if !bytes.Equal(expected.Methods[index].Parameters[indexParam].Name, parameter.Name) {
									subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expected.Methods[index].Parameters[indexParam].Name), string(variable.Name))
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

func TestIsVariable(t *testing.T) {
	type TestIsVar struct {
		Input  []byte
		Output bool
	}

	var tests = []TestIsVar{
		{
			[]byte("void Hello();"),
			false,
		},
		{
			[]byte("void Hello(){}"),
			false,
		},
		{
			[]byte("void Hello(){};"),
			false,
		},
		{
			[]byte("void Hello(String var1)"),
			false,
		},
		{
			[]byte("void Hello(String var1);"),
			false,
		},
		{
			[]byte("void Hello(String var1, String var2)"),
			false,
		},
		{
			[]byte("void Hello(String var1, String var2);"),
			false,
		},
		{
			[]byte("String var;"),
			true,
		},
		{
			[]byte("String var = \"Hello\";"),
			true,
		},
		{
			[]byte("String var = 'Hello';"),
			true,
		},
		{
			[]byte("String var = `Hello`;"),
			true,
		},
		{
			[]byte("String var = '(Hello);"),
			true,
		},
		{
			[]byte("String var = new Test();"),
			true,
		},
		{
			[]byte("String var1, var2, var3;"),
			true,
		},
		{
			[]byte("String var1 = 'Hello', var2 = 'Hello', var3 = 'Hello';"),
			true,
		},
	}

	for testIndex, tt := range tests {
		t.Run("Test index "+strconv.Itoa(testIndex), func(subtest *testing.T) {
			// subtest.Parallel()

			actualOutput := isVariable(tt.Input)

			if tt.Output != actualOutput {
				subtest.Errorf("incorrect response.\ngot:\n%t\nneed:\n%t\n", actualOutput, tt.Output)
			}
		})
	}
}
