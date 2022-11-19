package java

import (
	"bytes"
	"errors"
	"reflect"
	"strconv"
	"testing"

	types "github.com/junioryono/ProUML/backend/transpiler/types"
)

func TestProjectParse(t *testing.T) {
	var tests = []types.TestProject{}

	for testIndex, tt := range tests {
		t.Run("Test index "+strconv.Itoa(testIndex), func(subtest *testing.T) {
			_, err := ParseProject(tt.Input)

			incorrectError := !errors.Is(err, tt.Err)

			if incorrectError {
				subtest.Errorf("incorrect error")
			}

			if incorrectError {
				subtest.Fail()
			}
		})
	}
}

func TestGetClassRelations(t *testing.T) {
	type TestClassRelations struct {
		Input  []types.FileResponse
		Output []types.Relation
	}

	test1File1 := types.FileResponse{
		Data: []any{
			types.JavaInterface{
				Name: []byte("CharacterInterface"),
				Methods: []types.JavaMethod{
					{
						Type:           []byte("List<String>"),
						Name:           []byte("getSelectionPanel"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("void"),
						Name:           []byte("setStance"),
						AccessModifier: []byte("public"),
						Parameters: []types.JavaMethodParameter{
							{
								Type: []byte("String"),
								Name: []byte("stance"),
							},
						},
						Abstract: false,
						Static:   false,
						Final:    false,
					},
				},
			},
		},
	}

	test1File2 := types.FileResponse{
		Data: []any{
			types.JavaClass{
				Name: []byte("BeginnerCharacter"),
				Implements: [][]byte{
					[]byte("CharacterInterface"),
				},
				Variables: []types.JavaVariable{
					{
						Type:           []byte("String"),
						Name:           []byte("stance"),
						Value:          []byte("\"Standing\""),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("double"),
						Name:           []byte("maxSpeed"),
						Value:          []byte("90.3"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("int"),
						Name:           []byte("maxWeapons"),
						Value:          []byte("3"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("List<String>"),
						Name:           []byte("selectionPanel"),
						Value:          []byte("Collections.unmodifiableList(Arrays.asList(\"BC1\", \"BC2\", \"BC3\"))"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
				},
				Methods: []types.JavaMethod{
					{
						Type:           []byte("List<String>"),
						Name:           []byte("getSelectionPanel"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("void"),
						Name:           []byte("setStance"),
						AccessModifier: []byte("public"),
						Parameters: []types.JavaMethodParameter{
							{
								Type: []byte("String"),
								Name: []byte("stance"),
							},
						},
						Abstract: false,
						Static:   false,
						Final:    false,
					},
				},
			},
		},
	}

	test1File3 := types.FileResponse{
		Data: []any{
			types.JavaClass{
				Name: []byte("IntermediateCharacter"),
				Implements: [][]byte{
					[]byte("CharacterInterface"),
				},
				Variables: []types.JavaVariable{
					{
						Type:           []byte("String"),
						Name:           []byte("stance"),
						Value:          []byte("\"Standing\""),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("double"),
						Name:           []byte("maxSpeed"),
						Value:          []byte("50.9"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("int"),
						Name:           []byte("maxWeapons"),
						Value:          []byte("1"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("List<String>"),
						Name:           []byte("selectionPanel"),
						Value:          []byte("Collections.unmodifiableList(Arrays.asList(\"IC1\", \"IC2\", \"IC3\"))"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
				},
				Methods: []types.JavaMethod{
					{
						Type:           []byte("List<String>"),
						Name:           []byte("getSelectionPanel"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("void"),
						Name:           []byte("setStance"),
						AccessModifier: []byte("public"),
						Parameters: []types.JavaMethodParameter{
							{
								Type: []byte("String"),
								Name: []byte("stance"),
							},
						},
						Abstract: false,
						Static:   false,
						Final:    false,
					},
				},
			},
		},
	}

	test1File4 := types.FileResponse{
		Data: []any{
			types.JavaClass{
				Name: []byte("AdvancedCharacter"),
				Implements: [][]byte{
					[]byte("CharacterInterface"),
				},
				Variables: []types.JavaVariable{
					{
						Type:           []byte("String"),
						Name:           []byte("stance"),
						Value:          []byte("\"Standing\""),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("double"),
						Name:           []byte("maxSpeed"),
						Value:          []byte("70.4"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("int"),
						Name:           []byte("maxWeapons"),
						Value:          []byte("2"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("List<String>"),
						Name:           []byte("selectionPanel"),
						Value:          []byte("Collections.unmodifiableList(Arrays.asList(\"AC1\", \"AC2\", \"AC3\"))"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
				},
				Methods: []types.JavaMethod{
					{
						Type:           []byte("List<String>"),
						Name:           []byte("getSelectionPanel"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("void"),
						Name:           []byte("setStance"),
						AccessModifier: []byte("public"),
						Parameters: []types.JavaMethodParameter{
							{
								Type: []byte("String"),
								Name: []byte("stance"),
							},
						},
						Abstract: false,
						Static:   false,
						Final:    false,
					},
				},
			},
		},
	}

	test1File5 := types.FileResponse{
		Data: []any{
			types.JavaClass{
				Name: []byte("ModeFactory"),
				Methods: []types.JavaMethod{
					{
						Type:           []byte("ModeInterface"),
						Name:           []byte("createFactory"),
						AccessModifier: []byte("public"),
						Parameters: []types.JavaMethodParameter{
							{
								Type: []byte("String"),
								Name: []byte("mode"),
							},
						},
						Abstract: false,
						Static:   false,
						Final:    false,
					},
				},
				Associations: [][]byte{
					[]byte(""), // TODO
				},
			},
		},
	}

	test1File6 := types.FileResponse{
		Data: []any{
			types.JavaInterface{
				Name: []byte("ModeInterface"),
				Methods: []types.JavaMethod{
					{
						Type:           []byte("CharacterInterface"),
						Name:           []byte("createCharacter"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("WeaponInterface"),
						Name:           []byte("createWeapon"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
				},
			},
		},
	}

	test1File7 := types.FileResponse{
		Data: []any{
			types.JavaClass{
				Name: []byte("BeginnerFactory"),
				Implements: [][]byte{
					[]byte("ModeInterface"),
				},
				Methods: []types.JavaMethod{
					{
						Type:           []byte("CharacterInterface"),
						Name:           []byte("createCharacter"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("WeaponInterface"),
						Name:           []byte("createWeapon"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
				},
				Associations: [][]byte{
					[]byte(""), // TODO
				},
			},
		},
	}

	test1File8 := types.FileResponse{
		Data: []any{
			types.JavaClass{
				Name: []byte("IntermediateFactory"),
				Implements: [][]byte{
					[]byte("ModeInterface"),
				},
				Methods: []types.JavaMethod{
					{
						Type:           []byte("CharacterInterface"),
						Name:           []byte("createCharacter"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("WeaponInterface"),
						Name:           []byte("createWeapon"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
				},
				Associations: [][]byte{
					[]byte(""), // TODO
				},
			},
		},
	}

	test1File9 := types.FileResponse{
		Data: []any{
			types.JavaClass{
				Name: []byte("AdvancedFactory"),
				Implements: [][]byte{
					[]byte("ModeInterface"),
				},
				Methods: []types.JavaMethod{
					{
						Type:           []byte("CharacterInterface"),
						Name:           []byte("createCharacter"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("WeaponInterface"),
						Name:           []byte("createWeapon"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
				},
				Associations: [][]byte{
					[]byte(""), // TODO
				},
			},
		},
	}

	test1File10 := types.FileResponse{
		Data: []any{
			types.JavaInterface{
				Name: []byte("WeaponInterface"),
				Methods: []types.JavaMethod{
					{
						Type:           []byte("List<String>"),
						Name:           []byte("getSelectionPanel"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("void"),
						Name:           []byte("holdWeapon"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("void"),
						Name:           []byte("dropWeapon"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
				},
			},
		},
	}

	test1File11 := types.FileResponse{
		Data: []any{
			types.JavaClass{
				Name: []byte("BeginnerWeapon"),
				Implements: [][]byte{
					[]byte("WeaponInterface"),
				},
				Variables: []types.JavaVariable{
					{
						Type:           []byte("boolean"),
						Name:           []byte("weaponInPosition"),
						Value:          []byte("false"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("double"),
						Name:           []byte("damagePerHit"),
						Value:          []byte("40.7"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("double"),
						Name:           []byte("accuracy"),
						Value:          []byte("90.5"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("boolean"),
						Name:           []byte("scope"),
						Value:          []byte("true"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("List<String>"),
						Name:           []byte("selectionPanel"),
						Value:          []byte("Collections.unmodifiableList(Arrays.asList(\"BW1\", \"BW2\", \"BW3\"))"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
				},
				Methods: []types.JavaMethod{
					{
						Type:           []byte("List<String>"),
						Name:           []byte("getSelectionPanel"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("void"),
						Name:           []byte("holdWeapon"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("void"),
						Name:           []byte("dropWeapon"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
				},
			},
		},
	}

	test1File12 := types.FileResponse{
		Data: []any{
			types.JavaClass{
				Name: []byte("IntermediateWeapon"),
				Implements: [][]byte{
					[]byte("WeaponInterface"),
				},
				Variables: []types.JavaVariable{
					{
						Type:           []byte("boolean"),
						Name:           []byte("weaponInPosition"),
						Value:          []byte("false"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("double"),
						Name:           []byte("damagePerHit"),
						Value:          []byte("90.5"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("double"),
						Name:           []byte("accuracy"),
						Value:          []byte("20.2"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("boolean"),
						Name:           []byte("scope"),
						Value:          []byte("false"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("List<String>"),
						Name:           []byte("selectionPanel"),
						Value:          []byte("Collections.unmodifiableList(Arrays.asList(\"IW1\", \"IW2\", \"IW3\"))"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
				},
				Methods: []types.JavaMethod{
					{
						Type:           []byte("List<String>"),
						Name:           []byte("getSelectionPanel"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("void"),
						Name:           []byte("holdWeapon"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("void"),
						Name:           []byte("dropWeapon"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
				},
			},
		},
	}

	test1File13 := types.FileResponse{
		Data: []any{
			types.JavaClass{
				Name: []byte("AdvancedWeapon"),
				Implements: [][]byte{
					[]byte("WeaponInterface"),
				},
				Variables: []types.JavaVariable{
					{
						Type:           []byte("boolean"),
						Name:           []byte("weaponInPosition"),
						Value:          []byte("false"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("double"),
						Name:           []byte("damagePerHit"),
						Value:          []byte("60.1"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("double"),
						Name:           []byte("accuracy"),
						Value:          []byte("39.4"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("boolean"),
						Name:           []byte("scope"),
						Value:          []byte("true"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("List<String>"),
						Name:           []byte("selectionPanel"),
						Value:          []byte("Collections.unmodifiableList(Arrays.asList(\"AW1\", \"AW2\", \"AW3\"))"),
						AccessModifier: []byte("public"),
						Static:         false,
						Final:          false,
					},
				},
				Methods: []types.JavaMethod{
					{
						Type:           []byte("List<String>"),
						Name:           []byte("getSelectionPanel"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("void"),
						Name:           []byte("holdWeapon"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
					{
						Type:           []byte("void"),
						Name:           []byte("dropWeapon"),
						AccessModifier: []byte("public"),
						Abstract:       false,
						Static:         false,
						Final:          false,
					},
				},
			},
		},
	}

	test1File14 := types.FileResponse{
		Data: []any{
			types.JavaClass{
				Name: []byte("Client"),
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
						Abstract: false,
						Static:   true,
						Final:    false,
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
						Abstract: false,
						Static:   true,
						Final:    false,
					},
				},
				Associations: [][]byte{
					[]byte(""), // TODO
				},
			},
		},
	}

	var tests = []TestClassRelations{
		{
			Input: []types.FileResponse{test1File1, test1File2, test1File3, test1File4, test1File5, test1File6, test1File7, test1File8, test1File9, test1File10, test1File11, test1File12, test1File13, test1File14},
			Output: []types.Relation{
				{
					FromClassId: []byte("Client"),
					ToClassId:   []byte("WeaponInterface"),
					Type:        &types.Association{},
				},
				{
					FromClassId: []byte("Client"),
					ToClassId:   []byte("CharacterInterface"),
					Type:        &types.Association{},
				},
				{
					FromClassId: []byte("Client"),
					ToClassId:   []byte("ModeFactory"),
					Type:        &types.Association{},
				},
				{
					FromClassId: []byte("Client"),
					ToClassId:   []byte("ModeInterface"),
					Type:        &types.Association{},
				},
				{
					FromClassId: []byte("BeginnerWeapon"),
					ToClassId:   []byte("WeaponInterface"),
					Type:        &types.Realization{},
				},
				{
					FromClassId: []byte("IntermediateWeapon"),
					ToClassId:   []byte("WeaponInterface"),
					Type:        &types.Realization{},
				},
				{
					FromClassId: []byte("AdvancedWeapon"),
					ToClassId:   []byte("WeaponInterface"),
					Type:        &types.Realization{},
				},
				{
					FromClassId: []byte("BeginnerCharacter"),
					ToClassId:   []byte("CharacterInterface"),
					Type:        &types.Realization{},
				},
				{
					FromClassId: []byte("IntermediateCharacter"),
					ToClassId:   []byte("CharacterInterface"),
					Type:        &types.Realization{},
				},
				{
					FromClassId: []byte("AdvancedCharacter"),
					ToClassId:   []byte("CharacterInterface"),
					Type:        &types.Realization{},
				},
			},
		},
	}

	for testIndex, tt := range tests {
		t.Run("Test index "+strconv.Itoa(testIndex), func(subtest *testing.T) {
			actualOutput := getClassRelations(tt.Input)

			if len(actualOutput) != len(tt.Output) {
				subtest.Errorf("incorrect number of relations.\nExpected %s. Got %s\n", strconv.Itoa(len(tt.Output)), strconv.Itoa(len(actualOutput)))
				subtest.FailNow()
			}

			for index, relation := range tt.Output {
				if !bytes.Equal(relation.FromClassId, actualOutput[index].FromClassId) {
					subtest.Errorf("incorrect relation.\nExpected %s. Got %s\n", string(relation.FromClassId), actualOutput[index].FromClassId)
					subtest.FailNow()
				} else if !bytes.Equal(relation.ToClassId, actualOutput[index].ToClassId) {
					subtest.Errorf("incorrect relation.\nExpected %s. Got %s\n", string(relation.ToClassId), actualOutput[index].ToClassId)
					subtest.FailNow()
				} else if reflect.TypeOf(relation.Type) != reflect.TypeOf(actualOutput[index].Type) {
					subtest.Errorf("incorrect relation.\nExpected %s. Got %s\n", reflect.TypeOf(relation.Type).String(), reflect.TypeOf(actualOutput[index].Type).String())
					subtest.FailNow()
				} else if relation.Type.GetFromArrow() != actualOutput[index].Type.GetFromArrow() {
					subtest.Errorf("incorrect relation.\nExpected %t. Got %t\n", relation.Type.GetFromArrow(), actualOutput[index].Type.GetFromArrow())
					subtest.FailNow()
				} else if relation.Type.GetToArrow() != actualOutput[index].Type.GetToArrow() {
					subtest.Errorf("incorrect relation.\nExpected %t. Got %t\n", relation.Type.GetFromArrow(), actualOutput[index].Type.GetFromArrow())
					subtest.FailNow()
				}
			}
		})
	}
}
