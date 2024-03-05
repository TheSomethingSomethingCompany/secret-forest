const express = require("express");
const router = express.Router();
const db = require("../../db-connection.js")

router.post('/api', async (req, res) => {
    
    try
    {
        
        const toMemberID = req.session.loggedInUserMemberID; // The logged in user is the one that is trying to decline the request, so we will use their memberID
        const fromUsername = req.body.username; // The username from the request body is the user that the logged in user is trying to decline the request from
       
        // First, we need to check if the user exists, and if they do, use their memberID
        const fromUsernameQuery = await db.oneOrNone(`
        SELECT "memberID" FROM member WHERE username = $1
        `, [fromUsername]);

        if(fromUsernameQuery==null)
        {
            res.json({ status: 404, message: 'User does not exist' });
        }
        else
        {
            const fromMemberID = fromUsernameQuery.memberID; 
            
            // Check if request actually exists
            const requestExists = await db.oneOrNone(`
            SELECT * FROM request WHERE ("toMemberID" = $1 AND "fromMemberID" = $2)
            `, [toMemberID, fromMemberID]); // The left side of the OR is if the logged in user has sent a request to the other user, and the right side is if the other user has sent a request to the logged in user

            if(requestExists == null)
            {
                res.json({ status: 409, message: 'Request does not exist' });
            }

            else
            {
                await db.none(`
                DELETE FROM request WHERE ("toMemberID" = $1 AND "fromMemberID" = $2)
                `, [toMemberID, fromMemberID]);
                res.json({ status: 201, message: 'Deleted request successfully'});
            }
        }
        
    } 
    catch(error)
    {
        res.json({ status: 500, message: 'Failed to delete request'});
    }
});

module.exports = router;