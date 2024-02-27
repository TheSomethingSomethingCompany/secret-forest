"use client";
import React, { createContext, useContext, useEffect, useState, useRef } from "react";


const WebSocketContext = createContext({
	isConnected: false,
	sendMessage: () => {}, 
	userStatus: "signedOut",
});

export const WebSocketProvider = ({ children }) => {
	const [isConnected, setIsConnected] = useState(false);
	const [userStatus, setUserStatus] = useState("signedOut");
	let ws = useRef(null);

	useEffect(() => {
		// CONNECT TO SESSION WEBSOCKET SERVER
		ws.current = new WebSocket(`ws://localhost:8989`);

		// IF OPEN, UPDATE ISCONNECTED CONTEXT.
		ws.current.onopen = () => {
			setIsConnected(true);
		};

		// WHEN RECEIVE A MESSAGE FROM THE SERVER, CHECK TYPE AND PERFORM APPROPRIATE ACTION
		ws.current.onmessage = (event) => {
			console.log("[Session | Client] Message Received: ", event.data);
			const message = JSON.parse(event.data);
			switch (message.type) {
				case "userStatus":
					console.log("STATUS: ", message.status);
					setUserStatus(message.status);
					break;
				default:
					break;
			}
		};

		// ON CONNECTION CLOSE, UPDATE ISCONNECTED CONTEXT
		ws.current.onclose = () => {
			setIsConnected(false);
		};

		// CLOSE WEBSOCKET WHEN DONE
		return () => {
			ws.current.close();
		};
	}, []);

	// FUNCTION TO COMMUNICATE WITH THE SERVER
	const sendMessage = (action, body) => {
		console.log("WebSocketSendCond: ", ws.current && ws.current.readyState === WebSocket.OPEN);
		if (ws.current && ws.current.readyState === WebSocket.OPEN) {
			ws.current.send(JSON.stringify({ action, body }));
		}
	};

	return (
		<WebSocketContext.Provider
			value={{ isConnected, sendMessage, userStatus }}
		>
			{children}
		</WebSocketContext.Provider>
	);
};

export const useWebSocket = () => {
	return useContext(WebSocketContext);
};
