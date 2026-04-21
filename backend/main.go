package main

import (
	"chat365-backend/client"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var (
	clients      []*client.Client
	clientsMutex sync.Mutex
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		if r.Host == "localhost:3000" {
			return true
		}
		return false
	},
	ReadBufferSize:    1024,
	WriteBufferSize:   1024,
	EnableCompression: true,
}

func main() {

	http.HandleFunc("/ws", handleWS)

	log.Println("Listening on :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Error listening and serving:", err)
		return
	}

}

func broadcastMessage(msg client.Message) {
	clientsMutex.Lock()
	defer clientsMutex.Unlock()

	for _, client := range clients {
		select {
		case client.Send <- msg:
		default:
		}
	}
}

func removeClient(client *client.Client) {
	clientsMutex.Lock()
	defer clientsMutex.Unlock()

	for i, c := range clients {
		if c == client {
			clients = append(clients[:i], clients[i+1:]...)
			close(client.Send)
			break
		}
	}

}

func handleWS(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, fmt.Sprintf("Cannot upgrade connection:%s", err), http.StatusInternalServerError)
		return
	}

	// get first message
	// first message should always be { "", "username" }
	var initMsg client.Message
	conn.ReadJSON(&initMsg)
	broadcastMessage(client.Message{Message: fmt.Sprintf("%s joined the room.", initMsg.User), User: "system"})

	client := client.NewClient(conn, initMsg.User)
	clients = append(clients, client)

	go client.ReadPump(broadcastMessage, removeClient)
	go client.WritePump()
}
