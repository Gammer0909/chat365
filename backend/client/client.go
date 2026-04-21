package client

import (
	"fmt"
	"log"

	"github.com/gorilla/websocket"
)

type Client struct {
	Conn     *websocket.Conn
	Username string
	Send     chan Message
}

func NewClient(conn *websocket.Conn, username string) *Client {
	return &Client{
		Conn:     conn,
		Username: username,
		Send:     make(chan Message),
	}
}

func (c *Client) ReadPump(broadcastMessage func(msg Message), removeClient func(client *Client)) {
	defer c.Conn.Close()
	for {
		var msg Message
		err := c.Conn.ReadJSON(&msg)
		if websocket.IsCloseError(err,
			websocket.CloseGoingAway,       // Normal close (tab closed)
			websocket.CloseAbnormalClosure, // Abnormal close
			websocket.CloseNormalClosure,   // Normal closure
		) {
			log.Println("Exited normally")
			broadcastMessage(Message{Message: fmt.Sprintf("%s has left the server.", c.Username), User: "system"})
			removeClient(c)
			break
		} else if err != nil {
			log.Println("Other Error occurred: ", err)
			broadcastMessage(Message{Message: fmt.Sprintf("%s has left the server.", c.Username), User: "system"})
			removeClient(c)
			break
		}

		broadcastMessage(msg)
	}
}

func (c *Client) WritePump() {
	for msg := range c.Send {
		if err := c.Conn.WriteJSON(msg); err != nil {
			break
		}
	}
}
