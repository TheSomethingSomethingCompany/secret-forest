const express = require("express");
const session = require("express-session");
const WebSocket = require("ws");
const cors = require("cors");
const path = require("path");

const HTTP_PORT = 6969;
const WEBSOCKET_PORT = 7979;
const WEBSOCKET_PORT_SESSION = 8989;

const handleInsertingMessage = require("./app/wssFunctions/InsertMessage");
const handleRetrievingMessages = require("./app/wssFunctions/RetrieveMessages");
const handleEditingMessage = require("./app/wssFunctions/EditMessage");
const handleDeletingMessage = require("./app/wssFunctions/DeleteMessage");

const server = express(); // CREATE EXPRESS SERVER
const wss = new WebSocket.Server({ port: WEBSOCKET_PORT }); // CHATS WEBSOCKET SERVER
const wssSession = new WebSocket.Server({ port: WEBSOCKET_PORT_SESSION }); // SESSION WEBSOCKET SERVER

//Middleware to parse JSON requests
server.use(express.json());

const corsOptions = {
	origin: "http://localhost:3000",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
	optionsSuccessStatus: 200,
};

// Middleware to parse JSON requests
server.use(cors(corsOptions));

const sessionMiddleWare = session({
	secret: "my super duper secret key hehe :)", // Secret key used to sign sessionID cookie by combining it with the sessionID value. On the server, it will use this secret key to hash with sessionID transmitted, and check if it matches the hash value of the sessionID cookie. If it does, then the sessionID cookie is valid, and no tampering has occurred. Also, this should be stored in a .env file, but for now, we will leave it here.
	resave: false, // Setting this to true forces the session to be saved back to the session store, even if the session was never modified during the request.
	saveUninitialized: false, // Only create a session if a property is added to the session, rather than creating an empty JSON object to be stored in the session store before any properties are added to it.
	cookie: { secure: false }, // If true, then only transmit sessionID cookie over HTTPS. Since we are using HTTP as of right now, we set this to false. Once we implement HTTPS, we can set this to true.
});

server.use(sessionMiddleWare);

//Any Routes
const createProfileRoutes = require("./app/routes/CreateProfile"); // profileRoute will equal to the "router" object exported from routes/Profile.js
server.use("/createAProfile", createProfileRoutes); // Any time /createAProfile is put within URL, you tell express to utilize the routes present in createProfileRoutes = './routes/Profile'

const retrieveChatsRoutes = require("./app/routes/RetrieveChats"); // Express will use the routes present in RetrieveChats.js
server.use("/retrieveChats", retrieveChatsRoutes); //Express will map /retrieveChats to ./app/routes/RetrieveChats, while will contain the corresponding routes.
//  /api must be specifically mentioned after /retrieveChats in order to get the corresponding routes. /api is not necessary to have in the routes, but it is good practice to have it.

const deleteChatRoutes = require("./app/routes/DeleteChat");
server.use("/deleteChat", deleteChatRoutes);

const signupRoutes = require("./app/routes/SignUp");
server.use("/signup", signupRoutes);

const deleteuserRoutes = require("./app/routes/DeleteUser");
server.use("/deleteuser", deleteuserRoutes);

const signinRoutes = require("./app/routes/SignIn");
server.use("/signin", signinRoutes);

const fetchUserDataRoutes = require("./app/routes/FetchUserData");
server.use("/fetchUserData", fetchUserDataRoutes);


const fetchSearchResultsRoutes = require("./app/routes/FetchSearchResults");
server.use("/fetchSearchResults", fetchSearchResultsRoutes);

const sessionCheck = require("./app/routes/SessionCheck");
server.use("/sessionCheck", sessionCheck);

const saveProfileDatsRoutes = require("./app/routes/SaveProfileData");
server.use("/saveProfileData", saveProfileDatsRoutes);

const uploads3Routes = require("./app/routes/S3upload");
server.use("/S3upload", uploads3Routes);

const fetchRequestsReceivedRoutes = require("./app/routes/requests/FetchRequestsReceived");
server.use("/fetchRequestsReceived", fetchRequestsReceivedRoutes);

const fetchRequestsSentRoutes = require("./app/routes/requests/FetchRequestsSent");
server.use("/fetchRequestsSent", fetchRequestsSentRoutes);

const sendRequestRoutes = require("./app/routes/requests/SendRequest");
server.use("/sendRequest", sendRequestRoutes);

const declineRequestRoutes = require("./app/routes/requests/DeclineRequest");
server.use("/declineRequest", declineRequestRoutes);

const cancelRequestRoutes = require("./app/routes/requests/CancelRequest");
server.use("/cancelRequest", cancelRequestRoutes);

const acceptRequestRoutes = require("./app/routes/requests/AcceptRequest");
server.use("/acceptRequest", acceptRequestRoutes);

server.listen(HTTP_PORT, () => {
	console.log("Server started on http://localhost:6969");
});


/** WEB SOCKET SERVER | CHATS */
wss.on("connection", (ws, req) => {
	console.log("New client connected on websocket server");

	sessionMiddleWare(req, {}, () => {
		console.log("[Chat] Session ID: " + req.sessionID);
		console.log("[Chat] Session: " + JSON.stringify(req.session));
	});

	const res = {
		json: (data) => {
			ws.send(JSON.stringify(data));
		},
	};

	ws.on("message", (message) => {
		console.log(`Received message => ${message}`);
		const { action, body } = JSON.parse(message);
		const chatID = body.chatID;
		req.body = body;
		(async () => {
			switch (action) {
				case "insertMessage":
					await handleInsertingMessage(req, res);
					break;
				case "retrieveMessages":
					await handleRetrievingMessages(req, res);
					break;
				case "editMessage":
					await handleEditingMessage(req, res);
					break;
				case "deleteMessage":
					await handleDeletingMessage(req, res);
					break;
				default:
					console.log(`Unknown action: ${action}`);
			}

			if (
				action === "insertMessage" ||
				action === "editMessage" ||
				action === "deleteMessage"
			) {
				wss.clients.forEach((client) => {
					if (client.readyState === WebSocket.OPEN) {
						client.send(
							JSON.stringify({ chatID: chatID, broadcast: true })
						);
					}
				});
			}
		})();
	});
});

// WEBSOCKET SERVER SESSION
wssSession.on("connection", (ws, req) => {
	console.log("New Client connected on WebSocket Server for Session.");

	sessionMiddleWare(req, {}, () => {
		console.log("[Session] Session ID: " + req.sessionID);
		console.log("[Session] Session Data: " + JSON.stringify(req.session));

		// CHECK IF memberID SESSION VARIABLE EXISTS
		if (req.session.loggedInUserMemberID)
			ws.send(
				JSON.stringify({
					type: "userStatus",
					status: "signedIn",
				})
			);
		else
			ws.send(
				JSON.stringify({
					type: "userStatus",
					status: "signedOut",
				})
			);
	});

	// STORE THE DATA IN JSON OBJECT TO SEND TO ENDPOINTS
	const res = {
		json: (data) => {
			ws.send(JSON.stringify(data));
		},
	};

	ws.on("message", (message) => {
		console.log(`[Session] Received Message:\n ${message}`);
		const { action, body } = JSON.parse(message);

		req.body = body;
		(async () => {
			switch (action) {
				case "signedIn":
					console.log("[Session] Received Sign In Request.");
					ws.send(
						JSON.stringify({
							type: "userStatus",
							status: "signedIn",
						})
					);
					break;
				case "signedOut":
					console.log("[Session] Received Sign Out Request.")
				default:
					console.log(`[Session] Unknown Action: ${action}`);
			}

		})();
	});
});
