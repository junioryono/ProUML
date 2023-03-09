package router

import (
	"encoding/json"
	"strings"
	"time"

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
			// Check if diagram is public
			if diagramIsPublic, err := sdkP.Postgres.Diagram.Admin.IsDiagramPublic(diagramId); err != nil || !diagramIsPublic {
				return
			}
		} else if userRole != "owner" && userRole != "editor" && userRole != "viewer" {
			// Check if user has access to diagram
			return
		}

		// Send the websocket a ping to keep the connection alive. Return once the connection is closed.
		var closeChannel = make(chan int)
		go func() {
			for {
				select {
				case <-closeChannel:
					return
				case <-time.After(30 * time.Second):
					if wc == nil {
						return
					}

					wc.WriteMessage(websocket.TextMessage, []byte("ping"))
				}
			}
		}()

		// Listen for messages from Redis and send to client
		sessionId := sdkP.Redis.Subscribe(diagramId, userModel, wc)
		if sessionId == "" {
			return
		}

		// Listen for messages from client and send to Redis
		for {
			// Set timeout for 15 minutes
			wc.SetReadDeadline(time.Now().Add(15 * time.Minute))
			var msgType, msg, err = wc.ReadMessage()
			if err != nil {
				// Send to channel to close the ping loop
				go close(closeChannel)

				// Close connection
				go wc.WriteJSON(types.WebSocketBody{
					SessionId: sessionId,
					Events:    "disconnected",
				})

				break
			}

			// Reset timeout
			wc.SetReadDeadline(time.Time{})

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
			} else if sliceContains(events, "ping") {
				go func() {
					time.Sleep(10 * time.Second)
					wc.WriteJSON(types.WebSocketBody{
						SessionId: sessionId,
						Events:    "pong",
					})
				}()
			}
		}

		// Remove connection
		go sdkP.Redis.Unsubscribe(diagramId, sessionId)
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
