const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");
const cryptojs = require("crypto-js");
const HmacSHA256 = cryptojs.HmacSHA256;

router.post("/api", async (req, res) => {
  console.log(req.body);

  const { username } = req.body;
  try {
    console.log("[DELETE]: IN TRY");
    // if (username == "") {
    //   console.log("[ERROR]: EMPTY FIELDS");
    //   return res.json({
    //     data: null,
    //     status: 400,
    //     message: "Missing Fields. Please ensure all fields are filled out.",
    //     pgErrorObject: null,
    //   });
    // }
    await db.none("DELETE FROM member WHERE username = $1", [username]);

    console.log("[SUCCESS]: DELETE SUCCESSFUL");

    res.json({
      data: null,
      status: 202,
      message: "User Delete Successful",
      pgErrorObject: null,
    });
  } catch (error) {
    console.log("[ERROR NAME]:\n" + error.name);
    console.log(
      "[LOG RESPONSE]:\n" +
        JSON.stringify({
          data: null,
          status: 500,
          message: "User Delete Failed",
          pgErrorObject: {
            ...error,
          },
        })
    );
    res.json({
      data: null,
      status: 500,
      message: "User Delete Failed",
      pgErrorObject: {
        ...error,
      },
    });
  }
});

module.exports = router;
