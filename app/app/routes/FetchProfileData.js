const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");

router.post("/api", async (req, res) => {
  console.log(req.body);

  const { id } = req.body;
  try {
    console.log("[FETCH PROFILE]: IN TRY");
    if (id == "") {
      console.log("[ERROR]: EMPTY FIELDS");
      return res.json({
        data: null,
        status: 400,
        message: "Missing Parameters.",
        pgErrorObject: null,
      });
    }
    const profile = await db.one(
      `SELECT "name", "country", "address", "bio" FROM profile WHERE "memberID" = $1`,
      [id]
    );

    // if (user.length != 1) {
    //   console.log("[ERROR]: USER NOT FOUND");
    //   return res.json({
    //     data: null,
    //     status: 404,
    //     message: "User Not Found",
    //     pgErrorObject: null,
    //   });
    // }

    console.log("[SUCCESS]: PROFILE FETCHED SUCCESSFUL");

    res.json({
      data: { ...profile },
      status: 202,
      message: "Profile Fetch Successful",
      pgErrorObject: null,
    });
  } catch (error) {
    console.log("[ERROR NAME]:\n" + error.name);
    console.log(
      "[LOG RESPONSE]:\n" +
        JSON.stringify({
          data: null,
          status: 500,
          message: "Profile Fetch Failed",
          pgErrorObject: {
            ...error,
          },
        })
    );
    res.json({
      data: null,
      status: 500,
      message: "Profile Fetch Failed",
      pgErrorObject: {
        ...error,
      },
    });
  }
});

module.exports = router;
