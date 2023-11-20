const express = require("express");
const router = express.Router();
const db = require("../db-connection.js")

router.post('/api', async (req, res) => {
    
    try
    {
        
        // Since we are not using sessions, we will hardcode the memberID for now
        const memberID1 = 'b46cf0a7-06c7-4e31-a9c4-e868d86d6027'; // One of the members of chat must clearly be the logged in user, which is hardcoded for now.
        const usernameOfMemberID2 = req.body.username; // The other member of the chat is the one that the logged in user is trying to chat with, which is passed in the request body as their username.
        // First, we need to check if the user exists, and if they do, use their memberID
        const memberID2Query = await db.any(`
        SELECT "memberID" FROM member WHERE username = $1
        `, [usernameOfMemberID2]);

        if(memberID2Query.length === 0)
        {
            res.json({ status: 404, message: 'User does not exist' });
        }
        else
        {
            const memberID2 = memberID2Query[0].memberID; // An array of rows is returned, which each row being an object with a memberID property. The first row is the only row, so we can access it with [0], and then access the memberID property with .memberID
            // Check if chat already exists
            const chatExists = await db.any(`
            SELECT * FROM chat WHERE ("memberID1" = $1 AND "memberID2" = $2) OR ("memberID1" = $2 AND "memberID2" = $1)
            `, [memberID1, memberID2]);

            if(chatExists.length > 0)
            {
                res.json({ status: 409, message: 'Chat already exists' });
            }

            else
            {
                console.log("IN HERE");
                await db.none(`
                INSERT INTO chat("memberID1", "memberID2") VALUES ($1, $2)
                `, [memberID1, memberID2]);
                res.json({ status: 201, message: 'Created chat successfully'});
            }
        }
        
    } 
    catch(error)
    {
        res.json({ status: 500, message: 'Failed to create chat'});
    }
});

module.exports = router;