const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");

router.post("/api", async (req, res) => {
  console.log(req.body);
  

  const {fullName, email, username, country, address, bio, id} = req.body;
  try {
    const profileInfo = await db.one(
      `UPDATE PROFILE SET name = $1, country = $2, address = $3, bio = $4 WHERE memberID = $5`, 
      [fullName, country, address, bio, id]
    );
    const memberInfo = await db.one(
        `UPDATE MEMBER SET email = $1, username = $2 WHERE memberID = $3`, [email, username, id]
    )

    console.log("[SUCCESS]: USER FETCHED SUCCESSFUL");

    res.json({
      data: { ...profileInfo },
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