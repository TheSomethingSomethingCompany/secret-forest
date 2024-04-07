const request = require('supertest');
const express = require('express');
const router = require('../app/routes/RetrieveChats'); // replace with the path to your router
const db = require('../app/db-connection');
const server = express();
global.setImmediate = (callback) => setTimeout(callback, 0);



// Replace anything that require db-connection with the following object
 jest.mock('../app/db-connection', () => (
    
    { 
    oneOrNone: jest.fn(),
    none: jest.fn(),
    any: jest.fn(),
    one: jest.fn(),

    }
  ));

server.use(express.json()); // for parsing application/json

// Specify mock session data
const mockSessionData = {loggedInUserMemberID: "mockLoggedInUserMemberID"};

// Mock the session data by setting req.session to mockSessionData
// This is global middleware that will be called no matter what route is being accessed
server.use((req, res, next) => {
  req.session = mockSessionData;
  next(); // Call the next middleware, which sets the mock query, as seen below
});

const mockBody = {username: "mockTestUsername"};
server.use( (req, res, next) => {
    req.body = mockBody;
    next(); // Call the next middleware, which is the router, as seen below
});


// The next middleware being called. This is why it was important to call next() in the previous middleware, because otherwise this code would not have been executed.
server.use('/retrieveChats', router); // attach your router

describe('If able to cancel request', () => {

    it('should return status 201', async () => {

        db.any.mockImplementation( () => {

            return Promise.resolve([{}, {}]);
        });

        db.one.mockImplementation(() => {
            return Promise.resolve({username: 'mockLoggedInUsername'});
        });
       
        const res = await 
        request(server)
        .get('/retrieveChats/api'); // Specify the endpoint. In this current express app, it is the only router we added
        const resBody = JSON.parse(res.text);
        expect(resBody.status).toBe(200);
    });
});



        
       