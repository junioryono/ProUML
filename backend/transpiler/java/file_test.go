package java

import (
	"bytes"
	"errors"
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
			Name:    "Test1",
		},
		Err: &types.CannotParseText{},
	}

	test2 := types.TestFileResponse{
		Name: "valid - includes package, import, class",
		Input: types.File{
			Name:      "Test2",
			Extension: "java",
			Code:      []byte("package com.houarizegai.calculator;import java.awt.Cursor;public class Test2{public static void main(String args[]){System.out.println();System.out.println();}}"),
		},
		Output: &types.FileResponse{
			Package: "com.houarizegai.calculator",
			Name:    "Test2",
			Data: types.JavaClass{
				Implements: nil,
				Extends:    nil,
			},
		},
		Err: nil,
	}

	test3 := types.TestFileResponse{
		Name: "valid - includes package, class",
		Input: types.File{
			Name:      "Test3",
			Extension: "java",
			Code:      []byte("package com.houarizegai.calculator;public class Test3{public static void main(String args[]){System.out.println();System.out.println();}}"),
		},
		Output: &types.FileResponse{
			Package: "com.houarizegai.calculator",
			Name:    "Test3",
			Data: types.JavaClass{
				Implements: nil,
				Extends:    nil,
			},
		},
		Err: nil,
	}

	test4 := types.TestFileResponse{
		Name: "valid - includes package, import",
		Input: types.File{
			Name:      "Test4",
			Extension: "java",
			Code:      []byte("import java.awt.Cursor;public class Test4{public static void main(String args[]){System.out.println();System.out.println();}}"),
		},
		Output: &types.FileResponse{
			Package: "",
			Name:    "Test4",
			Data: types.JavaClass{
				Implements: nil,
				Extends:    nil,
			},
		},
		Err: nil,
	}

	test5 := types.TestFileResponse{
		Name: "valid - includes class",
		Input: types.File{
			Name:      "Test5",
			Extension: "java",
			Code:      []byte("public class Test5{public static void main(String args[]){System.out.println();System.out.println();}}"),
		},
		Output: &types.FileResponse{
			Package: "",
			Name:    "Test5",
			Data: types.JavaClass{
				Implements: nil,
				Extends:    nil,
			},
		},
		Err: nil,
	}

	test6 := types.TestFileResponse{
		Name: "valid - includes class, extends",
		Input: types.File{
			Name:      "Test5",
			Extension: "java",
			Code:      []byte("public class Test5 extends Test,Hello,Yes{public static void main(String args[]){System.out.println();System.out.println();}}"),
		},
		Output: &types.FileResponse{
			Package: "",
			Name:    "Test5",
			Data: types.JavaClass{
				Implements: nil,
				Extends:    [][]byte{[]byte("Test"), []byte("Hello"), []byte("Yes")},
			},
		},
		Err: nil,
	}

	var tests = []types.TestFileResponse{test1, test2, test3, test4, test5, test6}

	for _, tt := range tests {
		t.Run(tt.Name, func(subtest *testing.T) {
			// subtest.Parallel()

			actualOutput, err := parseFile(tt.Input)

			if actualOutput.Package != tt.Output.Package {
				subtest.Errorf("incorrect package.\ngot:\n%s\nneed:\n%s\n", actualOutput.Package, tt.Output.Package)
			}

			if actualOutput.Name != tt.Output.Name {
				subtest.Errorf("incorrect name.\ngot:\n%s\nneed:\n%s\n", actualOutput.Name, tt.Output.Name)
			}

			if !errors.Is(err, tt.Err) {
				subtest.Errorf("incorrect error")
			}

			if err != nil {
				return
			}

			switch responseFile := actualOutput.Data.(type) {
			case types.JavaAbstract:
				for index, word := range responseFile.Extends {
					switch expectedFile := tt.Output.Data.(type) {
					case types.JavaAbstract:
						if index > len(expectedFile.Extends)-1 {
							subtest.Errorf("out of bounds error")
						} else if !bytes.Equal(expectedFile.Extends[index], word) {
							subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expectedFile.Extends[index]), string(word))
						}
					default:
						subtest.Errorf("incorrect response type")
					}
				}

				for index, word := range responseFile.Implements {
					switch expectedFile := tt.Output.Data.(type) {
					case types.JavaAbstract:
						if index > len(expectedFile.Implements)-1 {
							subtest.Errorf("out of bounds error")
						} else if !bytes.Equal(expectedFile.Implements[index], word) {
							subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expectedFile.Extends[index]), string(word))
						}
					default:
						subtest.Errorf("incorrect response type")
					}
				}
			case types.JavaClass:
				for index, word := range responseFile.Extends {
					switch expectedFile := tt.Output.Data.(type) {
					case types.JavaClass:
						if index > len(expectedFile.Extends)-1 {
							subtest.Errorf("out of bounds error")
						} else if !bytes.Equal(expectedFile.Extends[index], word) {
							subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expectedFile.Extends[index]), string(word))
						}
					default:
						subtest.Errorf("incorrect response type")
					}
				}

				for index, word := range responseFile.Implements {
					switch expectedFile := tt.Output.Data.(type) {
					case types.JavaClass:
						if index > len(expectedFile.Implements)-1 {
							subtest.Errorf("out of bounds error")
						} else if !bytes.Equal(expectedFile.Implements[index], word) {
							subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expectedFile.Extends[index]), string(word))
						}
					default:
						subtest.Errorf("incorrect response type")
					}
				}
			case types.JavaInterface:
				for index, word := range responseFile.Extends {
					switch expectedFile := tt.Output.Data.(type) {
					case types.JavaInterface:
						if index > len(expectedFile.Extends)-1 {
							subtest.Errorf("out of bounds error")
						} else if !bytes.Equal(expectedFile.Extends[index], word) {
							subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expectedFile.Extends[index]), string(word))
						}
					default:
						subtest.Errorf("incorrect response type")
					}
				}
			case types.JavaEnum:
			default:
				subtest.Errorf("cannot get language response")
				subtest.Fail()
			}
		})
	}
}

func TestRemoveQuotes(t *testing.T) {
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
					System.out.println('Hello Java'); // UIEHQW

					/* IOEWJQIOJE
						*
						* wopqkepoqk
						* q
						* q
						* q
						*
						*/ System.out.println("Hello Java"); 
						System.out.println("My name's Mila"); 
						System.out.println(` + "`" + `My name's Mila` + "`" + `); 
						System.out.println("My name` + "`" + `s Mila"); 
				}`),
		Output: []byte(`
			public class Test {
				public static void main(String args[]) {
					System.out.println(); // UIEHQW

					/* IOEWJQIOJE
						*
						* wopqkepoqk
						* q
						* q
						* q
						*
						*/ System.out.println(); 
						System.out.println(); 
						System.out.println(); 
						System.out.println(); 
				}`),
		Err: nil,
	}

	var tests = []types.TestByteSlice{test1, test2}

	for _, tt := range tests {
		t.Run(tt.Name, func(subtest *testing.T) {
			// subtest.Parallel()

			var (
				res []byte
				err error
			)

			res, err = removeQuotes(tt.Input)

			if !bytes.Equal(res, tt.Output) {
				subtest.Errorf("incorrect response.\ngot:\n%s\nneed:\n%s\n", string(res), string(tt.Output))
			}

			if !errors.Is(err, tt.Err) {
				subtest.Errorf("incorrect error")
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
		Name: "valid - test class",
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

	var tests = []types.TestByteSlice{test1, test2}

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
				
				System.out.println(); 

				 System.out.println(); 
			}

			
									}   `),
		Output: []byte("public class Test{public static void main(String args[]){System.out.println();System.out.println();}}"),
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

func TestSetFileTypeAndAssociations(t *testing.T) {
	test1 := types.TestFileResponse{
		Name: "invalid - no code inside file",
		Input: types.File{
			Name:      "Test1",
			Extension: "java",
			Code:      nil,
		},
		Output: &types.FileResponse{
			Package: "",
			Name:    "",
		},
		Err: &types.CannotParseText{},
	}

	test2 := types.TestFileResponse{
		Name: "valid - includes package, import, class",
		Input: types.File{
			Name:      "Test2",
			Extension: "java",
			Code:      []byte("package com.houarizegai.calculator;import java.awt.Cursor;public class Test2{public static void main(String args[]){System.out.println();System.out.println();}}"),
		},
		Output: &types.FileResponse{
			Package: "",
			Name:    "Test2",
			Data: types.JavaClass{
				Implements: nil,
				Extends:    nil,
			},
		},
		Err: nil,
	}

	test3 := types.TestFileResponse{
		Name: "valid - includes package, class",
		Input: types.File{
			Name:      "Test3",
			Extension: "java",
			Code:      []byte("package com.houarizegai.calculator;public class Test3{public static void main(String args[]){System.out.println();System.out.println();}}"),
		},
		Output: &types.FileResponse{
			Package: "",
			Name:    "Test3",
			Data: types.JavaClass{
				Implements: nil,
				Extends:    nil,
			},
		},
		Err: nil,
	}

	test4 := types.TestFileResponse{
		Name: "valid - includes package, import",
		Input: types.File{
			Name:      "Test4",
			Extension: "java",
			Code:      []byte("import java.awt.Cursor;public class Test4{public static void main(String args[]){System.out.println();System.out.println();}}"),
		},
		Output: &types.FileResponse{
			Package: "",
			Name:    "Test4",
			Data: types.JavaClass{
				Implements: nil,
				Extends:    nil,
			},
		},
		Err: nil,
	}

	test5 := types.TestFileResponse{
		Name: "valid - includes class",
		Input: types.File{
			Name:      "Test5",
			Extension: "java",
			Code:      []byte("public class Test5{public static void main(String args[]){System.out.println();System.out.println();}}"),
		},
		Output: &types.FileResponse{
			Package: "",
			Name:    "Test5",
			Data: types.JavaClass{
				Implements: nil,
				Extends:    nil,
			},
		},
		Err: nil,
	}

	test6 := types.TestFileResponse{
		Name: "valid - includes class, extends",
		Input: types.File{
			Name:      "Test5",
			Extension: "java",
			Code:      []byte("public class Test5 extends Test,Hello,Yes{public static void main(String args[]){System.out.println();System.out.println();}}"),
		},
		Output: &types.FileResponse{
			Package: "",
			Name:    "Test5",
			Data: types.JavaClass{
				Implements: nil,
				Extends:    [][]byte{[]byte("Test"), []byte("Hello"), []byte("Yes")},
			},
		},
		Err: nil,
	}

	var tests = []types.TestFileResponse{test1, test2, test3, test4, test5, test6}

	for _, tt := range tests {
		t.Run(tt.Name, func(subtest *testing.T) {
			// subtest.Parallel()
			response := *tt.Output

			tt.Output.Name = tt.Input.Name // This is implemented in the code
			err := setFileTypeAndAssociations(&response, tt.Input.Code)

			if tt.Input.Name != tt.Output.Name {
				subtest.Errorf("incorrect name.\ngot:\n%s\nneed:\n%s\n", tt.Output.Name, tt.Input.Name)
			}

			if !errors.Is(err, tt.Err) {
				subtest.Errorf("incorrect error")
			}

			if err != nil {
				return
			}

			switch responseFile := response.Data.(type) {
			case types.JavaAbstract:
				for index, word := range responseFile.Extends {
					switch expectedFile := tt.Output.Data.(type) {
					case types.JavaAbstract:
						if index > len(expectedFile.Extends)-1 {
							subtest.Errorf("out of bounds error")
						} else if !bytes.Equal(expectedFile.Extends[index], word) {
							subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expectedFile.Extends[index]), string(word))
						}
					default:
						subtest.Errorf("incorrect response type")
					}
				}

				for index, word := range responseFile.Implements {
					switch expectedFile := tt.Output.Data.(type) {
					case types.JavaAbstract:
						if index > len(expectedFile.Implements)-1 {
							subtest.Errorf("out of bounds error")
						} else if !bytes.Equal(expectedFile.Implements[index], word) {
							subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expectedFile.Extends[index]), string(word))
						}
					default:
						subtest.Errorf("incorrect response type")
					}
				}
			case types.JavaClass:
				for index, word := range responseFile.Extends {
					switch expectedFile := tt.Output.Data.(type) {
					case types.JavaClass:
						if index > len(expectedFile.Extends)-1 {
							subtest.Errorf("out of bounds error")
						} else if !bytes.Equal(expectedFile.Extends[index], word) {
							subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expectedFile.Extends[index]), string(word))
						}
					default:
						subtest.Errorf("incorrect response type")
					}
				}

				for index, word := range responseFile.Implements {
					switch expectedFile := tt.Output.Data.(type) {
					case types.JavaClass:
						if index > len(expectedFile.Implements)-1 {
							subtest.Errorf("out of bounds error")
						} else if !bytes.Equal(expectedFile.Implements[index], word) {
							subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expectedFile.Extends[index]), string(word))
						}
					default:
						subtest.Errorf("incorrect response type")
					}
				}
			case types.JavaInterface:
				for index, word := range responseFile.Extends {
					switch expectedFile := tt.Output.Data.(type) {
					case types.JavaInterface:
						if index > len(expectedFile.Extends)-1 {
							subtest.Errorf("out of bounds error")
						} else if !bytes.Equal(expectedFile.Extends[index], word) {
							subtest.Errorf("bytes are not equal.\nexpected:\n%s\ngot:\n%s\n", string(expectedFile.Extends[index]), string(word))
						}
					default:
						subtest.Errorf("incorrect response type")
					}
				}
			case types.JavaEnum:
			default:
				subtest.Errorf("cannot get language response")
				subtest.Fail()
			}
		})
	}
}
