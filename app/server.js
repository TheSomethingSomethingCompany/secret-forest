const express = require("express");
const server = express();
const PORT = 6969;
//const cors = require('cors');

//Middleware to parse JSON requests
server.use(express.json());
//server.use(cors());

//Any Routes
const createProfileRoutes = require('./app/routes/Profile');  // profileRoute will equal to the "router" object exported from routes/Profile.js
server.use('/createAProfile', createProfileRoutes ); // Any time /createAProfile is put within URL, you tell express to utilize the routes present in createProfileRoutes = './routes/Profile'

const retrieveChatsRoutes = require('./app/routes/RetrieveChats'); // Express will use the routes present in RetrieveChats.js
server.use('/retrieveChats', retrieveChatsRoutes); //Express will map /retrieveChats to ./app/routes/RetrieveChats, while will contain the corresponding routes.
                                                //  /api must be specifically mentioned after /retrieveChats in order to get the corresponding routes. /api is not necessary to have in the routes, but it is good practice to have it.

const retrieveMessagesRoutes = require('./app/routes/RetrieveMessages');
server.use('/retrieveMessages', retrieveMessagesRoutes);

const sendMessageRoutes = require('./app/routes/SendMessage');
server.use('/sendMessage', sendMessageRoutes);

server.listen(PORT, ()=>{
    console.log('Server started on http://localhost:6969');
})


