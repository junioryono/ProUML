package redis

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"math/rand"
	"os"
	"os/signal"
	"sync"
	"syscall"

	"github.com/go-redis/redis/v9"
	"github.com/gofiber/websocket/v2"
	"github.com/google/uuid"
	"github.com/junioryono/ProUML/backend/sdk/postgres/models"
	"github.com/junioryono/ProUML/backend/types"
)

type Redis_SDK struct {
	client     *redis.Client
	channels   map[string]*channel
	channelsWg sync.Mutex
	context    context.Context
}

func Init() (*Redis_SDK, error) {
	Username := os.Getenv("REDIS_USERNAME")
	Password := os.Getenv("REDIS_PASSWORD")
	Host := os.Getenv("REDIS_HOST")
	Port := os.Getenv("REDIS_PORT")

	if Username == "" {
		return nil, errors.New("redis username is empty")
	}

	if Password == "" {
		return nil, errors.New("redis password is empty")
	}

	if Host == "" {
		return nil, errors.New("redis host is empty")
	}

	if Port == "" {
		return nil, errors.New("redis port is empty")
	}

	t, err := redis.ParseURL(fmt.Sprintf("rediss://%s:%s@%s:%s", Username, Password, Host, Port))
	if err != nil {
		return nil, err
	}

	r := &Redis_SDK{
		client:     redis.NewClient(t),
		channels:   make(map[string]*channel),
		channelsWg: sync.Mutex{},
		context:    context.Background(),
	}

	if r.client == nil {
		return nil, errors.New("could not initialize redis client")
	}

	// Graceful shutdown
	go r.gracefulShutdown()

	return r, nil
}

func (r *Redis_SDK) gracefulShutdown() {
	cancelChan := make(chan os.Signal, 1)
	signal.Notify(cancelChan, syscall.SIGTERM, syscall.SIGINT)
	<-cancelChan

	r.shutdown()

	os.Exit(0)
}

func (r *Redis_SDK) shutdown() {
	for diagramId, channel := range r.channels {
		for i := 0; i < len(channel.connections); i++ {
			// Remove the user
			r.client.HDel(r.context, r.getDiagramUsersKey(diagramId), channel.connections[i].sessionId)
		}
	}
}

// Make a pub sub connection. Return session id
func (r *Redis_SDK) Subscribe(channelId string, user *models.UserModel, ws *websocket.Conn) (string, string) {
	// Subscribe to channel
	ps := r.client.Subscribe(r.context, channelId)

	// Wait for confirmation that subscription is created before publishing anything
	_, err := ps.Receive(r.context)
	if err != nil {
		// Send the user an empty sessionId
		ws.WriteJSON(types.WebSocketBody{
			SessionId: "",
			Events:    "connected",
		})

		return "", ""
	}

	// Generate session id
	sessionId := uuid.New().String()

	// Create new connection
	conn := &connection{
		sessionId: sessionId,
		mu:        sync.Mutex{},
		ws:        ws,
	}

	// Create a new channel if it doesn't exist
	r.channelsWg.Lock()
	if _, ok := r.channels[channelId]; !ok {
		r.channels[channelId] = &channel{
			Id:            channelId,
			ps:            ps,
			client:        r.client,
			connectionsMu: sync.RWMutex{},
			context:       r.context,
		}
	}
	r.channelsWg.Unlock()

	// Add connection to channel
	// This function will also send the user a sessionId
	r.channels[channelId].addConnection(conn)

	color, err := r.addUserColor(channelId, sessionId, user)
	if err != nil {
		return "", ""
	}

	return sessionId, color
}

// Return the color of the user
func (r *Redis_SDK) addUserColor(diagramId, sessionId string, user *models.UserModel) (string, error) {
	// Get all users
	users, err := r.getUsers(diagramId)
	if err != nil {
		return "", err
	}

	// Existing colors
	var existingColors []string
	for _, user := range users {
		existingColors = append(existingColors, user.Color)
	}

	// Generate a random color
	var newColor string = r.generateRandomHexColor(existingColors)

	userBody := types.WebSocketBody{
		SessionId: sessionId,
		Color:     newColor,
		User: &models.DiagramUsersHiddenContent{
			UserId:   user.ID,
			FullName: user.FullName,
			Email:    user.Email,
			Picture:  user.Picture,
		},
	}

	// Convert to []byte
	b, err := json.Marshal(userBody)
	if err != nil {
		return "", err
	}

	// Add the user
	err = r.client.HSet(r.context, r.getDiagramUsersKey(diagramId), sessionId, b).Err()
	if err != nil {
		return "", err
	}

	msg := types.WebSocketBody{
		Color:     newColor,
		SessionId: sessionId,
		Events:    "connection",
		User: &models.DiagramUsersHiddenContent{
			UserId:   user.ID,
			FullName: user.FullName,
			Email:    user.Email,
			Picture:  user.Picture,
		},
	}

	// Convert to []byte
	b, err = json.Marshal(msg)
	if err != nil {
		return "", err
	}

	// Publish the user to the channel
	r.channels[diagramId].publish(b)

	return newColor, nil
}

func (r *Redis_SDK) generateRandomHexColor(existingColors []string) string {
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

// Get all users connected to the diagram and send them to the client
func (r *Redis_SDK) GetUsersAndPostToWS(diagramId string, ws *websocket.Conn) error {
	users, err := r.getUsers(diagramId)
	if err != nil {
		return err
	}

	for _, user := range users {
		user.Events = "connection"
		if err := ws.WriteJSON(user); err != nil {
			return err
		}
	}

	return nil
}

func (r *Redis_SDK) getUsers(diagramId string) ([]types.WebSocketBody, error) {
	// // Delete all users
	// r.client.Del(r.context, r.getDiagramUsersKey(diagramId))

	// Return all users that are connected to the diagram
	wsBody, err := r.client.HGetAll(r.context, r.getDiagramUsersKey(diagramId)).Result()
	if err != nil {
		return nil, err
	}

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

func (r *Redis_SDK) getDiagramUsersKey(diagramId string) string {
	return fmt.Sprintf("diagram:%s:users", diagramId)
}

// Unsubscribe from a channel
func (r *Redis_SDK) Unsubscribe(channelId, sessionId, color string) {
	newMessage := types.WebSocketBody{
		Color:     color,
		SessionId: sessionId,
		Events:    "disconnection",
	}

	// Convert to []byte
	msg, err := json.Marshal(newMessage)
	if err != nil {
		return
	}

	// Publish the user to the channel
	r.channels[channelId].publish(msg)

	// Remove the user
	r.client.HDel(r.context, r.getDiagramUsersKey(channelId), sessionId)

	// Check if channel exists
	if _, ok := r.channels[channelId]; !ok {
		return
	}

	// Get the channel
	channel := r.channels[channelId]

	// Remove the connection from the channel
	removeChannel := channel.removeConnection(sessionId)

	// If there are no more connections to the channel, the channel will unsubscribe
	// We also need to remove the channel from the channels map
	if removeChannel {
		delete(r.channels, channelId)
	}
}

// Publish a message to a channel
func (r *Redis_SDK) Publish(channelId string, message interface{}) error {
	// Get the channel
	channel := r.channels[channelId]

	// Publish the message
	return channel.publish(message)
}

// Get number of connections to a channel
func (r *Redis_SDK) GetConnectionsLength(channelId string) int {
	if _, ok := r.channels[channelId]; !ok {
		return -1
	}

	return r.channels[channelId].getConnectionsLength()
}
