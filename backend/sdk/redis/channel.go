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
	connectionsMu sync.Mutex
	context       context.Context
}

func (c *channel) addConnection(conn *connection) {
	// If there are no current connections, initialize the channel listener
	if len(c.connections) == 0 {
		go c.listen()
	}

	// Add connection to channel
	c.connectionsMu.Lock()
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
			for _, conn := range c.connections {
				if conn.sessionId == fromSessionId {
					continue
				}

				go func(c *connection) {
					c.mu.Lock()
					c.ws.WriteJSON(payload)
					c.mu.Unlock()
				}(conn)
			}
		}
	}()

	// // Send a connection status message to the client
	// go func(c *connection) {
	// 	c.mu.Lock()
	// 	c.ws.WriteJSON(struct {
	// 		Events           string `json:"event"`
	// 		ConnectionStatus string `json:"connectionStatus"`
	// 	}{
	// 		Events:           "connectionStatus",
	// 		ConnectionStatus: "success",
	// 	})
	// 	c.mu.Unlock()
	// }(conn)

	// go func(c *connection, u *models.UserModel, r2 *Redis_SDK, channelId2 string) {
	// 	// Create a DiagramUsersRolesHiddenContent
	// 	userHiddenContent := &models.DiagramUsersHiddenContent{
	// 		UserId:   user.ID,
	// 		Email:    user.Email,
	// 		FullName: user.FullName,
	// 		Picture:  user.Picture,
	// 	}

	// 	marshaledMsg, err := json.Marshal(struct {
	// 		Event string                            `json:"event"`
	// 		User  *models.DiagramUsersHiddenContent `json:"user"`
	// 	}{
	// 		Event: "newConnection",
	// 		User:  userHiddenContent,
	// 	})
	// 	if err != nil {
	// 		fmt.Printf("error marshaling message: %v\n", err.Error())
	// 	}

	// 	// Publish the message
	// 	if err := r2.Publish(channelId2, marshaledMsg); err != nil {
	// 		fmt.Printf("error publishing message: %v\n", err.Error())
	// 	}

	// 	// // Need to get all the users currently connected to the channel using LRANGE
	// 	// if otherUsers, err := r2.client.LRange(r2.context, channel, 0, -1).Result(); err == nil {
	// 	// 	// Send a message to the client with all the users currently connected to the channel
	// 	// 	go func(c2 *connection) {
	// 	// 		// Iterate through all the users
	// 	// 		for _, u := range otherUsers {
	// 	// 			fmt.Printf("u: %v\n", u)
	// 	// 		}
	// 	// 	}(c)
	// 	// }

	// 	// Need to add this user the key of the channel using RPUSH
	// 	// r2.client.RPush(r2.context, channel, marshaledMsg)
	// }(conn, user, r, channelId)
}

// Returns true if there are no more connections in the channel
func (c *channel) removeConnection(sessionId string) bool {
	for i, v := range c.connections {
		if v.sessionId == sessionId {
			c.connectionsMu.Lock()
			c.connections = append(c.connections[:i], c.connections[i+1:]...)
			c.connectionsMu.Unlock()
			break
		}
	}

	// Need to remove this user from the key of the channel using LREM
	c.client.LRem(c.context, c.Id, 1, sessionId)

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
	return len(c.connections)
}

func (c *channel) unsubscribe() error {
	if err := c.ps.Unsubscribe(c.context, c.Id); err != nil {
		return err
	}

	return c.ps.Close()
}
