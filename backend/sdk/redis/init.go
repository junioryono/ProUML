package redis

import (
	"context"
	"errors"
	"fmt"
	"os"
	"sync"

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

	return r, nil
}

// Make a pub sub connection. Return session id
func (r *Redis_SDK) Subscribe(channelId string, user *models.UserModel, ws *websocket.Conn) string {
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

		return ""
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
			connectionsMu: sync.Mutex{},
			context:       r.context,
		}
	}
	r.channelsWg.Unlock()

	// Add connection to channel
	r.channels[channelId].addConnection(conn)

	return sessionId
}

// Unsubscribe from a channel
func (r *Redis_SDK) Unsubscribe(channelId, sessionId string) {
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
