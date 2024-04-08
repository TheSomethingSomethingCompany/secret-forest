const express = require("express");
const router = express.Router();
const db = require("../../db-connection.js")

router.post('/api', async (req, res) => {
    
    try
    {
        const blockerMemberID = req.session.loggedInUserMemberID; // The logged in user is the one that is trying to block the request, so we will use their memberID
        const blockedUsername = req.body.username; // The username from the request body is the user that the logged in user is trying to block
        console.log("blockedUsername: ", blockedUsername);
        // First, we need to check if the user exists, and if they do, use their memberID
        const blockedMemberIDQuery = await db.oneOrNone(`
        SELECT "memberID" FROM member WHERE "username" = $1
        `, [blockedUsername]);

        if(blockedMemberIDQuery==null)
           return res.json({ status: 404, message: 'User does not exist' });
        
    
        const blockedMemberID = blockedMemberIDQuery.memberID; 

        // Check if the two users have already blocked each other
        const blockExists = await db.oneOrNone(`
        SELECT * FROM blocked_user WHERE ("blockerMemberID" = $1 AND "blockedMemberID" = $2) OR ("blockerMemberID" = $2 AND "blockedMemberID" = $1)
        `, [blockerMemberID, blockedMemberID]);

        if(blockExists == null)
            return res.json({ status: 409, message: 'No block exists' });
        
        // Remove the block between the users to unblock them
        await db.none(`
        DELETE FROM blocked_user WHERE ("blockerMemberID" = $1 AND "blockedMemberID" = $2) OR ("blockerMemberID" = $2 AND "blockedMemberID" = $1)
        `, [blockerMemberID, blockedMemberID]);


        return res.json({ status: 201, message: 'Unblocked user successfully' });

            
        
        
    } 
    catch(error)
    {
        res.json({ status: 500, message: 'Failed to unblock user' });
    }
});

module.exports = router;