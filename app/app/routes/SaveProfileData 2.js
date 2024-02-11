const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");

router.post("/api", async (req, res) => {
  

  const {fullName, country, address, bio, username, email, id} = req.body;
  try {
    const updateProfileInfo = await db.none(
      `UPDATE profile SET "name" = $1, "country" = $2, "address" = $3, "bio" = $4 WHERE "memberID" = $5`, 
      [fullName, country, address, bio, id]
    );
    const updateMemberInfo = await db.none(
        `UPDATE member SET "email" = $1, "username" = $2 WHERE "memberID" = $3`, [email, username, id]
    );

    console.log("[SUCCESS]: USER INFO UPDATED");

    res.json({
      data: { ...updateProfileInfo, ...updateMemberInfo }, 
      status: 202,
      message: "User Info Successfully Updated",
      pgErrorObject: null,
    });
  } catch (error) {
    console.log("[ERROR NAME]:\n" + error.name);
    console.log(
      "[LOG RESPONSE]:\n" +
        JSON.stringify({
          data: null,
          status: 500,
          message: "User Info Update Failed",
          pgErrorObject: {
            ...error,
          },
        })
    );
    res.json({
      data: null,
      status: 500,
      message: "User Update Failed",
      pgErrorObject: {
        ...error,
      },
    });
  }
});

module.exports = router;