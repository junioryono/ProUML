package projects

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/router/routes/auth"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/types"
)

func Get(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		// Get offset from query string
		offset := fbCtx.Query("offset")

		offsetInt := 0
		if offset != "" {
			conv, err := strconv.Atoi(offset)
			if err != nil {
				return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
					Success: false,
					Reason:  types.ErrInvalidRequest,
				})
			}

			offsetInt = conv
		}

		// Get the projects
		projects, err := sdkP.Postgres.Projects.GetAllWithAccessRole(fbCtx.Cookies(auth.IdTokenCookieName), offsetInt)
		if err != nil {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		// If diagram length is 0, return empty array
		if len(projects) == 0 {
			return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
				Success:  true,
				Response: []interface{}{},
			})
		}

		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success:  true,
			Response: projects,
		})
	}
}
