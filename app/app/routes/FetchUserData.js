const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");

router.post("/api", async (req, res) => {

  console.log("body: " + req.body);
  
  const { slug } = req.body;
  try {
    console.log("[FETCH USER]: IN TRY");
    if (slug == "") {
      console.log("[ERROR]: EMPTY FIELDS");
      return res.json({
        data: null,
        status: 400,
        message: "Missing Parameters.",
        pgErrorObject: null,
      });
    }

    // DEBUG LINE
    console.log("[FETCHUSERDATA | username]: ", slug);

    // Retrieve the user data, along with memberID. It is only used to check if the user is the logged in user. It will be deleted after the check.
    const user = await db.one(
      `SELECT member."memberID", member."username", member."email", profile."name", profile."country", profile."address", profile."bio", array_agg(tag."tagName") as "tags"
      FROM profile
      JOIN member ON profile."memberID" = member."memberID"
      JOIN user_tag ON profile."memberID" = user_tag."memberID"
      JOIN tag ON user_tag."tagID" = tag."tagID"
      WHERE member."username" = $1
      GROUP BY member."memberID", member."username", member."email", profile."name", profile."country", profile."address", profile."bio"`,
      [slug]
    );


    // DEBUG LINE
    console.log("[FETCHUSERDATA | USER FETCHED]: ", user);

    const memberID1 = req.session.loggedInUserMemberID;
    const checkID = user.memberID;

    console.log("CHECKID: " + checkID + " MEMBERID1: " + memberID1);

    

    if (checkID == memberID1) {
      console.log("[SUCCESS]: USER FETCHED SUCCESSFUL");
      console.log("[USER]: ", user);
      console.log("[MATCH] -> UserID: " + checkID + " Session UserID: " + memberID1);
      res.json({
        data: { ...user },
        status: 202,
        message: "User Fetch Successful",
        pgErrorObject: null,
      });
    } else if (checkID != memberID1) {
      console.log("[SUCCESS]: USER FETCHED SUCCESSFUL");
      console.log("[USER]: ", user);
      console.log("[DOESN'T MATCH] -> UserID: " + checkID + " Session UserID: " + memberID1);
      res.json({
        data: { ...user },
        status: 200,
        message: "User Fetch Successful",
        pgErrorObject: null,
      });
    } 


  } catch (error) {
    console.log("[ERROR NAME]:\n" + error.name);
    console.log(
      "[LOG RESPONSE]:\n" +
        JSON.stringify({
          data: null,
          status: 500,
          message: "User Fetch Failed",
          pgErrorObject: {
            ...error,
          },
        })
    );
    res.json({
      data: null,
      status: 500,
      message: "User Fetch Failed",
      pgErrorObject: {
        ...error,
      },
    });
  }
});

module.exports = router;
