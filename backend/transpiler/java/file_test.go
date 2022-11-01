package java

import (
	"bytes"
	"errors"
	"testing"

	types "github.com/junioryono/ProUML/backend/transpiler/types"
)

func TestFileParse(t *testing.T) {
	test1 := types.TestFile{
		Name: "invalid - no code inside file",
		Input: types.File{
			Name:      "Test",
			Extension: "java",
			Code:      []byte(""),
		},
		Output: []byte(""),
		Err:    &types.CannotParseText{},
	}

	test2 := types.TestFile{
		Name: "valid - test class",
		Input: types.File{
			Name:      "Test",
			Extension: "java",
			Code:      []byte("public class Test { public static void main(String args[]){ System.out.println('Hello Java'); } }"),
		},
		Output: []byte(""),
		Err:    &types.CannotParseText{},
	}

	var tests = []types.TestFile{test1, test2}

	for _, tt := range tests {
		t.Run(tt.Name, func(subtest *testing.T) {
			subtest.Parallel()

			var (
				res []byte
				err error
			)

			res, err = parseFile(&tt.Input)

			incorrectResponse := !bytes.Equal(res, tt.Output)
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

func TestRemoveComments(t *testing.T) {
	test1 := types.TestByteSlice{
		Name:   "empty file",
		Input:  []byte(""),
		Output: []byte(""),
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

			incorrectResponse := !bytes.Equal(res, tt.Output)
			incorrectError := !errors.Is(err, tt.Err)

			if incorrectResponse {
				subtest.Errorf("incorrect response.\ngot:\n%s\nneed:\n%s\n", string(res), string(tt.Output))
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

func TestGetPackageName(t *testing.T) {
	test1 := types.TestByteSlice{
		Name:   "empty file",
		Input:  []byte(""),
		Output: []byte(""),
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
		Output: []byte(""),
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
		Output: []byte(""),
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

			incorrectResponse := !bytes.Equal(res, tt.Output)
			incorrectError := !errors.Is(err, tt.Err)

			if incorrectResponse {
				subtest.Errorf("incorrect response.\ngot:\n%s\nneed:\n%s\n", string(res), string(tt.Output))
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

func TestRemoveSpacing(t *testing.T) {
	test1 := types.TestByteSlice{
		Name:   "empty file",
		Input:  []byte(""),
		Output: []byte(""),
		Err:    &types.CannotParseText{},
	}

	test2 := types.TestByteSlice{
		Name: "valid - test class",
		Input: []byte(`
			
		public class Test {
			
			public static void main(String args[]) {
				
				System.out.println('Hello Java'); 

				 System.out.println('Hello Java'); 
			}

			
									}   `),
		Output: []byte("public class Test{public static void main(String args[]){System.out.println('Hello Java');System.out.println('Hello Java');}}"),
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

			incorrectResponse := !bytes.Equal(res, tt.Output)
			incorrectError := !errors.Is(err, tt.Err)

			if incorrectResponse {
				subtest.Errorf("incorrect response.\ngot:\n%s\nneed:\n%s\n", string(res), string(tt.Output))
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
