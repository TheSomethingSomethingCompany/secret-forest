const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");

router.get("/api", async (req, res) => {
    console.log("body: " + req.body);
    const memberID = req.session.loggedInUserMemberID;
    try {

        const userInfo = await db.one(`
        SELECT member."username" AS "username", profile."name" AS "name"
        FROM member
        INNER JOIN profile ON member."memberID" = profile."memberID"
        WHERE member."memberID" = $1
        `, [memberID]);

        if (userInfo.length == 0) {
            res.json({ status: 422, message: 'Cannot find user' });
            return;
        } else {
            res.json({ status: 201, message: 'Fetch user successfully', data: userInfo });
        }

    
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