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

    const user = await db.one(
      `SELECT "memberID", "email", "name", "username" FROM member WHERE "username" = $1`,
      [slug]
    );

    // DEBUG LINE
    console.log("[FETCHUSERDATA | USER FETCHED]: ", user);

    const memberID1 = req.session.loggedInUserMemberID;
    const checkID = user.memberID;

    console.log("CHECKID: " + checkID + " MEMBERID1: " + memberID1);

    

    if (checkID == memberID1) {
      console.log("[SUCCESS]: USER FETCHED SUCCESSFUL");
      res.json({
        data: { ...user },
        status: 202,
        message: "User Fetch Successful",
        pgErrorObject: null,
      });
    } else if (checkID != memberID1) {
      console.log("[SUCCESS]: USER FETCHED SUCCESSFUL");
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
