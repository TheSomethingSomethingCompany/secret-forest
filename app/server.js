const express = require("express");
const server = express();
const session = require("express-session");
const PORT = 6969;
const cors = require("cors");

//Middleware to parse JSON requests
server.use(express.json());
// server.use(cors({
//   origin: 'http://localhost:3000' // Replace with your client's origin
// }));

// const corsOptions = {
//   origin: "http://localhost:3000",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
//   optionsSuccessStatus: 200,
// };

// //Middleware to parse JSON requests
// server.use(cors(corsOptions));

server.use(
  session({
    secret: "my super duper secret key hehe :)", // Secret key used to sign sessionID cookie by combining it with the sessionID value. On the server, it will use this secret key to hash with sessionID transmitted, and check if it matches the hash value of the sessionID cookie. If it does, then the sessionID cookie is valid, and no tampering has occurred. Also, this should be stored in a .env file, but for now, we will leave it here.
    resave: false, // Setting this to true forces the session to be saved back to the session store, even if the session was never modified during the request.
    saveUninitialized: false, // Only create a session if a property is added to the session, rather than creating an empty JSON object to be stored in the session store before any properties are added to it.
    cookie: { secure: false }, // If true, then only transmit sessionID cookie over HTTPS. Since we are using HTTP as of right now, we set this to false. Once we implement HTTPS, we can set this to true.
  })
);

// Set global variable to be the current logged in user, which should be using session data, but is hardcoded for now

//Any Routes
const createProfileRoutes = require("./app/routes/CreateProfile"); // profileRoute will equal to the "router" object exported from routes/Profile.js
server.use("/createAProfile", createProfileRoutes); // Any time /createAProfile is put within URL, you tell express to utilize the routes present in createProfileRoutes = './routes/Profile'

const createChatRoutes = require("./app/routes/CreateChat");
server.use("/createChat", createChatRoutes);

const retrieveChatsRoutes = require("./app/routes/RetrieveChats"); // Express will use the routes present in RetrieveChats.js
server.use("/retrieveChats", retrieveChatsRoutes); //Express will map /retrieveChats to ./app/routes/RetrieveChats, while will contain the corresponding routes.
//  /api must be specifically mentioned after /retrieveChats in order to get the corresponding routes. /api is not necessary to have in the routes, but it is good practice to have it.

const retrieveMessagesRoutes = require("./app/routes/RetrieveMessages");
server.use("/retrieveMessages", retrieveMessagesRoutes);

const sendMessageRoutes = require("./app/routes/SendMessage");
server.use("/sendMessage", sendMessageRoutes);

const deleteMessageRoutes = require("./app/routes/DeleteMessage");
server.use("/deleteMessage", deleteMessageRoutes);

const deleteChatRoutes = require("./app/routes/DeleteChat");
server.use("/deleteChat", deleteChatRoutes);

const editMessageRoutes = require("./app/routes/EditMessage");
server.use("/editMessage", editMessageRoutes);

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

server.listen(PORT, () => {
  console.log("Server started on http://localhost:6969");
});
