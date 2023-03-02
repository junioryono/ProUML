package router

import (
	"encoding/json"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/junioryono/ProUML/backend/router/routes/auth"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/types"
)

func WebSocketUpgrade() fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		if !websocket.IsWebSocketUpgrade(fbCtx) {
			return fiber.ErrUpgradeRequired
		}

		return fbCtx.Next()
	}
}

func WebSocketDiagramHandler(sdkP *sdk.SDK) fiber.Handler {
	return websocket.New(func(wc *websocket.Conn) {
		idToken := wc.Cookies(auth.IdTokenCookieName)
		diagramId := wc.Params("diagramId")

		// Get the user model from the id token
		userModel, err := sdkP.Postgres.Auth.Client.GetUser(idToken)
		if err != nil {
			return
		}

		// Get the user's role in the diagram
		userRole, err := sdkP.Postgres.Diagram.Admin.GetUserRole(diagramId, userModel.ID)
		if err != nil {
			return
		}

		// Check if user has access to diagram
		if userRole != "owner" && userRole != "editor" && userRole != "viewer" {
			return
		}

		err2 := sdkP.Redis.GetUsers(diagramId, wc)
		if err2 != nil {
			return
		}

		// Send users to the client

		// Listen for messages from Redis and send to client
		sessionId, color := sdkP.Redis.Subscribe(diagramId, userModel, wc)
		if sessionId == "" {
			return
		}

		// Listen for messages from client and send to Redis
		for {
			msgType, msg, err := wc.ReadMessage()
			if err != nil {
				break
			}

			if msgType != websocket.TextMessage {
				continue
			}

			payload := types.WebSocketBody{}
			if err := json.Unmarshal(msg, &payload); err != nil {
				continue
			}

			events := strings.Split(payload.Events, "/")

			if sliceContains(events, "broadcast") {
				if userRole != "owner" && userRole != "editor" {
					continue
				}

				// Broadcast to all connections
				go sdkP.Redis.Publish(diagramId, msg)
			}

			if sliceContains(events, "db_updateCell") || sliceContains(events, "db_addCell") || sliceContains(events, "db_removeCell") {
				go sdkP.Postgres.Diagram.UpdateContent(diagramId, idToken, payload.Cell, events)
			} else if sliceContains(events, "db_updateGraphImage") {
				go sdkP.Postgres.Diagram.UpdateImage(diagramId, idToken, payload.Image)
			} else if sliceContains(events, "db_updateGraphName") {
				go sdkP.Postgres.Diagram.UpdateName(diagramId, idToken, payload.Name)
			} else if sliceContains(events, "db_updateGraphBackgroundColor") {
				go sdkP.Postgres.Diagram.UpdateBackgroundColor(diagramId, idToken, payload.BackgroundColor)
			} else if sliceContains(events, "db_updateGraphShowGrid") {
				go sdkP.Postgres.Diagram.UpdateShowGrid(diagramId, idToken, payload.ShowGrid)
			}
		}

		// Remove connection
		go sdkP.Redis.Unsubscribe(diagramId, sessionId, color)
	})
}

func sliceContains(slice []string, contains string) bool {
	for _, value := range slice {
		if value == contains {
			return true
		}
	}
	return false
}
