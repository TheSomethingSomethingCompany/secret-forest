const request = require('supertest');
const express = require('express');
const router = require('../app/routes/requests/DeclineRequest'); // replace with the path to your router
const db = require('../app/db-connection');
const exp = require('constants');
const server = express();
global.setImmediate = (callback) => setTimeout(callback, 0);



// Replace anything that require db-connection with the following object
 jest.mock('../app/db-connection', () => (
    
    { 
    oneOrNone: jest.fn(),
    none: jest.fn(),
    any: jest.fn()

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
server.use('/declineRequest', router); // attach your router

describe('If able to block user', () => {

    it('should return status 201', async () => {

        db.oneOrNone.mockImplementation( (query, values) => {

            if(query.includes('SELECT "memberID" FROM member WHERE username = $1') && values[0] == 'mockTestUsername')
            {
                return Promise.resolve({memberID: 'mockTestMemberID'});
            }
            else if(query.includes('SELECT * FROM request WHERE ("toMemberID" = $1 AND "fromMemberID" = $2)') && values[0] == 'mockLoggedInUserMemberID' && values[1] == 'mockTestMemberID')
            {
                 return Promise.resolve({}) // Not null implies that the request exists
            }
            else
            {
                return Promise.resolve(null);
            }
        });

        db.none.mockImplementationOnce(() => {
            return Promise.resolve(); // Ensure the query is successful
        });
       
        const res = await 
        request(server)
        .post('/declineRequest/api'); // Specify the endpoint. In this current express app, it is the only router we added
        const resBody = JSON.parse(res.text);
        expect(resBody.status).toBe(201);
        expect(resBody.message).toBe('Declined request successfully');
    });
});




describe('If the logged in user is attempting to decline request with non-existent username', () => {
    it('should return status 404', async () => {

        db.oneOrNone.mockImplementation((query, values) => {
            if(query.includes('SELECT "memberID" FROM member WHERE username = $1'))
            {
                return Promise.resolve(null);
            }
            else
            {
                return Promise.resolve(null);
            }


        });
       
        const res = await 
        request(server)
        .post('/declineRequest/api');

        const resBody = JSON.parse(res.text);
        expect(resBody.status).toBe(404);
        expect(resBody.message).toBe('User does not exist');
    });
});

describe('If the logged in user is attempting to decline non-existent request', () => {
    it('should return status 404', async () => {

        db.oneOrNone.mockImplementation((query, values) => {
            if(query.includes('SELECT "memberID" FROM member WHERE username = $1'))
            {
                return Promise.resolve({memberID: 'mockTestMemberID'});
            }

            else if(query.includes('SELECT * FROM request WHERE ("toMemberID" = $1 AND "fromMemberID" = $2)') && values[0] == 'mockLoggedInUserMemberID' && values[1] == 'mockTestMemberID')
            {
                return Promise.resolve(null); // Implies that the request does not exist
            }

            else
            {
                return Promise.resolve(null);
            }


        });
       
        const res = await 
        request(server)
        .post('/declineRequest/api');

        const resBody = JSON.parse(res.text);
        expect(resBody.status).toBe(404);
        expect(resBody.message).toBe('Request does not exist');
    });
});

describe('If the logged in user is attempting to decline non-existent request', () => {
    it('should return status 404', async () => {

        db.oneOrNone.mockImplementation((query, values) => {
            if(query.includes('SELECT "memberID" FROM member WHERE username = $1'))
            {
                return Promise.resolve({memberID: 'mockTestMemberID'});
            }

            else if(query.includes('SELECT * FROM request WHERE ("toMemberID" = $1 AND "fromMemberID" = $2)') && values[0] == 'mockLoggedInUserMemberID' && values[1] == 'mockTestMemberID')
            {
                return Promise.resolve({}); // Implies that the request does exist
            }

            else
            {
                return Promise.resolve(null);
            }


        });

        db.none.mockImplementationOnce(() => {
            return Promise.reject(); // Ensure the query is unsuccessful
        });
       
        const res = await 
        request(server)
        .post('/declineRequest/api');

        const resBody = JSON.parse(res.text);
        expect(resBody.status).toBe(500);
        expect(resBody.message).toBe('Failed to delete request');
    });
});


        
       