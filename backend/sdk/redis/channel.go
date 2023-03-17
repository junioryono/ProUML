package redis

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"math/rand"
	"sync"

	"github.com/go-redis/redis/v9"
	"github.com/gofiber/websocket/v2"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/types"
)

type connection struct {
	userId    string
	sessionId string
	color     string
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

func (c *channel) addConnection(conn *connection, user *models.UserModel) {
	// If there are no current connections, initialize the channel listener
	c.connectionsMu.Lock()
	if len(c.connections) == 0 {
		go c.listen()
	}

	// Get the current users in the channel
	users, err := c.getCurrentRedisUsers()
	if err != nil {
		c.connectionsMu.Unlock()
		return
	}

	// Check if the user is already in the channel
	// If they are, get their color
	var userAlreadyInChannel bool
	for _, v := range users {
		if v.User.UserId == user.ID {
			userAlreadyInChannel = true
			conn.color = v.Color
			break
		}
	}

	// Get a new color for the user
	if !userAlreadyInChannel {
		conn.color = c.getNewUserColor(users)
	}

	// Save the user to the diagram users hash
	// Publish the user to the channel
	userBody := types.WebSocketBody{
		SessionId: conn.sessionId,
		Color:     conn.color,
		User: &models.DiagramUsersHiddenContent{
			UserId:   user.ID,
			FullName: user.FullName,
			Email:    user.Email,
			Picture:  user.Picture,
		},
	}

	// Save the user to the diagram users hash
	if b, err := json.Marshal(userBody); err == nil {
		if err := c.client.HSet(c.context, c.getDiagramUsersKey(), conn.sessionId, b).Err(); err != nil {
			c.connectionsMu.Unlock()
			return
		}
	} else {
		c.connectionsMu.Unlock()
		return
	}

	// Publish the user to the channel if they are not already in the channel
	if !userAlreadyInChannel {
		userBody.Events = "connection"
		if b, err := json.Marshal(userBody); err == nil {
			c.publish(b)
		}
	}

	// Add connection to channel
	c.connections = append(c.connections, conn)
	c.connectionsMu.Unlock()

	// Send the user their sessionId
	conn.ws.WriteJSON(types.WebSocketBody{
		SessionId: conn.sessionId,
		Events:    "connected",
	})

	// Send the user all the current users in the channel
	// Do not send to the user who just connected
	// Don't send the same user twice
	var sentUserIds []string
	for _, v := range users {
		if v.User.UserId == user.ID {
			continue
		}

		var found bool
		for _, v2 := range sentUserIds {
			if v2 == v.User.UserId {
				found = true
				break
			}
		}

		if found {
			continue
		}

		sentUserIds = append(sentUserIds, v.User.UserId)
		v.Events = "connection"
		conn.ws.WriteJSON(v)
	}
}

func (c *channel) listen() {
	// Catch panics
	defer recover()

	// Listen for messages
	go func() {
		// Catch panics
		defer recover()

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

			// Send message to all connections except the sender concurrently
			var wg sync.WaitGroup
			c.connectionsMu.RLock()

			for _, v := range c.connections {
				wg.Add(1)
				go func(v *connection) {
					// Catch panics
					defer recover()
					defer wg.Done()

					if v.sessionId != fromSessionId {
						v.mu.Lock()
						defer v.mu.Unlock()
						v.ws.WriteJSON(payload)
					}

				}(v)
			}

			wg.Wait()
			c.connectionsMu.RUnlock()
		}
	}()
}

// Returns true if there are no more connections in the channel
func (c *channel) removeConnection(sessionId string) bool {
	// Get the color from the sessionId
	color, err := c.getColorFromSessionId(sessionId)
	if err != nil {
		return false
	}

	var userId string
	// Remove the connection from the channel
	for i, v := range c.connections {
		if v.sessionId == sessionId {
			userId = v.userId
			c.connections = append(c.connections[:i], c.connections[i+1:]...)
			break
		}
	}

	// Remove the user from the diagram users hash
	c.client.HDel(c.context, c.getDiagramUsersKey(), sessionId)

	users, err := c.getCurrentRedisUsers()
	if err != nil {
		return false
	}

	// Check if there are any more users in the channel with the same user id
	var userStillInChannel bool
	for _, v := range users {
		if v.User.UserId == userId {
			userStillInChannel = true
			break
		}
	}

	// If the user is not in the channel anymore, broadcast the disconnection event
	if !userStillInChannel {
		// Broadcast the user disconnect event
		if msg, err := json.Marshal(types.WebSocketBody{
			Color:     color,
			SessionId: sessionId,
			Events:    "disconnection",
		}); err == nil {
			c.publish(msg)
		}
	}

	// If there are no more connections, unsubscribe from the channel
	if len(c.connections) == 0 {
		c.unsubscribe()
		return true
	}

	return false
}

func (c *channel) publish(message interface{}) error {
	return c.client.Publish(c.context, c.Id, message).Err()
}

func (c *channel) unsubscribe() error {
	if err := c.ps.Unsubscribe(c.context, c.Id); err != nil {
		return err
	}

	return c.ps.Close()
}

func (c *channel) getColorFromSessionId(sessionId string) (string, error) {
	for _, v := range c.connections {
		if v.sessionId == sessionId {
			return v.color, nil
		}
	}

	return "", errors.New("sessionId not found")
}

func (c *channel) getDiagramUsersKey() string {
	return fmt.Sprintf("diagram:%s:users", c.Id)
}

func (c *channel) getNewUserColor(users []types.WebSocketBody) string {
	// Existing colors
	var existingColors []string
	for _, user := range users {
		existingColors = append(existingColors, user.Color)
	}

	// Generate a random color
	return c.generateRandomHexColor(existingColors)
}

func (c *channel) getCurrentRedisUsers() ([]types.WebSocketBody, error) {
	// Get all users from the diagram users hash
	wsBody, err := c.client.HGetAll(c.context, c.getDiagramUsersKey()).Result()
	if err != nil {
		return nil, err
	}

	// Convert to []types.WebSocketBody
	var users []types.WebSocketBody
	for _, v := range wsBody {
		var wsBody types.WebSocketBody

		err = json.Unmarshal([]byte(v), &wsBody)
		if err != nil {
			return nil, err
		}

		users = append(users, wsBody)
	}

	return users, nil
}

func (c *channel) generateRandomHexColor(existingColors []string) string {
	var letters = []rune("0123456789ABCDEF")

	s := make([]rune, 6)
	for i := range s {
		s[i] = letters[rand.Intn(len(letters))]
	}

	// Make sure the hex is not similar to an existing color
	for _, color := range existingColors {
		for i := 0; i < len(s); i++ {
			if s[i] == rune(color[i]) {
				s[i] = letters[rand.Intn(len(letters))]
			}
		}
	}

	return "#" + string(s)
}

func (c *channel) close() {
	var wg sync.WaitGroup
	c.connectionsMu.Lock()
	for _, v := range c.connections {
		wg.Add(1)
		go func(v *connection) {
			// Catch panics
			defer recover()
			defer wg.Done()

			c.removeConnection(v.sessionId)
		}(v)
	}
	wg.Wait()
	c.connectionsMu.Unlock()

	c.unsubscribe()
}

// func (c *channel) removeAllRedisUsers() error {
// 	return c.client.Del(c.context, c.getDiagramUsersKey()).Err()
// }
