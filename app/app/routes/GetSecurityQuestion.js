const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");

router.post("/api", async (req, res) => {
    console.log("body: " + req.body);

    const { identifier, isEmail } = req.body;

    try {

        const sanitizationConfig = { ALLOWED_TAGS: [], KEEP_CONTENT: false };
		const pureIdentifier = DOMPurify.sanitize(identifier, sanitizationConfig);

        if (pureIdentifier === "") {
			return res.json({
				data: null,
				status: 422,
				message: "Your input for 'Username or Email' could not be processed due to security concerns. Please simplify your entries and resubmit.",
				pgErrorObject: null,
			});
		}

    let user = await db.oneOrNone(
			isEmail
				? 'SELECT "memberID", "username" FROM member WHERE "email" = $1'
				: 'SELECT "memberID", "username" FROM member WHERE "username" = $1',
			[pureIdentifier]
		);

    const securityQuestion = await db.oneOrNone(
        `SELECT "question"
         FROM security_question
         WHERE "memberID" = $1`,
         [user.memberID]
    );

    if(securityQuestion == null)
    {
      console.log("[USER NOT FOUND]-> "+ pureIdentifier);
      console.log("[LOG RESPONSE]:\n" + JSON.stringify({
        data: null,
        status: 404,
        message: "User Not Found",
        pgErrorObject: null,
      }));

      return res.json({
        data: null,
        status: 404,
        message: "User Not Found",
        pgErrorObject: null,
      });
    } else {


        console.log("Security Question Fetch : " + securityQuestion.question);
        res.json({
            data: {question: securityQuestion.question, username: user.username},
            status: 201,
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
          message: "Security Question Fetch Failed",
          pgErrorObject: {
            ...error,
          },
        })
    );
    res.json({
      data: null,
      status: 500,
      message: "Security Question Fetch Failed",
      pgErrorObject: {
        ...error,
      },
    });
  }


});

module.exports = router;