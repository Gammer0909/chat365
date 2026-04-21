import { useRef, useState } from "react"

export function Chatbox({ addMessage, send, username, disableSend }) {
    const [message, setMessage] = useState("");
    const textInputRef = useRef(null)

    function handleSend() {
        send(message, username)

        textInputRef.current.value = ''
        setMessage('')
    }

    return (
        <div className="chat-box">
            <div className="chat-controls">
                <input 
                    ref={textInputRef}
                    className="chat-input"
                    type='text'
                    placeholder='Message #servername'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !disableSend) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <button disabled={disableSend} onClick={handleSend}>
                    {!disableSend ? (
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#60a5fa"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#a3a3a3"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg>
                    )}
                </button>
            </div>
        </div>
    )
}

