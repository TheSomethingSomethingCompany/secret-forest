const express = require("express");
const router = express.Router();
const db = require("../../db-connection.js")

router.get('/api', async (req, res) => {
    
    try
    {
        
        // Since we are not using sessions, we will hardcode the memberID for now
        const memberID = req.session.loggedInUserMemberID; // One of the members of chat must clearly be the logged in user
        // First, we need to check if the user exists, and if they do, use their memberID

        // Retrieve the requests sent by the logged in user by username
        const requests = await db.any(`
        SELECT member."username", profile."name", profile."country"
        FROM request 
        JOIN member ON request."toMemberID" = member."memberID"
        JOIN profile ON member."memberID" = profile."memberID"
        WHERE "fromMemberID" = $1
        `, [memberID]);
        res.json({ status: 200, message: 'Retrieved requests sent successfully', data: requests});

    }
        
    catch(error)
    {
        res.json({ status: 500, message: 'Failed to retrieve sent requests'});
    }
});

module.exports = router;