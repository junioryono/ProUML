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

		// Get the diagrams
		diagram, err := sdkP.Postgres.Diagrams.GetAllWithAccessRole(fbCtx.Cookies("id_token"), offsetInt)
		if err != nil {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		return fbCtx.Status(fiber.StatusOK).JSON(types.Status{
			Success:  true,
			Response: diagram,
		})
	}
}
