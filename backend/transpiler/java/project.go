package transpiler

import "github.com/junioryono/ProUML/backend/transpiler/types"

func (p *Project) Parse() ([]byte, error) {
	if len(p.Original) == 0 {
		return []byte(""), &types.CannotParseText{}
	}

	var (
		res []byte
	)

	res, err := p.removeCommentsAndSpacing(p.Original)
	if err != nil {
		return []byte(""), err
	}

	return res, nil
}
