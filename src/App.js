import './App.css';
import { Sidebar } from './sidebar';
import { ServerInfo } from './serverinfo';
import { Chatbox } from './chatbox';
import { useCallback, useEffect, useRef, useState } from 'react';

const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws';

function App() {
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({ name: ''})
  const [disableSend, setDisable] = useState(false);
  
  const scrollTarget = useRef(null);
  const ws = useRef(null);
  const dialogRef = useRef(null);

  const scrollToBottom = () => {
    scrollTarget.current?.scrollIntoView({ behaviour: "smooth" })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Username cannot be empty!")
      return
    }
    
    console.log(formData.name)

    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ text: "init", user: formData.name  }))
    } else {
      setDisable(true)
    }

    dialogRef.current?.close()
  }

  const sendMessage = (text, user) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ text, user }))
    } else {
      setDisable(true)
    }
  }

  const addMessage = (message, user) => {
    setMessages(prev => [...prev, {text: message, user: user}])
  }

  useEffect(() => {
    if (ws.current) return

    ws.current = new WebSocket(wsUrl)

    ws.current.onopen = () => {
      console.log("Websocket connected!");
    }

    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log(`${message.user}: ${message.text}`)
      addMessage(message.text, message.user);
    }

    ws.current.onerror = (e) => {
      console.error("WS Error: ", e)  
    }

    ws.current.onclose = () => {
      console.log("Disconnected from websocket")
    }

  }, [])

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <>
      <div className="App">
      <dialog ref={dialogRef}>
          <form onSubmit={handleSubmit}>
              <label for="username">Enter a Username:</label>
              <input 
                  type="text" 
                  id='username'
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <button type='submit'>Start Chatting!</button>
          </form>
      </dialog>
        <Sidebar />
        <div className="main">
          <ServerInfo />
          <div className="chat">
            {messages.map((message, index) => {
              switch (message.user) {
                case formData.name:
                  return <div key={index} className='user'>
                    <p style={{ fontSize: '0.85em', opacity: 0.7, margin: '0 0 0px 0' }}>{message.user}</p>
                    <p>{message.text}</p>
                  </div>
                case "system":
                  return <div key={index} className='system'>{message.text}</div>
                default:
                  return <div key={index} className='other'>
                    <p style={{ fontSize: '0.85em', opacity: 0.7, margin: '0' }}>{message.user}</p>
                    <p>{message.text}</p>
                </div>
              }
            })}
            <div ref={scrollTarget}></div>
          </div>
          <Chatbox
            addMessage={addMessage}
            send={sendMessage}
            username={formData.name}
            disableSend={disableSend}
          />
        </div>
       </div>
    </>
  );
}


export default App;
