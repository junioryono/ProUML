package router

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"

	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/junioryono/ProUML/backend/router/routes/auth"
	"github.com/junioryono/ProUML/backend/router/routes/diagram"
	diagramUsers "github.com/junioryono/ProUML/backend/router/routes/diagram/users"
	"github.com/junioryono/ProUML/backend/router/routes/diagrams"
	"github.com/junioryono/ProUML/backend/router/routes/oauth"
	"github.com/junioryono/ProUML/backend/router/routes/project"
	projectDiagram "github.com/junioryono/ProUML/backend/router/routes/project/diagram"
	"github.com/junioryono/ProUML/backend/router/routes/projects"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/types"
)

func Init(sdkP *sdk.SDK) error {
	port := os.Getenv("PORT")
	if port == "" {
		port = "5001"
	}

	corsConfig := cors.Config{
		AllowOrigins:     "*",
		AllowHeaders:     "Origin, Content-Type, Accept, Accept-Language, Content-Length",
		AllowCredentials: true,
	}

	if auth.Production {
		corsConfig.AllowOrigins = "https://prouml.com"
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
	Router.Use(compress.New(compress.Config{Level: compress.LevelBestCompression}))
	Router.Use(cors.New(corsConfig))

	handleRoutes(Router, sdkP)

	return Router.Listen(":" + port)
}

func handleRoutes(Router fiber.Router, sdkP *sdk.SDK) {
	AuthRouter := Router.Group("/auth")

	AuthRouter.Post("/register", auth.Register(sdkP))
	AuthRouter.Post("/login", auth.Login(sdkP))
	AuthRouter.Post("/logout", auth.Logout(sdkP))
	AuthRouter.Post("/resend-verification-email", isAuthenticated(sdkP), auth.ResendVerificationEmail(sdkP))
	AuthRouter.Patch("/update-profile", isAuthenticated(sdkP), auth.UpdateProfile(sdkP))
	AuthRouter.Delete("/delete-account", isAuthenticated(sdkP), auth.DeleteAccount(sdkP))
	AuthRouter.Get("/session", isAuthenticated(sdkP), auth.Session(sdkP))
	AuthRouter.Get("/get-profile", isAuthenticated(sdkP), auth.GetProfile(sdkP))

	// AuthRouter.Get("/verify-email", auth.VerifyEmail(sdkP))

	OAuthRouter := Router.Group("/oauth")
	OAuthRouter.Get("/github/login", oauth.GitHubLogin(sdkP))
	OAuthRouter.Get("/github/callback", oauth.GitHubCallback(sdkP))
	OAuthRouter.Get("/google/login", oauth.GoogleLogin(sdkP))
	OAuthRouter.Get("/google/callback", oauth.GoogleCallback(sdkP))

	DiagramRouter := Router.Group("/diagram", isAuthenticated(sdkP))
	DiagramRouter.Post("/", diagram.Post(sdkP))
	DiagramRouter.Put("/", diagram.Put(sdkP))
	DiagramRouter.Get("/", diagram.Get(sdkP))
	DiagramRouter.Delete("/", diagram.Delete(sdkP))
	DiagramRouter.Post("/users", diagramUsers.Post(sdkP))
	DiagramRouter.Put("/users", diagramUsers.Put(sdkP))
	DiagramRouter.Get("/users", diagramUsers.Get(sdkP))
	DiagramRouter.Delete("/users", diagramUsers.Delete(sdkP))

	DiagramsRouter := Router.Group("/diagrams", isAuthenticated(sdkP))
	DiagramsRouter.Get("/", diagrams.Get(sdkP))

	ProjectRouter := Router.Group("/project", isAuthenticated(sdkP))
	ProjectRouter.Post("/", project.Post(sdkP))
	ProjectRouter.Put("/", project.Put(sdkP))
	ProjectRouter.Get("/", project.Get(sdkP))
	ProjectRouter.Delete("/", project.Delete(sdkP))

	ProjectDiagramRouter := ProjectRouter.Group("/diagram", isAuthenticated(sdkP))
	ProjectDiagramRouter.Put("/", projectDiagram.Put(sdkP))
	ProjectDiagramRouter.Delete("/", projectDiagram.Delete(sdkP))

	ProjectsRouter := Router.Group("/projects", isAuthenticated(sdkP))
	ProjectsRouter.Get("/", projects.Get(sdkP))

	// TeamRouter := Router.Group("/team", isAuthenticated(sdkP))
	// TeamRouter.Post("/", team.Post(sdkP))
	// TeamRouter.Put("/", team.Put(sdkP))
	// TeamRouter.Get("/", team.Get(sdkP))
	// TeamRouter.Delete("/", team.Delete(sdkP))

	Router.Get("/.well-known/jwks.json", JWKSet(sdkP))

	Router.Use("/ws", WebSocketUpgrade())
	Router.Get("/ws/:diagramId", isAuthenticated(sdkP), WebSocketDiagramHandler(sdkP))
}

func isAuthenticated(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		unauthorizedUser := func() error {
			auth.DeleteCookie(fbCtx, auth.IdTokenCookieName)
			auth.DeleteCookie(fbCtx, auth.RefreshTokenCookieName)

			return fbCtx.Status(fiber.StatusUnauthorized).JSON(types.Status{
				Success: false,
				Reason:  types.ErrNotAuthenticated,
			})
		}

		idToken := fbCtx.Cookies(auth.IdTokenCookieName)
		refreshToken := fbCtx.Cookies(auth.RefreshTokenCookieName)

		if idToken == "" && refreshToken == "" {
			return unauthorizedUser()
		}

		// Check if id token is valid
		_, idTokenError := sdkP.Postgres.Auth.Client.GetUserId(idToken)
		if idTokenError == nil {
			fbCtx.Locals("idToken", idToken)
			return fbCtx.Next()
		}

		if refreshToken == "" {
			return unauthorizedUser()
		}

		// id token is invalid, check if refresh token is valid
		_, refreshTokenError := sdkP.Postgres.Auth.Client.GetUserId(refreshToken)
		if refreshTokenError == nil {
			// refresh token is valid, refresh id token
			idToken, err := sdkP.Postgres.Auth.Client.RefreshIdToken(refreshToken)
			if err != nil {
				return unauthorizedUser()
			}

			if err := auth.SetCookie(fbCtx, auth.IdTokenCookieName, idToken); err != nil {
				return fbCtx.Status(fiber.StatusInternalServerError).JSON(types.Status{
					Success: false,
					Reason:  types.ErrInternalServerError,
				})
			}

			fbCtx.Locals("idToken", idToken)
			return fbCtx.Next()
		}

		return unauthorizedUser()
	}
}
