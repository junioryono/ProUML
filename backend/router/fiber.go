package router

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/websocket/v2"
	"github.com/junioryono/ProUML/backend/router/routes/auth"
	"github.com/junioryono/ProUML/backend/router/routes/diagram"
	diagramUsers "github.com/junioryono/ProUML/backend/router/routes/diagram/users"
	"github.com/junioryono/ProUML/backend/router/routes/diagrams"
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
	Router.Use(func(fbCtx *fiber.Ctx) error {
		fbCtx.Set("X-Frame-Options", "SAMEORIGIN")
		fbCtx.Set("X-XSS-Protection", "1; mode=block")
		fbCtx.Set("X-Content-Type-Options", "nosniff")
		fbCtx.Set("Referrer-Policy", "no-referrer")
		fbCtx.Set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
		fbCtx.Set("X-Download-Options", "noopen")
		fbCtx.Set("X-Permitted-Cross-Domain-Policies", "none")
		fbCtx.Set("X-DNS-Prefetch-Control", "off")

		return fbCtx.Next()
	})

	handleRoutes(Router, sdkP)

	log.Fatal(Router.Listen(":" + port))
}

func handleRoutes(Router fiber.Router, sdkP *sdk.SDK) {
	AuthRouter := Router.Group("/auth")

	AuthRouter.Post("/register", auth.Register(sdkP))
	AuthRouter.Post("/login", auth.Login(sdkP))
	AuthRouter.Post("/delete-account", isAuthenticated(sdkP), auth.DeleteAccount(sdkP))
	AuthRouter.Get("/get-profile", isAuthenticated(sdkP), auth.GetProfile(sdkP))
	AuthRouter.Get("/resend-verification-email", isAuthenticated(sdkP), auth.ResendVerificationEmail(sdkP))

	DiagramRouter := Router.Group("/diagram", isAuthenticated(sdkP))

	DiagramRouter.Post("/", diagram.Post(sdkP))
	DiagramRouter.Put("/", diagram.Put(sdkP))
	DiagramRouter.Get("/", diagram.Get(sdkP))
	DiagramRouter.Delete("/", diagram.Delete(sdkP))

	DiagramRouter.Post("/users", diagramUsers.Put(sdkP))
	DiagramRouter.Get("/users", diagramUsers.Get(sdkP))
	DiagramRouter.Delete("/users", diagramUsers.Delete(sdkP))

	DiagramsRouter := Router.Group("/diagrams", isAuthenticated(sdkP))
	DiagramsRouter.Get("/", diagrams.Get(sdkP))

	Router.Get("/.well-known/jwks.json", JWKSet(sdkP))

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
			fmt.Printf("hello1\n")
			return fbCtx.Status(fiber.StatusUnauthorized).JSON(types.Status{
				Success: false,
				Reason:  "Unauthorized",
			})
		}

		// Check if id token is valid
		userId, idTokenError := sdkP.Postgres.Auth.GetUserIdFromToken(idToken)

		if idTokenError == nil {
			fbCtx.Locals("user_id", userId)
			return fbCtx.Next()
		}

		// print the error
		fmt.Printf("error: %s\n", idTokenError)

		// id token is invalid, check if refresh token is valid
		_, refreshTokenError := sdkP.Postgres.Auth.GetUserIdFromToken(refreshToken)
		if refreshTokenError == nil {
			// refresh token is valid, refresh id token
			idToken, err := sdkP.Postgres.Auth.RefreshIdToken(refreshToken)
			if err != nil {
				return fbCtx.Status(fiber.StatusUnauthorized).JSON(types.Status{
					Success: false,
					Reason:  "Unauthorized",
				})
			}

			// Store id token in http only cookie
			fbCtx.Cookie(&fiber.Cookie{
				Name:  "id_token",
				Value: idToken,
				// Domain:   "prouml.com", // TODO remove this
				Expires:  time.Now().Add(7 * 24 * time.Hour),
				HTTPOnly: true,
				// Secure:   true, // TODO remove this
			})

			fbCtx.Locals("user_id", userId)
			return fbCtx.Next()
		}

		fmt.Printf("hello3\n")
		// refresh token is invalid, user needs to login again
		return fbCtx.Status(fiber.StatusUnauthorized).JSON(types.Status{
			Success: false,
			Reason:  "Unauthorized",
		})
	}
}
