package router

import (
	"encoding/json"
	"fmt"
	"strings"
	"sync"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/google/uuid"
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

type connection struct {
	sessionId string
	*websocket.Conn
	mu sync.Mutex
}

var Diagrams = make(map[string][]*connection)

func WebSocketUpgrade() fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(fbCtx) {
			return fbCtx.Next()
		}
		return fiber.ErrUpgradeRequired
	}
}

func WebSocketDiagramHandler(sdkP *sdk.SDK) fiber.Handler {
	return websocket.New(func(wc *websocket.Conn) {
		// var (
		// 	mt  int
		// 	msg []byte
		// 	err error
		// )

		idToken := wc.Cookies(auth.IdTokenCookieName)
		diagramId := wc.Params("diagramId")
		sessionId := uuid.New().String()

		// Add connection to diagram
		Diagrams[diagramId] = append(Diagrams[diagramId], &connection{
			sessionId: sessionId,
			Conn:      wc,
			mu:        sync.Mutex{},
		})

		fmt.Printf("Diagram ID: %s\n", diagramId)
		fmt.Printf("Connections: %d\n", len(Diagrams[diagramId]))

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
					go func() {
						for _, conn := range Diagrams[diagramId] {
							if conn.sessionId == sessionId {
								continue
							}

							go func(c *connection) {
								c.mu.Lock()
								c.WriteMessage(msgType, msg)
								c.mu.Unlock()
							}(conn)
						}
					}()
				}

				if stringContains(events, "db_save") {
					// Save diagram
					fmt.Printf("Saving diagram: %s\n", diagramId)
					go sdkP.Postgres.Diagram.UpdateContent(diagramId, idToken, *b.Content, events)
				}

			}
		}

		// Remove connection from diagram
		for i, conn := range Diagrams[diagramId] {
			if conn.sessionId == sessionId {
				Diagrams[diagramId] = append(Diagrams[diagramId][:i], Diagrams[diagramId][i+1:]...)
				break
			}
		}

		fmt.Println("Connection closed")
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
