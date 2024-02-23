const express = require("express");
const router = express.Router();
const db = require("../../db-connection.js")

router.post('/api', async (req, res) => {
    
    try
    {
        const blockerMemberID = req.session.loggedInUserMemberID; // The logged in user is the one that is trying to block the request, so we will use their memberID
        const blockedUsername = req.body.username; // The username from the request body is the user that the logged in user is trying to block
       
        // First, we need to check if the user exists, and if they do, use their memberID
        const blockedMemberIDQuery = await db.oneOrNone(`
        SELECT "memberID" FROM member WHERE username = $1
        `, [fromUsername]);

        if(blockedMemberIDQuery==null)
        {
            res.json({ status: 404, message: 'User does not exist' });
        }
        else
        {
            const blockedMemberID = blockedMemberIDQuery.memberID; // An array of rows is returned, which each row being an object with a memberID property. The first row is the only row, so we can access it with [0], and then access the memberID property with .memberID
            
           
            await db.tx(async t => {
                 // Remove any requests between the two users
                await t.none(`
                DELETE FROM request WHERE ("toMemberID" = $1 AND "fromMemberID" = $2) OR ("toMemberID" = $2 AND "fromMemberID" = $1)
                `, [blockerMemberID, blockedMemberID]);

                // Next, remove any chats between the two users
                await t.none(`
                DELETE FROM chat WHERE ("memberID1" = $1 AND "memberID2" = $2) OR ("memberID1" = $2 AND "memberID2" = $1)
                `, [blockerMemberID, blockedMemberID]);

                // Finally, insert the two memberIDs into the block table
                await t.none(`
                INSERT INTO block("blockerMemberID", "blockedMemberID") VALUES ($1, $2)
                `, [blockerMemberID, blockedMemberID]);

            });

            res.json({ status: 201, message: 'Blocked user successfully' });

            
        }
        
    } 
    catch(error)
    {
        res.json({ status: 500, message: 'Failed to block user' });
    }
});

module.exports = router;