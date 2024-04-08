const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");

router.get("/api", async (req, res) => {
	console.log("body: " + req.body);
	const memberID = req.session.loggedInUserMemberID;
	try {

		const userInfo = await db.oneOrNone(`
        SELECT member."username" AS "username", profile."name" AS "name"
        FROM member
        INNER JOIN profile ON member."memberID" = profile."memberID"
        WHERE member."memberID" = $1
        `, [memberID]);


        if (userInfo.length == 0) 
            return res.json({ status: 404, message: 'User does not exist' });
            
        return res.json({ status: 200, message: 'Fetched user successfully', data: userInfo });
        

    
} catch (error) {
    console.log("[ERROR NAME]:\n" + error.name);
    console.log(
      "[LOG RESPONSE]:\n" +
        JSON.stringify({
          data: null,
          status: 500,
          message: "Fetch User Info Failed",
          pgErrorObject: {
            ...error,
          },
        })
    );
    res.json({
      data: null,
      status: 500,
      message: "Fetch User Info Failed",
      pgErrorObject: {
        ...error,
      },
    });
  }


});

module.exports = router;
