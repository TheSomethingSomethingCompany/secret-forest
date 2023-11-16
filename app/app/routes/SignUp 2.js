const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");
const cryptojs = require("crypto-js");
const HmacSHA256 = cryptojs.HmacSHA256;

router.post("/api", async (req, res) => {
  console.log(req.body);

  const { name, email, username, password, isorganization } = req.body;
  try {
    if (name == "" || email == "" || username == "" || password == "") {
      return res.json({
        status: 422,
        message: "Please enter all required fields",
      });
    }
    let member = await db.none("INSERT INTO member VALUES($1, $2, $3, $4, $5)", [
        name,
        email,
        username,
        HmacSHA256(
          password,
          "230e6fc32123b6164d3aaf26271bb1843c67193132c78137135d0d8f2160d1d3"
        ),
        isorganization
      ]);
    res.json({ data: member, status: 201, message: "User SignUp Successful" });
  } catch (error) {
    res.json({ status: 501, message: "Failed to Add User" });
  }
});

module.exports = router;
