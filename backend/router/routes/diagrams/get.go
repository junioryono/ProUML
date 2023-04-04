package diagrams

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/types"
)

func Get(sdkP *sdk.SDK) fiber.Handler {
	type Response struct {
		Projects any `json:"projects"`
		Diagrams any `json:"diagrams"`
	}

	return func(fbCtx *fiber.Ctx) error {
		onlyGetSharedDiagrams := fbCtx.Query("shared")

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

		var response = Response{
			Projects: []interface{}{},
			Diagrams: []interface{}{},
		}

		if onlyGetSharedDiagrams == "true" {
			projects, err := sdkP.Postgres.Projects.GetSharedProjects(fbCtx.Locals("idToken").(string), offsetInt)
			if err != nil {
				return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
					Success: false,
					Reason:  err.Error(),
				})
			}

			// Get all shared diagrams
			diagrams, err := sdkP.Postgres.Diagrams.GetShared(fbCtx.Locals("idToken").(string), offsetInt)
			if err != nil {
				return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
					Success: false,
					Reason:  err.Error(),
				})
			}

			if len(projects) != 0 {
				response.Projects = projects
			}

			if len(diagrams) != 0 {
				response.Diagrams = diagrams
			}
		} else {
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

			if len(projects) != 0 {
				response.Projects = projects
			}

			if len(diagrams) != 0 {
				response.Diagrams = diagrams
			}
		}

		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success:  true,
			Response: response,
		})
	}
}
