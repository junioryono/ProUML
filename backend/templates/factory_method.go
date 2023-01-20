package templates

import (
	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func getFactoryMethod() *[]any {
	return &[]any{
		types.JavaClass{
			JavaDiagram: types.JavaDiagram{
				ID:     uuid.New().String(),
				Shape:  "custom-class",
				Width:  100,
				Height: 100,
				X:      100,
				Y:      100,
			},
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
	}

}
