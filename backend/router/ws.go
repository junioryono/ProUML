package router

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/junioryono/ProUML/backend/router/routes/auth"
	"github.com/junioryono/ProUML/backend/sdk"
)

// need to get public and content from body
type body struct {
	Events string `json:"event"`

	Public           *bool                  `json:"public"`
	Name             string                 `json:"name"`
	Cell             map[string]interface{} `json:"content"`
	ConnectionStatus *bool                  `json:"connectionStatus"`
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
		sessionId, err := sdkP.Redis.Subscribe(diagramId, wc)
		if err != nil {
			fmt.Printf("Error: %s\n", err.Error())
			return
		}

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

			events := strings.Split(b.Events, "/")

			switch {
			case sliceContains(events, "broadcast"):
				// Broadcast to all connections
				go sdkP.Redis.Publish(diagramId, msg)

			case sliceContains(events, "db_updateCell"):
				if b.Cell == nil || len(events) < 2 {
					continue
				}

				go sdkP.Postgres.Diagram.UpdateContent(diagramId, idToken, b.Cell, "db_updateCell")
			}
		}

		// Remove connection
		sdkP.Redis.Unsubscribe(diagramId, sessionId)
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
