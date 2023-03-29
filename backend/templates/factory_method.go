package templates

import (
	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func getFactoryMethod() *[]any {
	return &[]any{
		types.JavaClass{
			JavaDiagramNode: types.JavaDiagramNode{
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
					Static: true,
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
					Static: true,
				},
			},
		},
	}

}
