const express = require("express");
const router = express.Router();
const db = require("../../db-connection.js")

router.post('/api', async (req, res) => {
    
    try
    {
        
        const fromMemberID = req.session.loggedInUserMemberID; // The logged in user is the one that is trying to decline the request, so we will use their memberID
        const toUsername = req.body.username; // The username from the request body is the user that the logged in user is trying to decline the request from
       
        // First, we need to check if the user exists, and if they do, use their memberID
        const toUsernameQuery = await db.oneOrNone(`
        SELECT "memberID" FROM member WHERE username = $1
        `, [toUsername]);

        if(toUsernameQuery==null)
            return res.json({ status: 404, message: 'User does not exist' });
        
        const toMemberID = toUsernameQuery.memberID; 
        
        // Check if request actually exists, where the logged in user is the one that sent the request
        const requestExists = await db.oneOrNone(`
        SELECT * FROM request WHERE ("fromMemberID" = $1 AND "toMemberID" = $2)
        `, [fromMemberID, toMemberID]); // The left side of the OR is if the logged in user has sent a request to the other user, and the right side is if the other user has sent a request to the logged in user

        if(requestExists == null)
            return res.json({ status: 404, message: 'Request does not exist' });
        
        await db.none(`
        DELETE FROM request WHERE ("fromMemberID" = $1 AND "toMemberID" = $2)
        `, [fromMemberID, toMemberID]);
       
        return res.json({ status: 201, message: 'Cancelled request successfully'});
        
        
        
    } 
    catch(error)
    {
        res.json({ status: 500, message: 'Failed to cancel request', pgErrorObject: {...error}});
    }
});

module.exports = router;