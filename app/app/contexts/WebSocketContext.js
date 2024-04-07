"use client";
import React, { createContext, useContext, useEffect, useState, useRef } from "react";


const WebSocketContext = createContext({
	sendMessage: () => {}, 
	userStatus: "signedOut",
});

export const WebSocketProvider = ({ children }) => {
	const isConnected = useRef(false);
	const userStatus = useRef("signedOut");
	let ws = useRef(null);

	useEffect(() => {
		console.log("MOUNTING WEBSOCKET CONTEXT");
		// CONNECT TO SESSION WEBSOCKET SERVER
		ws.current = new WebSocket(`ws://localhost:8989`);
		console.log("[Session | Client] Connecting to WebSocket Server");

		// IF OPEN, UPDATE userStatus CONTEXT.
		ws.current.onopen = () => {
			isConnected.current = true;
			console.log("[Session | Client] Connection Opened");
			console.log("isConnected right after open " + isConnected.current);
		};

		// WHEN RECEIVE A MESSAGE FROM THE SERVER, CHECK TYPE AND PERFORM APPROPRIATE ACTION
		ws.current.onmessage = (event) => {
			console.log("[Session | Client] Message Received: ", event.data);
			const message = JSON.parse(event.data);
			switch (message.type) {
				case "userStatus":
					console.log("STATUS: ", message.status);
					userStatus.current = message.status;
					break;
				default:
					break;
			}
		};

		// ON CONNECTION CLOSE, UPDATE userStatus CONTEXT
		ws.current.onclose = (event) => {
			console.log("[Session | Client] Connection Closed " + event.code + " " + event.reason);
			isConnected.current = false;
		};

		ws.current.onerror = (error) => {
			console.log('[Session | Client] WebSocket error: ', error);
		};

		// CLOSE WEBSOCKET WHEN DONE
		return () => {
			ws.current.close();
		};
	}, []);

	// FUNCTION TO COMMUNICATE WITH THE SERVER
	const sendMessage = (action) => {
		console.log("SENDING MESSAGE WITH ACTION: ", action);
		console.log("WebSocketSendCond: ", ws.current && ws.current.readyState === WebSocket.OPEN);
		if (ws.current && ws.current.readyState === WebSocket.OPEN) {
			ws.current.send(JSON.stringify({ action }));
		}
	};

	useEffect(() => {
		console.log("isConnected value changed, which is now: ", isConnected.current);
		if(!isConnected.current) 
			userStatus.current = "signedOut";
	}, [isConnected.current]);

	useEffect(() => {
		console.log("User Status: ", userStatus.current);
	}
	, [userStatus.current]);


	return (
		<WebSocketContext.Provider
			value={{ sendMessage, userStatus: userStatus.current}}
		>
			{children}
		</WebSocketContext.Provider>
	);
};

export const useWebSocket = () => {
	return useContext(WebSocketContext);
};
