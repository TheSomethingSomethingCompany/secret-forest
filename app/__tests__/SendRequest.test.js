/*
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const { setImmediate } = require('timers');
global.setImmediate = setImmediate;
*/

const request = require('supertest');
const express = require('express');
const router = require('../app/routes/requests/SendRequest'); // replace with the path to your router
const db = require('../app/db-connection');
const server = express();



// Replace anything that require db-connection with the following object
 jest.mock('../app/db-connection', () => (
    
    { 
    oneOrNone: jest.fn(), 
    none: jest.fn(),
    }
  ));

server.use(express.json()); // for parsing application/json

// Specify mock session data
const mockSessionData = {loggedInUserMemberID: "mockLoggedInUserMemberID"};

// Mock the session data by setting req.session to mockSessionData
// This is global middleware that will be called no matter what route is being accessed
server.use((req, res, next) => {
  req.session = mockSessionData;
  next(); // Call the next middleware, which is the router, as seen below
});

// The next middleware being called. This is why it was important to call next() in the previous middleware, because otherwise this code would not have been executed.
server.use('/sendRequest', router); // attach your router

describe('Given that no request, chat, or block exists between 2 users, and request is created successfully', () => {
  it('should respond with a status code of 201', async () => {
    const mockData = { username: 'testToUsername' }; // Mock request body received on the router endpoint


    // Every instance of `db.oneOrNone` in the router will be replaced with this function
    

    /** SETUP */
    // mockLoggedInUserMemberID is the memberID of the logged in user
    // testToUsername is the username of the user that the logged in user is trying to send a request to
    // Between these 2 users, we will assume the following:
        // - The user with username testToUsername exists
        // - The user with username testToUsername has a memberID of 1
        // - The logged in user is not trying to send a request to themselves
        // - The logged in user and the user with username testToUsername have not blocked each other
        // - There is no existing request between the logged in user and the user with username testToUsername
        // - There is no existing chat between the logged in user and the user with username testToUsername
    // The expected response is a 200 status code, which is what we are testing
    
    db.oneOrNone.mockImplementation((query, values) => {
      if (query.includes('SELECT "memberID" FROM member WHERE username = $1') && values[0] == 'testToUsername') { // Mock the first query, which is the "toUsername" query.
        return Promise.resolve({ memberID: "testToMemberID" }); // While memberIDs are uuid, this is just a mock value
      } 
      else if(query.includes('SELECT * FROM blocked_user WHERE ("blockerMemberID" = $1 AND "blockedMemberID" = $2) OR ("blockerMemberID" = $2 AND "blockedMemberID" = $1)') && values[0] == "mockLoggedInUserMemberID" && values[1] == "testToMemberID") { // Mock the blockExists toUsernameQuery
        return Promise.resolve(null);
      }
      else if(query.includes('SELECT * FROM request WHERE ("fromMemberID" = $1 AND "toMemberID" = $2) OR ("fromMemberID" = $2 AND "toMemberID" = $1)') && values[0] == "mockLoggedInUserMemberID" && values[1] == "testToMemberID") { // Mock the requestExists query
        return Promise.resolve(null);
      }
      else if(query.includes('SELECT * FROM chat WHERE ("memberID1" = $1 AND "memberID2" = $2) OR ("memberID1" = $2 AND "memberID2" = $1)') && values[0] == "mockLoggedInUserMemberID" && values[1] == "testToMemberID") { // Mock the chatExists query
        return Promise.resolve(null);
      }
      else {
        return Promise.resolve();
      }

    });

    db.none.mockImplementation((query, values) => { // While this does not need to be specified, as any query not being tested will always be mocked by default with a return value of Promise.resolve(), it is here for completeness
        if(query.includes('INSERT INTO request("fromMemberID", "toMemberID") VALUES ($1, $2)') && values[0] == "mockLoggedInUserMemberID" && values[1] == "testToMemberID") { // Mock the insert request query
            console.log("IN HERE: " + values[0] + " " + values[1]);
            return Promise.resolve();
        }
    });

    const response = await request(server)
      .post('/sendRequest/api') // The endpoint you are testing (All are /api in this case)
      .send(mockData) // The request body
      .set('Accept', 'application/json');

    const resBody = JSON.parse(response.text);
    expect(resBody.status).toBe(201);

  });

});

describe("Given that the user does not exist", () => {


    it('should respond with a status code of 404', async () => {
        const mockData = { username: 'nonExistentUsername' }; // Mock request body received on the router endpoint. Not necessary here, since we're just enforcing the promise to return null, but it's here for completeness.
    
        db.oneOrNone.mockImplementation((query, values) => {
        if (query.includes('SELECT "memberID" FROM member WHERE username = $1') && values[0] == 'nonExistentUsername') { // Mock the first query, which is the "toUsername" query.
            return Promise.resolve(null); // This is the case where the user does not exist
        } 
        else {
            return Promise.resolve();
          }
    
        });
    
        const response = await request(server)
        .post('/sendRequest/api') // The endpoint you are testing (All are /api in this case)
        .send(mockData) // The request body
        .set('Accept', 'application/json');
    
        const resBody = JSON.parse(response.text);
        expect(resBody.status).toBe(404);
    
    });
});

describe("Given that 2 users have blocked eachother and one is trying to send a request to the other", () => {

    it('should respond with a status code of 409', async () => {
        const mockData = { username: 'testToUsername' }; // Mock request body received on the router endpoint
    
        db.oneOrNone.mockImplementation((query, values) => {
            if (query.includes('SELECT "memberID" FROM member WHERE username = $1') && values[0] == 'testToUsername') { // Mock the first query, which is the "toUsername" query.
                return Promise.resolve({ memberID: "testToMemberID" }); // While memberIDs are uuid, this is just a mock value
              } 
              else if (query.includes('SELECT * FROM blocked_user WHERE ("blockerMemberID" = $1 AND "blockedMemberID" = $2) OR ("blockerMemberID" = $2 AND "blockedMemberID" = $1)') && values[0] == 'mockLoggedInUserMemberID' && values[1] == 'testToMemberID' ) { // Mock the blockExists toUsernameQuery
                return Promise.resolve({}); // Make a return value that is not null
              }
              else {
                return Promise.resolve();
              }
        });
    
        const response = await request(server)
        .post('/sendRequest/api') // The endpoint you are testing (All are /api in this case)
        .send(mockData) // The request body
        .set('Accept', 'application/json');
    
        const resBody = JSON.parse(response.text);
        expect(resBody.status).toBe(409);
    
    });
});


describe("Given that a request already exists between 2 users and one is trying to send a request to the other", () => {

    it('should respond with a status code of 409', async () => {
        const mockData = { username: 'testToUsername' }; // Mock request body received on the router endpoint
    
        db.oneOrNone.mockImplementation((query, values) => {
            if (query.includes('SELECT "memberID" FROM member WHERE username = $1') && values[0] == 'testToUsername') { // Mock the first query, which is the "toUsername" query.
                return Promise.resolve({ memberID: "testToMemberID" }); // While memberIDs are uuid, this is just a mock value
              } 
              else if (query.includes('SELECT * FROM blocked_user WHERE ("blockerMemberID" = $1 AND "blockedMemberID" = $2) OR ("blockerMemberID" = $2 AND "blockedMemberID" = $1)') && values[0] == 'mockLoggedInUserMemberID' && values[1] == 'testToMemberID' ) { // Mock the blockExists toUsernameQuery
                return Promise.resolve(null);
              }
              else if (query.includes('SELECT * FROM request WHERE ("fromMemberID" = $1 AND "toMemberID" = $2) OR ("fromMemberID" = $2 AND "toMemberID" = $1)') && values[0] == 'mockLoggedInUserMemberID' && values[1] == 'testToMemberID') { // Mock the requestExists query
                return Promise.resolve({}); // Make a return value that is not null
              }
              else {
                return Promise.resolve();
              }
        });
    
        const response = await request(server)
        .post('/sendRequest/api') // The endpoint you are testing (All are /api in this case)
        .send(mockData) // The request body
        .set('Accept', 'application/json');
    
        const resBody = JSON.parse(response.text);
        expect(resBody.status).toBe(409);
    
    });
});

describe("Assuming that a chat already exists between 2 users and one is trying to send a request to the other", () => {

    it('should respond with a status code of 409', async () => { 
        const mockData = { username: 'testToUsername' }; // Mock request body received on the router endpoint
    
        db.oneOrNone.mockImplementation((query, values) => {
            if (query.includes('SELECT "memberID" FROM member WHERE username = $1') && values[0] == 'testToUsername') { // Mock the first query, which is the "toUsername" query.
                return Promise.resolve({ memberID: "testToMemberID" }); // While memberIDs are uuid, this is just a mock value
              } 
              else if (query.includes('SELECT * FROM blocked_user WHERE ("blockerMemberID" = $1 AND "blockedMemberID" = $2) OR ("blockerMemberID" = $2 AND "blockedMemberID" = $1)') && values[0] == 'mockLoggedInUserMemberID' && values[1] == 'testToMemberID' ) { // Mock the blockExists toUsernameQuery
                return Promise.resolve(null);
              }
              else if (query.includes('SELECT * FROM request WHERE ("fromMemberID" = $1 AND "toMemberID" = $2) OR ("fromMemberID" = $2 AND "toMemberID" = $1)') && values[0] == 'mockLoggedInUserMemberID' && values[1] == 'testToMemberID') { // Mock the requestExists query
                return Promise.resolve(null);
              }
              else if (query.includes('SELECT * FROM chat WHERE ("memberID1" = $1 AND "memberID2" = $2) OR ("memberID1" = $2 AND "memberID2" = $1)') && values[0] == 'mockLoggedInUserMemberID' && values[1] == 'testToMemberID') { // Mock the chatExists query
                return Promise.resolve({}); // Make a return value that is not null
              }
              else {
                return Promise.resolve();
              }
        });
    
        const response = await request(server)
        .post('/sendRequest/api') // The endpoint you are testing (All are /api in this case)
        .send(mockData) // The request body
        .set('Accept', 'application/json');
    
        const resBody = JSON.parse(response.text);
        expect(resBody.status).toBe(409);
    
    });
});



describe("Assuming that creating a request fails", () => {
    it('should respond with a status code of 500', async () => {
        const mockData = { username: 'testToUsername' }; // Mock request body received on the router endpoint
    
        db.oneOrNone.mockImplementation((query, values) => {
            if (query.includes('SELECT "memberID" FROM member WHERE username = $1') && values[0] == 'testToUsername') { // Mock the first query, which is the "toUsername" query.
                return Promise.resolve({ memberID: "testToMemberID" }); // While memberIDs are uuid, this is just a mock value
              } 
              else if (query.includes('SELECT * FROM blocked_user WHERE ("blockerMemberID" = $1 AND "blockedMemberID" = $2) OR ("blockerMemberID" = $2 AND "blockedMemberID" = $1)') && values[0] == 'mockLoggedInUserMemberID' && values[1] == 'testToMemberID' ) { // Mock the blockExists toUsernameQuery
                return Promise.resolve(null);
              }
              else if (query.includes('SELECT * FROM request WHERE ("fromMemberID" = $1 AND "toMemberID" = $2) OR ("fromMemberID" = $2 AND "toMemberID" = $1)') && values[0] == 'mockLoggedInUserMemberID' && values[1] == 'testToMemberID') { // Mock the requestExists query
                return Promise.resolve(null);
              }
              else if (query.includes('SELECT * FROM chat WHERE ("memberID1" = $1 AND "memberID2" = $2) OR ("memberID1" = $2 AND "memberID2" = $1)') && values[0] == 'mockLoggedInUserMemberID' && values[1] == 'testToMemberID') { // Mock the chatExists query
                return Promise.resolve(null);
              }
              else {
                return Promise.resolve();
              }
        });

        db.none.mockImplementation((query, values) => {
            if(query.includes('INSERT INTO request("fromMemberID", "toMemberID") VALUES ($1, $2)') && values[0] == 'mockLoggedInUserMemberID' && values[1] == 'testToMemberID') { // Mock the insert request query
                return Promise.reject();
            }

        });
    
        const response = await request(server)
        .post
        ('/sendRequest/api') // The endpoint you are testing (All are /api in this case)
        .send(mockData) // The request body
        .set('Accept', 'application/json');

        const resBody = JSON.parse(response.text);
        expect(resBody.status).toBe(500);
    });



});