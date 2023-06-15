import React, { useRef, useEffect, useState } from "react";
//import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");

    const [messages, setMessages] = useState([]);
    const bottom = useRef(null);

    const scrollToBottom = () => {
        bottom.current.scrollIntoView({ behavior: "smooth" })
    }
    const sendMessage = async () => {
        if (currentMessage !== "") {
            const currentHour = new Date(Date.now()).getHours();
            const currentTime = new Date(Date.now()).getMinutes();

            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: `${currentHour}:${currentTime}`
            };

            await socket.current.emit("send_message", messageData);
            setMessages((list) => [...list, messageData]);
            setCurrentMessage("");

            scrollToBottom();
        }
    };

    const updateMessages = (data) => {
        setMessages((list) => [...list, data]);
    }

    useEffect(() => {
        if (!socket?.current?.id) return;

        socket.current.on("receive_message", updateMessages);

        return () => {
            socket.current.off("receive_message", updateMessages);
        }

    }, [socket?.current?.id]);



    //   useEffect(() => {
    //     scrollToBottom()
    //   }, [messages]);


    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live Chat on room: {room}</p>
            </div>

            <div className="chat-body" style={{ height: '400px', position: 'relative', overflow: 'auto' }}>
                {messages.map((messageContent, idx) => {
                    return (<div className="message" id={username === messageContent.author ? "you" : "other"} key={idx}>
                        <div>
                            <div className="message-content">
                                <p>{messageContent.message}</p>
                            </div>
                            <div className="message-meta">
                                <p id="time">{messageContent.time}</p>
                                <p id="author">{messageContent.author}</p>
                            </div>
                        </div>
                    </div>
                    );
                })}
            </div>

            <div className="chat-footer">
                <input
                    type="text"
                    placeholder="Context..."
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onKeyUp={(event) => {
                        if (event.code === 'Enter') {
                            sendMessage()
                        }
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
}

export default Chat;