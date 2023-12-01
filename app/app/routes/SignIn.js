const express = require("express");
const router = express.Router();

const db = require("../db-connection.js");
const cryptojs = require("crypto-js");
const HmacSHA256 = cryptojs.HmacSHA256;

router.post("/api", async (req, res) => {
  console.log(req.body);

  const { identifier, password, isEmail } = req.body;
  try {
    console.log("[SIGN-IN]: IN TRY");
    if (identifier == "" || password == "") {
      console.log("[SIGN-IN]: EMPTY FIELDS");
      return res.json({
        status: 422,
        message: "Please fill all required fields",
      });
    }
    let member = await db.one(
      isEmail
        ? 'SELECT "memberID" FROM member WHERE "email" = $1 AND "password" = $2'
        : 'SELECT "memberID" FROM member WHERE "username" = $1 AND "password" = $2',
      [
        identifier,
        HmacSHA256(
          password,
          "230e6fc32123b6164d3aaf26271bb1843c67193132c78137135d0d8f2160d1d3"
        ).toString(),
      ]
    );
    console.log("SUCCESS 201");
    console.log(member);
    res.json({
      data: { id: member.memberID },
      status: 201,
      message: "User SignIn Successful",
      pgErrorObject: null,
    });
  } catch (error) {
    console.log(typeof error.received);
    if (error.name === "QueryResultError") {
      console.log("[SIGN-IN]: INVALID CREDENTIALS");
      console.log({
        data: null,
        status: 404,
        message: "Invalid Credentials",
        pgErrorObject: {
          ...error,
        },
      });
      return res.json({
        data: null,
        status: 404,
        message: "Invalid Credentials",
        pgErrorObject: {
          ...error,
        },
      });
    }
    console.log("[SIGN-IN]: SERVER ERROR");
    res.json({
      data: null,
      status: 500,
      message: "User SignIn Failed",
      pgErrorObject: {
        ...error,
      },
    });
  }
});

module.exports = router;
