const express = require("express");
const server = express();
const cors = require('cors');
const PORT = 6969;
//const cors = require('cors');

//Middleware to parse JSON requests
server.use(express.json());
server.use(cors({
  origin: 'http://localhost:3000' // Replace with your client's origin
}));

// Set global variable to be the current logged in user, which should be using session data, but is hardcoded for now
server.set("loggedInUser", "63f10fa3-1109-4986-993d-f7aac2f40c40"); // This is the memberID of the logged in user, which is hardcoded for now

//Any Routes
const createProfileRoutes = require("./app/routes/Profile"); // profileRoute will equal to the "router" object exported from routes/Profile.js
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

server.listen(PORT, () => {
  console.log("Server started on http://localhost:6969");
});
