package main

import (
	"errors"
	"html/template"
	"log"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/template/html"
	"github.com/gofiber/websocket/v2"
	"github.com/joho/godotenv"
	supabase "github.com/nedpals/supabase-go"
)

var (
	supabaseUrl    string
	supabaseKey    string
	htmlProperties = map[string]map[string]string{
		"Invalid URL": {"Title": "<title>ProUML - Not Found</title>"},
		"/":           {"Title": "<title>ProUML - Home</title>"},
		"/dashboard":  {"Title": "<title>ProUML - Dashboard</title>"},
	}
)

var (
	SupabaseClient *supabase.Client
	ReactBuildPath = "./frontend/build/"
	Production     = os.Getenv("production") == "true"
)

func InitSupabaseClient() {
	godotenv.Load("./.env")
	supabaseUrl = os.Getenv("supabaseUrl")
	supabaseKey = os.Getenv("supabaseKey")

	if supabaseUrl == "" || supabaseKey == "" {
		panic(errors.New("environment variables not found"))
	}

	SupabaseClient = supabase.CreateClient(supabaseUrl, supabaseKey)
}

func ConfigureCors() func(*fiber.Ctx) error {
	return cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "https://prouml.com",
		AllowHeaders:     "Origin, Content-Type, Accept, Accept-Language, Content-Length",
	})
}

func getInnerHtmlProperty(page, property string) string {
	if pageString, ok := htmlProperties[page]; ok {
		if propertyString, ok := pageString[property]; ok {
			return propertyString
		}

		goto exit
	}

exit:
	return htmlProperties["Invalid URL"][property]
}

func SendIndexHTML(c *fiber.Ctx) error {
	fiberMap := fiber.Map{
		"Title": getInnerHtmlProperty(c.Path(), "Title"),
	}

	return c.Status(fiber.StatusOK).Render("index", fiberMap)
}

func HandleDefaultRoutes(c *fiber.Ctx) error {
	// If it's an API route
	if strings.HasPrefix(c.Path(), "/api") {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid route",
		})
	}

	// If the request method is not GET
	if c.Method() != "GET" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid request",
		})
	}

	// If file ends with .html, redirect to directory path; /directory/index.html => /directory
	if strings.HasSuffix(c.Path(), ".html") {
		return c.Redirect(c.BaseURL() + c.Path()[:strings.LastIndex(c.Path(), "/")])
	}

	// c.Response().Header.Add("Cache-Time", "6000")

	// If the file exists in the frontend build directory
	if _, err := os.Stat(ReactBuildPath + c.Path()); c.Path() != "/" && !os.IsNotExist(err) {
		return c.Status(fiber.StatusOK).SendFile(ReactBuildPath + c.Path())
	}

	// Otherwise return React's index html
	return SendIndexHTML(c)
}

func main() {
	InitSupabaseClient()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	htmlEngine := html.New(ReactBuildPath, ".html")
	htmlEngine.AddFunc(
		// add unescape function
		"unescape", func(s string) template.HTML {
			return template.HTML(s)
		},
	)

	MainRouter := fiber.New(fiber.Config{
		AppName:                 "ProUML",
		EnableTrustedProxyCheck: true,
		Views:                   htmlEngine,
	})

	APIRouter := MainRouter.Group("/api")

	MainRouter.Use(recover.New())
	// MainRouter.Use(cache.New(cache.Config{
	// 	ExpirationGenerator: func(c *fiber.Ctx, cfg *cache.Config) time.Duration {
	// 		newCacheTime, err := strconv.Atoi(c.GetRespHeader("Cache-Time", "600"))
	// 		if err != nil {
	// 			newCacheTime = 0
	// 		}
	// 		return time.Second * time.Duration(newCacheTime)
	// 	},
	// 	KeyGenerator: func(c *fiber.Ctx) string {
	// 		return c.Path()
	// 	},
	// }))
	MainRouter.Use(ConfigureCors())
	MainRouter.Use(compress.New(compress.Config{
		Level: compress.LevelBestCompression,
	}))
	APIRouter.Use(recover.New())
	APIRouter.Use(ConfigureCors())

	if !Production {
		htmlEngine.Reload(true)
		ReactBuildPath = "../frontend/build/"
	}

	MainRouter.Use("/ws", func(c *fiber.Ctx) error {
		// IsWebSocketUpgrade returns true if the client
		// requested upgrade to the WebSocket protocol.
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	MainRouter.Get("/ws/:id", websocket.New(func(wc *websocket.Conn) {
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

	MainRouter.Use(HandleDefaultRoutes)

	log.Fatal(MainRouter.Listen(":" + port))
}
