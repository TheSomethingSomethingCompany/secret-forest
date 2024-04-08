const express = require("express");
const router = express.Router();
const db = require("../../db-connection.js")

router.get('/api', async (req, res) => {
    const searchQ = req.query.searchQ;
    const searchBy = req.query.searchBy;

    var whereFilter = '';
    switch(searchBy){ 
      case 'name': // Search by name
        whereFilter = ` profile."name"`;
        break;
      case 'email': // Search by email
        whereFilter = ` member."email"`;
        break;
      case 'username': // Search by username
        whereFilter = ` member."username"`;
        break;
    }

    console.log(`[SEARCHQ]: ${searchQ}`);
    console.log(`[SEARCH BY]: ${searchBy}`);
    console.log(`[WHERE FILTER]: ${whereFilter}`);
    console.log("FOR SENT REQUESTS");

    try
    {
        
        // Since we are not using sessions, we will hardcode the memberID for now
        const memberID = req.session.loggedInUserMemberID; // One of the members of chat must clearly be the logged in user
        // First, we need to check if the user exists, and if they do, use their memberID

        // Retrieve the requests sent by the logged in user by username
        const requests = await db.any(`
        SELECT member."username", profile."name", profile."country", member."email"
        FROM request 
        JOIN member ON request."toMemberID" = member."memberID"
        JOIN profile ON request."toMemberID" = profile."memberID"
        WHERE "fromMemberID" = $1 AND ${whereFilter} ILIKE $2
        `, [memberID, `${searchQ}%`]);
        return res.json({ status: 200, message: 'Retrieved requests sent successfully', data: requests});

    }
        
    catch(error)
    {
        res.json({ status: 500, message: 'Failed to retrieve sent requests', error: error.message});
    }
});

module.exports = router;