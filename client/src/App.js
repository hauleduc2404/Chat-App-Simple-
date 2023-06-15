import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import Chat from "./Chat";

const host = "http://localhost:3000";

function App() {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [showChat, setShowChat] = useState(false);

    const socket = useRef();

    useEffect(() => {
        socket.current = socketIOClient.connect(host);

        socket.current.on('connect', () => console.log('Socket connected'));

        socket.current.on('joined_room', data => console.log('Joined room:', data));
    }, []);

    const joinRoom = () => {
        if (username !== "" && room !== "") {
            console.log('Request to join room:', room);
            socket.current.emit("join_room", room);
            setShowChat(true);
        }
    };

    const updateUsername = (event) => setUsername(event.target.value);
    const updateRoom = (event) => setRoom(event.target.value);

    return (
        <div className="App">
            {!showChat ? (
                <div className="joinChatContainer">
                    <h3>Join A Chat</h3>

                    <input type="text"
                        placeholder="Join..."
                        onChange={updateUsername}
                    />

                    <input type="text"
                        placeholder="RoomID..."
                        onChange={updateRoom}
                    />

                    <button onClick={joinRoom}>Join A Room</button>
                </div>
            )
                : (
                    <Chat socket={socket} username={username} room={room} />
                )}
        </div>
    );
}

export default App;