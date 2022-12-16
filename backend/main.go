package main

import (
	"errors"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/websocket/v2"
	"github.com/joho/godotenv"
	"github.com/junioryono/ProUML/backend/transpiler"
	supabase "github.com/nedpals/supabase-go"
)

var (
	SupabaseClient *supabase.Client
)

func main() {
	InitSupabaseClient()
	InitRouter()
}

func InitSupabaseClient() {
	godotenv.Load(".env")
	supabaseUrl := os.Getenv("supabaseUrl")
	supabaseKey := os.Getenv("supabaseKey")

	if supabaseUrl == "" || supabaseKey == "" {
		panic(errors.New("environment variables not found"))
	}

	SupabaseClient = supabase.CreateClient(supabaseUrl, supabaseKey)
	if SupabaseClient == nil {
		panic(errors.New("could not initialize supabase client"))
	}
}

func InitRouter() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	Router := fiber.New(fiber.Config{
		AppName:                 "ProUML",
		EnableTrustedProxyCheck: true,
	})

	Router.Use(compress.New(compress.Config{
		Level: compress.LevelBestCompression,
	}))

	Router.Use(recover.New())
	Router.Use(ConfigureCors())
	Router.Get("/test", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "true",
		})
	})

	HandleRoutes(Router)

	log.Fatal(Router.Listen(":" + port))
}

func ConfigureCors() func(*fiber.Ctx) error {
	return cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "https://api.prouml.com",
		AllowHeaders:     "Origin, Content-Type, Accept, Accept-Language, Content-Length",
	})
}

func HandleRoutes(Router fiber.Router) {
	Router.Get("/to-json", API_ToJSON())

	Router.Use("/ws", func(c *fiber.Ctx) error {
		// IsWebSocketUpgrade returns true if the client
		// requested upgrade to the WebSocket protocol.
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
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

func API_ToJSON() func(c *fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		json, err := transpiler.ToJson(SupabaseClient, "", "") // DELETE THIS
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"success": false,
				"reason":  "Could not transpile.",
			})
		}

		return c.Status(fiber.StatusOK).Send(json)
	}
}
