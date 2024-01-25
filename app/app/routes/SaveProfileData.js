const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");

router.post("/api", async (req, res) => {
  console.log(req.body);

  const { firstName, lastName, email, username, country, bio} = req.body;
  try {
   
    const user = await db.one(
      `UPDATE PROFILE SET username = $1,  "memberID", name, username FROM member WHERE username = $1`,
      [slug]
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

    console.log("[SUCCESS]: USER FETCHED SUCCESSFUL");

    res.json({
      data: { ...user },
      status: 202,
      message: "User Fetch Successful",
      pgErrorObject: null,
    });
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