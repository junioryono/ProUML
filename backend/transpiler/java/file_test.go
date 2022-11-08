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
					Name:       "Test2",
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
					Name:       "Test3",
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
					Name:       "Test4",
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
					Name:       "Test5",
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
					Name:       "Test6",
					Implements: nil,
					Extends:    [][]byte{[]byte("Test"), []byte("Hello"), []byte("Yes")},
				},
			},
		},
		Err: nil,
	}

	var tests = []types.TestFileResponse{test1, test2, test3, test4, test5, test6}

	for testIndex, tt := range tests {
		t.Run(tt.Name, func(subtest *testing.T) {
			// subtest.Parallel()

			actualOutput, err := parseFile(tt.Input)

			if !errors.Is(err, tt.Err) {
				subtest.Errorf("incorrect error on test %s", strconv.Itoa(testIndex))
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
						if response.Name != expected.Name {
							subtest.Errorf("incorrect class name on index %s", strconv.Itoa(i))
						} else if response.DefinedWithin != expected.DefinedWithin {
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
						if response.Name != expected.Name {
							subtest.Errorf("incorrect class name on index %s", strconv.Itoa(i))
						} else if response.DefinedWithin != expected.DefinedWithin {
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
						if response.Name != expected.Name {
							subtest.Errorf("incorrect class name on index %s", strconv.Itoa(i))
						} else if response.DefinedWithin != expected.DefinedWithin {
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

	for testIndex, tt := range tests {
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
				subtest.Errorf("incorrect error on test %s", strconv.Itoa(testIndex))
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

	for testIndex, tt := range tests {
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
				subtest.Errorf("incorrect error on test %s", strconv.Itoa(testIndex))
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

	for testIndex, tt := range tests {
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
				subtest.Errorf("incorrect error on test %s", strconv.Itoa(testIndex))
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
					Name:       "Test2",
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
					Name:       "Test3",
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
					Name:       "Test4",
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
					Name:       "Test5",
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
					Name:       "Test6",
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
					Name:       "Test",
					Implements: nil,
					Extends:    nil,
				},
				types.JavaInterface{
					DefinedWithin: "Test",
					Name:          "Yes",
					Extends:       nil,
				},
				types.JavaClass{
					Name:       "Testing",
					Implements: [][]byte{[]byte("Test.Yes")},
					Extends:    nil,
				},
				types.JavaClass{
					Name:       "A",
					Implements: nil,
					Extends:    nil,
				},
			},
		},
		Err: nil,
	}

	var tests = []types.TestFileResponse{test1, test2, test3, test4, test5, test6, test7}

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
						if response.Name != expected.Name {
							subtest.Errorf("incorrect class name on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.Name, response.Name)
						} else if response.DefinedWithin != expected.DefinedWithin {
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
						if response.Name != expected.Name {
							subtest.Errorf("incorrect class name on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.Name, response.Name)
						} else if response.DefinedWithin != expected.DefinedWithin {
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
						if response.Name != expected.Name {
							subtest.Errorf("incorrect class name on index %s.\nexpected:\n%s\ngot:\n%s\n", strconv.Itoa(i), expected.Name, response.Name)
						} else if response.DefinedWithin != expected.DefinedWithin {
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
					subtest.Errorf("cannot get language response")
					subtest.Fail()
				}
			}
		})
	}
}
