const request = require('supertest');
const express = require('express');
const router = require('../app/routes/requests/BlockUser'); // replace with the path to your router
const db = require('../app/db-connection');
const server = express();
global.setImmediate = (callback) => setTimeout(callback, 0);



// Replace anything that require db-connection with the following object
 jest.mock('../app/db-connection', () => (
    
    { 
    oneOrNone: jest.fn(),
    none: jest.fn(),
    any: jest.fn(),
    tx: jest.fn().mockImplementation((callback) => {
        const t = {
          none: jest.fn(),
        };
        callback(t);
        return Promise.resolve();
      })

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
server.use('/blockUser', router); // attach your router

describe('If able to cancel request', () => {

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
            else if(query.includes('SELECT * FROM chat WHERE ("memberID1" = $1 AND "memberID2" = $2) OR ("memberID1" = $2 AND "memberID2" = $1)') && values[0] == 'mockLoggedInUserMemberID' && values[1] == 'mockTestMemberID')
            {
                return Promise.resolve(null); // No chat exists between the two users
            }
            {
                return Promise.resolve(null);
            }
        });

        db.tx.mockImplementation((callback) => {
            const t = {
                none: jest.fn().mockImplementation((query, values) => {
                    if (query.includes('DELETE FROM request WHERE ("toMemberID" = $1 AND "fromMemberID" = $2) OR ("toMemberID" = $2 AND "fromMemberID" = $1)') && values[0] == 'mockLoggedInUserMemberID' && values[1] == 'mockTestMemberID') {
                        return Promise.resolve();
                    } else if (query.includes('DELETE FROM chat WHERE ("memberID1" = $1 AND "memberID2" = $2) OR ("memberID1" = $2 AND "memberID2" = $1)') && values[0] == 'mockLoggedInUserMemberID' && values[1] == 'mockTestMemberID') {
                        return Promise.resolve();
                    } else if(query.includes('INSERT INTO blocked_user("blockerMemberID", "blockedMemberID") VALUES ($1, $2)') && values[0] == 'mockLoggedInUserMemberID' && values[1] == 'mockTestMemberID') {
                        return Promise.resolve();
                    }
                    else {
                        return Promise.resolve();
                    }
                }),
            };
            return callback(t);
        });


        const res = await 
        request(server)
        .post('/blockUser/api'); // Specify the endpoint. In this current express app, it is the only router we added
        const resBody = JSON.parse(res.text);
        expect(resBody.status).toBe(201);
    });
});


       