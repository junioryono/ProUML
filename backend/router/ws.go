package router

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/junioryono/ProUML/backend/router/routes/auth"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
)

// need to get public and content from body
type body struct {
	Public  *bool                        `json:"public"`
	Name    string                       `json:"name"`
	Content *models.DiagramContentUpdate `json:"content"`
}

func WebSocketUpgrade() fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		if !websocket.IsWebSocketUpgrade(fbCtx) {
			return fiber.ErrUpgradeRequired
		}

		// TODO: Check if user has access to diagram
		idToken := fbCtx.Cookies(auth.IdTokenCookieName)
		_ = idToken

		return fbCtx.Next()
	}
}

func WebSocketDiagramHandler(sdkP *sdk.SDK) fiber.Handler {
	return websocket.New(func(wc *websocket.Conn) {
		idToken := wc.Cookies(auth.IdTokenCookieName)
		diagramId := wc.Params("diagramId")

		// Listen for messages from Redis and send to client
		sessionId := sdkP.Redis.Subscribe(diagramId, wc)

		fmt.Printf("Diagram ID: %s\n", diagramId)
		fmt.Printf("Connections: %d\n", sdkP.Redis.GetConnectionsLength(diagramId))

		// Listen for messages from client and send to Redis
		for {
			msgType, msg, err := wc.ReadMessage()
			if err != nil {
				break
			}

			if msgType != websocket.TextMessage {
				continue
			}

			b := body{}
			if err := json.Unmarshal(msg, &b); err != nil {
				fmt.Printf("Error: %s\n", err.Error())
				continue
			}

			if b.Content != nil {
				events := strings.Split(b.Content.Event, "/")

				if stringContains(events, "broadcast") {
					// Broadcast to all connections
					go sdkP.Redis.Publish(diagramId, msg)
				}

				if stringContains(events, "db_save") {
					// Save diagram
					fmt.Printf("Saving diagram: %s\n", diagramId)
					go sdkP.Postgres.Diagram.UpdateContent(diagramId, idToken, *b.Content, events)
				}

			}
		}

		// Remove connection
		sdkP.Redis.Unsubscribe(diagramId, sessionId)
	})
}

func stringContains(slice []string, contains string) bool {
	for _, value := range slice {
		if value == contains {
			return true
		}
	}
	return false
}
