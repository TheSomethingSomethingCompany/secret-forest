const express = require("express");
const router = express.Router();
const db = require("../db-connection.js")

router.post('/api', async (req, res) => {
    
    try
    {
        
        // Since we are not using sessions, we will hardcode the memberID for now
        const fromMemberID = req.session.loggedInUserMemberID; // One of the members of chat must clearly be the logged in user
        const toUsername = req.body.username; // The username from the request body is the user that the logged in user is trying to send a request to
       
        // First, we need to check if the user exists, and if they do, use their memberID
        const toUsernameQuery = await db.oneOrNone(`
        SELECT "memberID" FROM member WHERE username = $1
        `, [toUsername]);

        if(toUsernameQuery==null)
        {
            res.json({ status: 404, message: 'User does not exist' });
        }
        else
        {
            const toMemberID = toUsernameQuery.memberID; // An array of rows is returned, which each row being an object with a memberID property. The first row is the only row, so we can access it with [0], and then access the memberID property with .memberID
            
            // Check if request already exists, where fromNen
            const requestExists = await db.oneOrNone(`
            SELECT * FROM request WHERE ("fromMemberID" = $1 AND "toMemberID" = $2) OR ("fromMemberID" = $2 AND "toMemberID" = $1)
            `, [fromMemberID, toMemberID]); // The left side of the OR is if the logged in user has sent a request to the other user, and the right side is if the other user has sent a request to the logged in user

            if(requestExists != null)
            {
                res.json({ status: 409, message: 'Request already exists' });
            }

            else
            {
                await db.none(`
                INSERT INTO request("fromMemberID", "toMemberID") VALUES ($1, $2)
                `, [toMemberID, fromMemberID]);
                res.json({ status: 201, message: 'Created request successfully'});
            }
        }
        
    } 
    catch(error)
    {
        res.json({ status: 500, message: 'Failed to create request'});
    }
});

module.exports = router;