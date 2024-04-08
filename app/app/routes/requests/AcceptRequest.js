const express = require("express");
const router = express.Router();
const db = require("../../db-connection.js")

router.post('/api', async (req, res) => {
    
    try
    {
        const toMemberID = req.session.loggedInUserMemberID; // The logged in user is the one that is trying to accept the request, so we will use their memberID
        const fromUsername = req.body.username; // The username from the request body is the user that the logged in user is trying to accept the request from
       
        // First, we need to check if the user exists, and if they do, use their memberID
        const fromUsernameQuery = await db.oneOrNone(`
        SELECT "memberID" FROM member WHERE username = $1
        `, [fromUsername]);

        if(fromUsernameQuery==null)
        {
          return res.json({ status: 404, message: 'User does not exist' });
        }
     
        const fromMemberID = fromUsernameQuery.memberID; 
        
        // Check if request actually exists
        const requestExists = await db.oneOrNone(`
        SELECT * FROM request WHERE ("toMemberID" = $1 AND "fromMemberID" = $2)
        `, [toMemberID, fromMemberID]); // The left side of the OR is if the logged in user has sent a request to the other user, and the right side is if the other user has sent a request to the logged in user

        if(requestExists == null)
        {
           return res.json({ status: 404, message: 'Request does not exist' });
        }

        // Next, we need to insert the two memberIDs into the chat table.
        // Firstly, we need to check if a chat already exists between the two members
        const chatExists = await db.oneOrNone(`
        SELECT * FROM chat WHERE ("memberID1" = $1 AND "memberID2" = $2) OR ("memberID1" = $2 AND "memberID2" = $1)
        `, [toMemberID, fromMemberID]);

        if(chatExists != null)
        {
            // If the chat already exists, then we can delete the request and return a 409 status code
            await db.none(`
            DELETE FROM request WHERE ("toMemberID" = $1 AND "fromMemberID" = $2)
            `, [toMemberID, fromMemberID]);

            return res.json({ status: 409, message: 'Chat already exists' });
        }

      
        // If the chat does not exist, then we can delete the request and insert the two memberIDs into the chat table
        // Use transactions to ensure that all queries are executed successfully, or else rollback all queries
        // If any of the queries fail, then the entire transaction will be rolled back and an error will be thrown and caught by the catch block
        await db.tx(async t => {
            await t.none(`
            DELETE FROM request WHERE ("toMemberID" = $1 AND "fromMemberID" = $2)
            `, [toMemberID, fromMemberID]);

            await t.none(`
            INSERT INTO chat("memberID1", "memberID2") VALUES ($1, $2)
            `, [toMemberID, fromMemberID]);
        });
         
        return res.json({ status: 201, message: 'Created chat successfully'});
    } 
    catch(error)
    {
        res.json({ status: 500, message: 'Failed to accept request', pgErrorObject: {...error}});
    }
});

module.exports = router;