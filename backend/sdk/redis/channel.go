package redis

import (
	"context"
	"encoding/json"
	"sync"

	"github.com/go-redis/redis/v9"
	"github.com/gofiber/websocket/v2"
	"github.com/junioryono/ProUML/backend/types"
)

type connection struct {
	sessionId string
	mu        sync.Mutex
	ws        *websocket.Conn
}

type channel struct {
	Id            string
	ps            *redis.PubSub
	client        *redis.Client
	connections   []*connection
	connectionsMu sync.RWMutex
	context       context.Context
}

func (c *channel) addConnection(conn *connection) {
	// If there are no current connections, initialize the channel listener

	c.connectionsMu.Lock()
	if len(c.connections) == 0 {
		go c.listen()
	}

	// Add connection to channel
	c.connections = append(c.connections, conn)
	c.connectionsMu.Unlock()

	// Send the user their sessionId
	conn.ws.WriteJSON(types.WebSocketBody{
		SessionId: conn.sessionId,
		Events:    "connected",
	})
}

func (c *channel) listen() {
	// Listen for messages
	go func() {
		for {
			msg, err := c.ps.ReceiveMessage(c.context)
			if err != nil {
				// An error occurs if the subscription is closed
				// Therefore, the go routine will eventually return
				return
			}

			// Unmarshal message.Payload
			payload := types.WebSocketBody{}
			if err := json.Unmarshal([]byte(msg.Payload), &payload); err != nil {
				continue
			}

			// Copy the sessionId from the payload
			// Set the sessionId to empty string for smaller payload
			fromSessionId := payload.SessionId
			payload.SessionId = ""

			// Send message to all connections except the sender
			var sendToConnections []*connection
			c.connectionsMu.RLock()
			for _, v := range c.connections {
				if v.sessionId != fromSessionId {
					sendToConnections = append(sendToConnections, v)
				}
			}
			c.connectionsMu.RUnlock()

			// Send message to all connections concurrently
			for _, v := range sendToConnections {
				go func(v *connection) {
					v.mu.Lock()
					defer v.mu.Unlock()
					v.ws.WriteJSON(payload)
				}(v)
			}
		}
	}()
}

// Returns true if there are no more connections in the channel
func (c *channel) removeConnection(sessionId string) bool {
	// Find the index of the connection to remove
	c.connectionsMu.Lock()
	for i, v := range c.connections {
		if v.sessionId == sessionId {
			c.connections = append(c.connections[:i], c.connections[i+1:]...)
			break
		}
	}
	c.connectionsMu.Unlock()

	// Need to remove this user from the key of the channel using LREM
	c.client.LRem(c.context, c.Id, 1, sessionId)

	// If there are no more connections, unsubscribe from the channel
	c.connectionsMu.RLock()
	defer c.connectionsMu.RUnlock()
	if len(c.connections) == 0 {
		c.unsubscribe()
		return true
	}

	return false
}

func (c *channel) publish(message interface{}) error {
	return c.client.Publish(c.context, c.Id, message).Err()
}

func (c *channel) getConnectionsLength() int {
	c.connectionsMu.RLock()
	defer c.connectionsMu.RUnlock()
	return len(c.connections)
}

func (c *channel) unsubscribe() error {
	if err := c.ps.Unsubscribe(c.context, c.Id); err != nil {
		return err
	}

	return c.ps.Close()
}
