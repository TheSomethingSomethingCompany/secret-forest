const express = require("express");
const router = express.Router();
const db = require("../../db-connection.js")

router.get('/api', async (req, res) => {
    
    const searchQ = req.query.searchQ;
    const searchBy = parseInt(req.query.searchBy);

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

    try
    {
        
        const memberID = req.session.loggedInUserMemberID;

        // Retrieve the requests of the logged in user by username
        const requests = await db.any(`
        SELECT member."username", profile."name", profile."country", member."email" 
        FROM blocked_user 
        JOIN member ON blocked_user."blockedMemberID" = member."memberID"
        JOIN profile ON blocked_user."blockedMemberID" = profile."memberID"
        WHERE "blockerMemberID" = $1 AND ${whereFilter} ILIKE $2
        `, [memberID, `${searchQ}%`]);
        
        return res.json({ status: 200, message: 'Retrieved blocked users successfully', data: requests});

    }
        
    catch(error)
    {
        res.json({ status: 500, message: 'Failed to retrieve blocked users', pgErrorObject: {...error}});
    }
});



module.exports = router;