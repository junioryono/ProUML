package router

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/websocket/v2"
	"github.com/junioryono/ProUML/backend/auth"
	authRouter "github.com/junioryono/ProUML/backend/router/routes/auth"
	"github.com/junioryono/ProUML/backend/transpiler"
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func Init(cgn auth.Cognito) {
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
	defer Router.Shutdown()

	Router.Use(recover.New())
	Router.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "https://api.prouml.com",
		AllowHeaders:     "Origin, Content-Type, Accept, Accept-Language, Content-Length",
	}))
	Router.Use(compress.New(compress.Config{
		Level: compress.LevelBestCompression,
	}))

	handleRoutes(Router, cgn)

	log.Fatal(Router.Listen(":" + port))
}

func handleRoutes(Router fiber.Router, cgn auth.Cognito) {
	Router.Get("/test", func(fbCtx *fiber.Ctx) error {
		return fbCtx.JSON(fiber.Map{
			"status": "true",
		})
	})

	Router.Post("/auth/register", authRouter.Register(cgn))
	Router.Post("/auth/login", authRouter.Login(cgn))
	Router.Post("/auth/get-profile", authRouter.GetProfile(cgn))

	Router.Get("/auth/verify/:confirmationCode", authRouter.Verify(cgn))

	Router.Get("/to-json", func(fbCtx *fiber.Ctx) error {
		json, err := transpiler.ToJson(cgn, "", "") // DELETE THIS
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
