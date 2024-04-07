const request = require('supertest');
const express = require('express');
const router = require('../app/routes/requests/FetchBlockedUsers'); // replace with the path to your router
const db = require('../app/db-connection');
const server = express();



// Replace anything that require db-connection with the following object
 jest.mock('../app/db-connection', () => (
    
    { 
    any: jest.fn(), // This router only uses the any method
    }
  ));

server.use(express.json()); // for parsing application/json

// Specify mock session data
const mockSessionData = {loggedInUserMemberID: "mockLoggedInUserMemberID"};
server.use((req, res, next) => {
  req.session = mockSessionData;
  next(); // Call the next middleware, which sets the mock query, as seen below
});

const mockQuery = {searchQ: "mockSearchQ", op: 0};
server.use( (req, res, next) => {
    req.query = mockQuery;
    next(); // Call the next middleware, which is the router, as seen below
});

// The next middleware being called. This is why it was important to call next() in the previous middleware, because otherwise this code would not have been executed.
server.use('/fetchBlockedUsers', router); // attach your router

describe('If fetching blocked users is successful', () => {
    it('should return status 200 and the data', async () => {

        db.any.mockImplementationOnce(() => {
        
            return Promise.resolve('mockData');
        });
       
        const res = await 
        request(server)
        .get('/fetchBlockedUsers/api'); // Specify the endpoint. In this current express app, it is the only router we added

        const resBody = JSON.parse(res.text)
        expect(resBody.status).toBe(200);
        expect(resBody.message).toBe('Retrieved blocked users successfully');
        expect(resBody.data).toBe('mockData');
    });
});

describe('If fetching blocked users is unsuccessful', () => {
    it('should return status 500 and the error message', async () => {

        db.any.mockImplementationOnce(() => {
        
            return Promise.reject(new Error('mockError'));
        });
       
        const res = await 
        request(server)
        .get('/fetchBlockedUsers/api');

        const resBody = JSON.parse(res.text)
        expect(resBody.status).toBe(500);
       expect(resBody.message).toBe('Failed to retrieve blocked users');
    });
});



        
       