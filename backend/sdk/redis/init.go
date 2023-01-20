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
)

// var Diagrams = make(map[string][]*connection)

type connection struct {
	sessionId string
	mu        sync.Mutex
	ws        *websocket.Conn
	ps        *redis.PubSub
}

type Redis_SDK struct {
	client        *redis.Client
	context       context.Context
	subscriptions map[string][]*connection
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
		client:        redis.NewClient(t),
		context:       context.Background(),
		subscriptions: make(map[string][]*connection),
	}

	if r.client == nil {
		return nil, errors.New("could not initialize redis client")
	}

	return r, nil
}

// Make a pub sub connection. Return session id
func (r *Redis_SDK) Subscribe(channel string, ws *websocket.Conn) string {
	// Subscribe to channel
	ps := r.client.Subscribe(r.context, channel)

	// Generate session id
	sessionId := uuid.New().String()

	// Create new connection
	conn := &connection{
		sessionId: sessionId,
		mu:        sync.Mutex{},
		ws:        ws,
		ps:        ps,
	}

	// Check if channel exists
	if _, ok := r.subscriptions[channel]; !ok {
		// Create channel with connection
		r.subscriptions[channel] = []*connection{conn}
	} else {
		// Add connection to channel
		r.subscriptions[channel] = append(r.subscriptions[channel], conn)
	}

	// Listen for messages
	go func() {
		for {
			msg, err := ps.ReceiveMessage(r.context)
			if err != nil {
				return
			}

			// Send message to all connections
			for _, conn := range r.subscriptions[channel] {
				if conn.sessionId == sessionId {
					continue
				}

				go func(c *connection) {
					c.mu.Lock()
					c.ws.WriteMessage(websocket.TextMessage, []byte(msg.Payload))
					c.mu.Unlock()
				}(conn)
			}
		}
	}()

	return sessionId
}

// Unsubscribe from a channel
func (r *Redis_SDK) Unsubscribe(channel, sessionId string) {
	// Check if channel exists
	if _, ok := r.subscriptions[channel]; !ok {
		return
	}

	// Find connection
	for i, conn := range r.subscriptions[channel] {
		if conn.sessionId == sessionId {
			// Unsubscribe from channel
			conn.ps.Unsubscribe(r.context, channel)

			// Remove connection from channel if length is greater than 1
			// Otherwise delete channel
			if len(r.subscriptions[channel]) > 1 {
				r.subscriptions[channel] = append(r.subscriptions[channel][:i], r.subscriptions[channel][i+1:]...)
			} else {
				delete(r.subscriptions, channel)
			}

			break
		}
	}
}

// Publish a message to a channel
func (r *Redis_SDK) Publish(channel string, message interface{}) error {
	return r.client.Publish(r.context, channel, message).Err()
}

// Get number of connections to a channel
func (r *Redis_SDK) GetConnectionsLength(channel string) int {
	if _, ok := r.subscriptions[channel]; !ok {
		return 0
	}

	return len(r.subscriptions[channel])
}
