package router

import (
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/websocket/v2"
	"github.com/junioryono/ProUML/backend/router/routes/auth"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/transpiler"
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func Init(sdkP *sdk.SDK) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	Router := fiber.New(fiber.Config{
		AppName:                 "ProUML",
		EnableTrustedProxyCheck: true,
		ErrorHandler: func(fbCtx *fiber.Ctx, err error) error {
			return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
				Success: false,
				Reason:  err.Error(),
			})
		},
	})

	Router.Use(recover.New())
	Router.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "https://api.prouml.com",
		AllowHeaders:     "Origin, Content-Type, Accept, Accept-Language, Content-Length",
	}))
	Router.Use(compress.New(compress.Config{
		Level: compress.LevelBestCompression,
	}))

	handleRoutes(Router, sdkP)

	log.Fatal(Router.Listen(":" + port))
}

func handleRoutes(Router fiber.Router, sdkP *sdk.SDK) {
	AuthRouter := Router.Group("/auth")

	AuthRouter.Post("/register", auth.Register(sdkP))
	AuthRouter.Post("/login", auth.Login(sdkP))
	AuthRouter.Get("/get-profile", isAuthenticated(sdkP), auth.GetProfile(sdkP))
	AuthRouter.Get("/verify/:confirmationCode", auth.Verify(sdkP))

	// DiagramRouter := Router.Group("/diagram", isAuthenticated(sdkP))

	// DiagramRouter.Post("/new")
	// DiagramRouter.Get("/get/:diagramId")

	Router.Get("/to-json", func(fbCtx *fiber.Ctx) error {
		json, err := transpiler.ToJson(sdkP, "", "") // DELETE THIS
		if err != nil {
			return fbCtx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"reason":  err,
			})
		}

		return fbCtx.Status(fiber.StatusOK).Send(json)
	})

	Router.Use("/ws", func(fbCtx *fiber.Ctx) error {
		// IsWebSocketUpgrade returns true if the client
		// requested upgrade to the WebSocket protocol.
		if websocket.IsWebSocketUpgrade(fbCtx) {
			fbCtx.Locals("allowed", true)
			return fbCtx.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	Router.Get("/ws/:id", websocket.New(func(wc *websocket.Conn) {
		var (
			mt  int
			msg []byte
			err error
		)

		// providerDetails, err := supabaseClient.Auth.User(context.TODO(), "")

		log.Println(wc.Locals("allowed"))  // true
		log.Println(wc.Params("id"))       // 123
		log.Println(wc.Query("v"))         // 1.0
		log.Println(wc.Cookies("session")) // ""

		for {
			if mt, msg, err = wc.ReadMessage(); err != nil {
				log.Println("Reading error:", err)
				break
			}
			log.Printf("recv: %s", msg)

			if err = wc.WriteMessage(mt, msg); err != nil {
				log.Println("Writing error:", err)
				break
			}
		}

	}))

}

func isAuthenticated(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		idToken := fbCtx.Cookies("id_token")
		refreshToken := fbCtx.Cookies("refresh_token")

		if idToken == "" || refreshToken == "" {
			return fbCtx.Status(fiber.StatusUnauthorized).JSON(types.Status{
				Success: false,
				Reason:  "Unauthorized",
			})
		}

		// Check if id token is valid
		idTokenClaims, idTokenError := sdkP.AWS.ParseClaims(idToken)
		if idTokenError == nil {
			// id token is valid, check when it is expiring and get a new one if needed
			idTokenExpirationTime := idTokenClaims["exp"].(float64)

			// If within 5 days of expiration, refresh id token
			if time.Now().Unix() > int64(idTokenExpirationTime)-60*24*5 {
				_, err := sdkP.AWS.RefreshIdToken(fbCtx, refreshToken)
				if err != nil {
					return fbCtx.Status(fiber.StatusUnauthorized).JSON(types.Status{
						Success: false,
						Reason:  "Unauthorized",
					})
				}
			}

			fbCtx.Locals("token_claims", idTokenClaims)
			return fbCtx.Next()
		}

		// id token is expired, check if refresh token is valid
		_, refreshTokenError := sdkP.AWS.ParseClaims(refreshToken)
		if refreshTokenError == nil {
			// refresh token is valid, refresh id token
			user, err := sdkP.AWS.RefreshIdToken(fbCtx, refreshToken)
			if err != nil {
				return fbCtx.Status(fiber.StatusUnauthorized).JSON(types.Status{
					Success: false,
					Reason:  "Unauthorized",
				})
			}

			idTokenClaims, idTokenError = sdkP.AWS.ParseClaims(*user.AuthenticationResult.IdToken)
			if idTokenError != nil {
				return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
					Success: false,
					Reason:  idTokenError.Error(),
				})
			}

			fbCtx.Locals("token_claims", idTokenClaims)
			return fbCtx.Next()
		}

		// refresh token is valid
		// refresh id token

		return fbCtx.Status(fiber.StatusUnauthorized).JSON(types.Status{
			Success: false,
			Reason:  "Unauthorized",
		})
	}
}
