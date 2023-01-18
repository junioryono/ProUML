package transpiler

import (
	"strconv"
	"testing"

	"github.com/junioryono/ProUML/backend/transpiler/types"
	httpTypes "github.com/junioryono/ProUML/backend/types"
)

type projectParseTest struct {
	Input  []types.File
	Output string
	Err    *httpTypes.WrappedError
}

func TestGetProjectLanguage(t *testing.T) {
	var tests = []projectParseTest{
		getProject1(),
	}

	for testIndex, tt := range tests {
		t.Run("Test index "+strconv.Itoa(testIndex), func(subtest *testing.T) {
			language, err := getProjectLanguage(tt.Input)
			// Check if error is the same as tt.Err
			if err != nil && tt.Err != nil && err.Str != tt.Err.Str {
				subtest.Errorf("errors are not equal.\nexpected:\n%s\ngot:\n%s\n", tt.Err.Str, err.Str)
			} else if err != nil && tt.Err == nil {
				subtest.Errorf("errors are not equal.\nexpected:\nNO ERROR\ngot:\n%s\n", err.Str)
			} else if err == nil && tt.Err != nil {
				subtest.Errorf("errors are not equal.\nexpected:\n%s\ngot:\nNO ERROR\n", tt.Err.Str)
			}

			// Check if language is the same as tt.Output
			if language != tt.Output {
				subtest.Errorf("strings are not equal.\nexpected:\n%s\ngot:\n%s\n", tt.Output, language)
			}
		})
	}
}

func TestGetDiagramLayout(t *testing.T) {
	type GetDiagramLayoutTest struct {
		Input  *types.Project
		Output *types.Project
	}

	var tests = []GetDiagramLayoutTest{
		{
			Input: &types.Project{
				Nodes: []any{
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
					types.JavaClass{
						Package:    []byte("default"),
						Name:       []byte("AdvancedCharacter"),
						Implements: []types.CustomByteSlice{[]byte("CharacterInterface")},
						Variables: []types.JavaVariable{
							{
								Type:           []byte("String"),
								Name:           []byte("stance"),
								Value:          []byte("\"Standing\""),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("double"),
								Name:           []byte("maxSpeed"),
								Value:          []byte("70.4"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("int"),
								Name:           []byte("maxWeapons"),
								Value:          []byte("2"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("List<String>"),
								Name:           []byte("selectionPanel"),
								Value:          []byte("Collections.unmodifiableList(Arrays.asList(\"AC1\",\"AC2\",\"AC3\"))"),
								AccessModifier: []byte("public"),
							},
						},
						Methods: []types.JavaMethod{
							{
								Type:           []byte("List<String>"),
								Name:           []byte("getSelectionPanel"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("return this.selectionPanel;"),
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
								Functionality: []byte("this.stance=stance;"),
							},
						},
					},
					types.JavaClass{
						Package:    []byte("default"),
						Name:       []byte("BeginnerCharacter"),
						Implements: []types.CustomByteSlice{[]byte("CharacterInterface")},
						Variables: []types.JavaVariable{
							{
								Type:           []byte("String"),
								Name:           []byte("stance"),
								Value:          []byte("\"Standing\""),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("double"),
								Name:           []byte("maxSpeed"),
								Value:          []byte("90.3"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("int"),
								Name:           []byte("maxWeapons"),
								Value:          []byte("3"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("List<String>"),
								Name:           []byte("selectionPanel"),
								Value:          []byte("Collections.unmodifiableList(Arrays.asList(\"BC1\",\"BC2\",\"BC3\"))"),
								AccessModifier: []byte("public"),
							},
						},
						Methods: []types.JavaMethod{
							{
								Type:           []byte("List<String>"),
								Name:           []byte("getSelectionPanel"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("return this.selectionPanel;"),
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
								Functionality: []byte("this.stance=stance;"),
							},
						},
					},
					types.JavaInterface{
						Package: []byte("default"),
						Name:    []byte("CharacterInterface"),
						Methods: []types.JavaMethod{
							{
								Type:           []byte("List<String>"),
								Name:           []byte("getSelectionPanel"),
								AccessModifier: []byte("public"),
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
							},
						},
					},
					types.JavaClass{
						Package:    []byte("default"),
						Name:       []byte("IntermediateCharacter"),
						Implements: []types.CustomByteSlice{[]byte("CharacterInterface")},
						Variables: []types.JavaVariable{
							{
								Type:           []byte("String"),
								Name:           []byte("stance"),
								Value:          []byte("\"Standing\""),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("double"),
								Name:           []byte("maxSpeed"),
								Value:          []byte("50.9"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("int"),
								Name:           []byte("maxWeapons"),
								Value:          []byte("1"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("List<String>"),
								Name:           []byte("selectionPanel"),
								Value:          []byte("Collections.unmodifiableList(Arrays.asList(\"IC1\",\"IC2\",\"IC3\"))"),
								AccessModifier: []byte("public"),
							},
						},
						Methods: []types.JavaMethod{
							{
								Type:           []byte("List<String>"),
								Name:           []byte("getSelectionPanel"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("return this.selectionPanel;"),
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
								Functionality: []byte("this.stance=stance;"),
							},
						},
					},
					types.JavaClass{
						Package:    []byte("default"),
						Name:       []byte("AdvancedFactory"),
						Implements: []types.CustomByteSlice{[]byte("ModeInterface")},
						Methods: []types.JavaMethod{
							{
								Type:           []byte("CharacterInterface"),
								Name:           []byte("createCharacter"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("return new AdvancedCharacter();"),
							},
							{
								Type:           []byte("WeaponInterface"),
								Name:           []byte("createWeapon"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("return new AdvancedWeapon();"),
							},
						},
					},
					types.JavaClass{
						Package:    []byte("default"),
						Name:       []byte("BeginnerFactory"),
						Implements: []types.CustomByteSlice{[]byte("ModeInterface")},
						Methods: []types.JavaMethod{
							{
								Type:           []byte("CharacterInterface"),
								Name:           []byte("createCharacter"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("return new BeginnerCharacter();"),
							},
							{
								Type:           []byte("WeaponInterface"),
								Name:           []byte("createWeapon"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("return new BeginnerWeapon();"),
							},
						},
					},
					types.JavaClass{
						Package:    []byte("default"),
						Name:       []byte("IntermediateFactory"),
						Implements: []types.CustomByteSlice{[]byte("ModeInterface")},
						Methods: []types.JavaMethod{
							{
								Type:           []byte("CharacterInterface"),
								Name:           []byte("createCharacter"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("return new IntermediateCharacter();"),
							},
							{
								Type:           []byte("WeaponInterface"),
								Name:           []byte("createWeapon"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("return new IntermediateWeapon();"),
							},
						},
					},
					types.JavaClass{
						Package: []byte("default"),
						Name:    []byte("ModeFactory"),
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
								Functionality: []byte("if(mode==\"Beginner\"){return new BeginnerFactory();}else if(mode==\"Advanced\"){return new AdvancedFactory();}else if(mode==\"Intermediate\"){return new IntermediateFactory();}return null;"),
							},
						},
					},
					types.JavaInterface{
						Package: []byte("default"),
						Name:    []byte("ModeInterface"),
						Methods: []types.JavaMethod{
							{
								Type:           []byte("CharacterInterface"),
								Name:           []byte("createCharacter"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("WeaponInterface"),
								Name:           []byte("createWeapon"),
								AccessModifier: []byte("public"),
							},
						},
					},
					types.JavaClass{
						Package:    []byte("default"),
						Name:       []byte("AdvancedWeapon"),
						Implements: []types.CustomByteSlice{[]byte("WeaponInterface")},
						Variables: []types.JavaVariable{
							{
								Type:           []byte("boolean"),
								Name:           []byte("weaponInPosition"),
								Value:          []byte("false"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("double"),
								Name:           []byte("damagePerHit"),
								Value:          []byte("60.1"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("double"),
								Name:           []byte("accuracy"),
								Value:          []byte("39.4"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("boolean"),
								Name:           []byte("scope"),
								Value:          []byte("true"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("List<String>"),
								Name:           []byte("selectionPanel"),
								Value:          []byte("Collections.unmodifiableList(Arrays.asList(\"AW1\",\"AW2\",\"AW3\"))"),
								AccessModifier: []byte("public"),
							},
						},
						Methods: []types.JavaMethod{
							{
								Type:           []byte("List<String>"),
								Name:           []byte("getSelectionPanel"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("return this.selectionPanel;"),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("holdWeapon"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("this.weaponInPosition=true;"),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("dropWeapon"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("this.weaponInPosition=false;"),
							},
						},
					},
					types.JavaClass{
						Package:    []byte("default"),
						Name:       []byte("BeginnerWeapon"),
						Implements: []types.CustomByteSlice{[]byte("WeaponInterface")},
						Variables: []types.JavaVariable{
							{
								Type:           []byte("boolean"),
								Name:           []byte("weaponInPosition"),
								Value:          []byte("false"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("double"),
								Name:           []byte("damagePerHit"),
								Value:          []byte("40.7"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("double"),
								Name:           []byte("accuracy"),
								Value:          []byte("90.5"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("boolean"),
								Name:           []byte("scope"),
								Value:          []byte("true"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("List<String>"),
								Name:           []byte("selectionPanel"),
								Value:          []byte("Collections.unmodifiableList(Arrays.asList(\"BW1\",\"BW2\",\"BW3\"))"),
								AccessModifier: []byte("public"),
							},
						},
						Methods: []types.JavaMethod{
							{
								Type:           []byte("List<String>"),
								Name:           []byte("getSelectionPanel"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("return this.selectionPanel;"),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("holdWeapon"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("this.weaponInPosition=true;"),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("dropWeapon"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("this.weaponInPosition=false;"),
							},
						},
					},
					types.JavaClass{
						Package:    []byte("default"),
						Name:       []byte("IntermediateWeapon"),
						Implements: []types.CustomByteSlice{[]byte("WeaponInterface")},
						Variables: []types.JavaVariable{
							{
								Type:           []byte("boolean"),
								Name:           []byte("weaponInPosition"),
								Value:          []byte("false"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("double"),
								Name:           []byte("damagePerHit"),
								Value:          []byte("90.5"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("double"),
								Name:           []byte("accuracy"),
								Value:          []byte("20.2"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("boolean"),
								Name:           []byte("scope"),
								Value:          []byte("false"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("List<String>"),
								Name:           []byte("selectionPanel"),
								Value:          []byte("Collections.unmodifiableList(Arrays.asList(\"AW1\",\"BW2\",\"CW3\"))"),
								AccessModifier: []byte("public"),
							},
						},
						Methods: []types.JavaMethod{
							{
								Type:           []byte("List<String>"),
								Name:           []byte("getSelectionPanel"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("return this.selectionPanel;"),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("holdWeapon"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("this.weaponInPosition=true;"),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("dropWeapon"),
								AccessModifier: []byte("public"),
								Functionality:  []byte("this.weaponInPosition=false;"),
							},
						},
					},
					types.JavaInterface{
						Package: []byte("default"),
						Name:    []byte("WeaponInterface"),
						Methods: []types.JavaMethod{
							{
								Type:           []byte("List<String>"),
								Name:           []byte("getSelectionPanel"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("holdWeapon"),
								AccessModifier: []byte("public"),
							},
							{
								Type:           []byte("void"),
								Name:           []byte("dropWeapon"),
								AccessModifier: []byte("public"),
							},
						},
					},
				},
				Edges: []types.Relation{
					{
						FromClassId: []byte("default.AdvancedCharacter"),
						ToClassId:   []byte("default.CharacterInterface"),
						Type: &types.Realization{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.BeginnerCharacter"),
						ToClassId:   []byte("default.CharacterInterface"),
						Type: &types.Realization{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.IntermediateCharacter"),
						ToClassId:   []byte("default.CharacterInterface"),
						Type: &types.Realization{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.AdvancedFactory"),
						ToClassId:   []byte("default.ModeInterface"),
						Type: &types.Realization{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.AdvancedFactory"),
						ToClassId:   []byte("default.AdvancedCharacter"),
						Type: &types.Dependency{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.AdvancedFactory"),
						ToClassId:   []byte("default.AdvancedWeapon"),
						Type: &types.Dependency{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.BeginnerFactory"),
						ToClassId:   []byte("default.ModeInterface"),
						Type: &types.Realization{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.BeginnerFactory"),
						ToClassId:   []byte("default.BeginnerCharacter"),
						Type: &types.Dependency{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.BeginnerFactory"),
						ToClassId:   []byte("default.BeginnerWeapon"),
						Type: &types.Dependency{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.IntermediateFactory"),
						ToClassId:   []byte("default.ModeInterface"),
						Type: &types.Realization{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.IntermediateFactory"),
						ToClassId:   []byte("default.IntermediateCharacter"),
						Type: &types.Dependency{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.IntermediateFactory"),
						ToClassId:   []byte("default.IntermediateWeapon"),
						Type: &types.Dependency{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.ModeFactory"),
						ToClassId:   []byte("default.AdvancedFactory"),
						Type: &types.Dependency{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.ModeFactory"),
						ToClassId:   []byte("default.BeginnerFactory"),
						Type: &types.Dependency{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.ModeFactory"),
						ToClassId:   []byte("default.IntermediateFactory"),
						Type: &types.Dependency{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.AdvancedWeapon"),
						ToClassId:   []byte("default.WeaponInterface"),
						Type: &types.Realization{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.BeginnerWeapon"),
						ToClassId:   []byte("default.WeaponInterface"),
						Type: &types.Realization{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.IntermediateWeapon"),
						ToClassId:   []byte("default.WeaponInterface"),
						Type: &types.Realization{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.Client"),
						ToClassId:   []byte("default.ModeInterface"),
						Type: &types.Dependency{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.Client"),
						ToClassId:   []byte("default.ModeFactory"),
						Type: &types.Dependency{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.Client"),
						ToClassId:   []byte("default.CharacterInterface"),
						Type: &types.Dependency{
							FromArrow: false,
							ToArrow:   true,
						},
					},
					{
						FromClassId: []byte("default.Client"),
						ToClassId:   []byte("default.WeaponInterface"),
						Type: &types.Dependency{
							FromArrow: false,
							ToArrow:   true,
						},
					},
				},
			},
			Output: &types.Project{},
		},
	}

	for testIndex, tt := range tests {
		t.Run("Test index "+strconv.Itoa(testIndex), func(subtest *testing.T) {
			actualOutput := generateDiagramLayout(tt.Input)

			_ = actualOutput
			subtest.Fail()
		})
	}
}

func getProject1() projectParseTest {
	return projectParseTest{
		Input: []types.File{
			{
				Name:      "Test",
				Extension: "java",
				Code:      []byte("public class Test { public static void main(String args[]){ System.out.println('Hello Java'); } }"),
			},
			{
				Name:      "Test2",
				Extension: "java",
				Code:      []byte("public class Test2 { public void test(){ System.out.println('test2'); } }"),
			},
		},
		Output: "java",
		Err:    nil,
	}
}
