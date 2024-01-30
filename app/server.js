const express = require("express");
const session = require("express-session");
const WebSocket = require('ws');
const cors = require("cors");
const path = require("path")

const HTTP_PORT = 6969;
const WEBSOCKET_PORT = 7979;

const handleInsertingMessage = require('./app/wssFunctions/InsertMessage');
const handleRetrievingMessages = require("./app/wssFunctions/RetrieveMessages");
const handleEditingMessage = require( "./app/wssFunctions/EditMessage");
const handleDeletingMessage = require("./app/wssFunctions/DeleteMessage");

const server = express(); // Create an express server
const wss = new WebSocket.Server({ port: WEBSOCKET_PORT }); // Create a websocket server
//Middleware to parse JSON requests
server.use(express.json());

 const corsOptions = {
   origin: "http://localhost:3000",
   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
   credentials: true,
   optionsSuccessStatus: 200,
 };

// //Middleware to parse JSON requests
server.use(cors(corsOptions));

const sessionMiddleWare = session({
  secret: "my super duper secret key hehe :)", // Secret key used to sign sessionID cookie by combining it with the sessionID value. On the server, it will use this secret key to hash with sessionID transmitted, and check if it matches the hash value of the sessionID cookie. If it does, then the sessionID cookie is valid, and no tampering has occurred. Also, this should be stored in a .env file, but for now, we will leave it here.
  resave: false, // Setting this to true forces the session to be saved back to the session store, even if the session was never modified during the request.
  saveUninitialized: false, // Only create a session if a property is added to the session, rather than creating an empty JSON object to be stored in the session store before any properties are added to it.
  cookie: { secure: false }, // If true, then only transmit sessionID cookie over HTTPS. Since we are using HTTP as of right now, we set this to false. Once we implement HTTPS, we can set this to true.
})

server.use(sessionMiddleWare);


//Any Routes
const createProfileRoutes = require("./app/routes/CreateProfile"); // profileRoute will equal to the "router" object exported from routes/Profile.js
server.use("/createAProfile", createProfileRoutes); // Any time /createAProfile is put within URL, you tell express to utilize the routes present in createProfileRoutes = './routes/Profile'

const createChatRoutes = require("./app/routes/CreateChat");
server.use("/createChat", createChatRoutes);

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

const fetchProfileDataRoutes = require("./app/routes/FetchProfileData");
server.use("/fetchProfileData", fetchProfileDataRoutes);

const fetchSearchResultsRoutes = require("./app/routes/FetchSearchResults");
server.use("/fetchSearchResults", fetchSearchResultsRoutes);

const sessionCheck = require("./app/routes/SessionCheck");
server.use("/sessionCheck", sessionCheck);

const saveProfileDatsRoutes = require("./app/routes/SaveProfileData");
server.use("/saveProfileData", saveProfileDatsRoutes);


server.listen(HTTP_PORT, () => {
  console.log("Server started on http://localhost:6969");
});

/** WEB SOCKET SERVER */
wss.on('connection' , (ws, req) => {
  console.log("New client connected on websocket server");

  sessionMiddleWare(req, {}, () => {
    console.log("Session ID: " + req.sessionID);
    console.log("Session: " + JSON.stringify(req.session));
  });

  const res = { json: (data) => { ws.send(JSON.stringify(data)); } };

  ws.on('message', (message) => {
  console.log(`Received message => ${message}`);
   const {action, body} = JSON.parse(message);
   const chatID = body.chatID;
   req.body = body;
   (async () => {
   switch (action) {
    case 'insertMessage':
      await handleInsertingMessage(req, res);
      break;
    case 'retrieveMessages':
      await handleRetrievingMessages(req, res);
      break;
    case 'editMessage':
      await handleEditingMessage(req, res);
      break;
    case 'deleteMessage':
      await handleDeletingMessage(req, res);
      break;
    default:
      console.log(`Unknown action: ${action}`);
    }

    if(action === 'insertMessage' || action === 'editMessage' || action === 'deleteMessage')
    {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({'chatID': chatID, 'broadcast': true}));
        }
      })
    }
  })();
  });
});
