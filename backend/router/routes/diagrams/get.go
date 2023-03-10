package diagrams

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
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

		// Get all projects
		projects, err := sdkP.Postgres.Projects.GetAllWithAccessRole(fbCtx.Locals("idToken").(string), offsetInt)
		if err != nil {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		// Get the diagrams
		diagrams, err := sdkP.Postgres.Diagrams.GetDashboard(fbCtx.Locals("idToken").(string), offsetInt)
		if err != nil {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		var response struct {
			Projects any `json:"projects"`
			Diagrams any `json:"diagrams"`
		}

		if len(projects) == 0 {
			response.Projects = []interface{}{}
		} else {
			response.Projects = projects
		}

		if len(diagrams) == 0 {
			response.Diagrams = []interface{}{}
		} else {
			response.Diagrams = diagrams
		}

		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success:  true,
			Response: response,
		})
	}
}
