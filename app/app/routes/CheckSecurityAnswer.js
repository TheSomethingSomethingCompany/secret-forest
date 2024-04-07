const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");
const cryptojs = require("crypto-js");
const HmacSHA256 = cryptojs.HmacSHA256;
const DOMPurify = require("isomorphic-dompurify");

router.post("/api", async (req, res) => {
    console.log("body: " + req.body);

    const { username, securityAnswer} = req.body;

    try {

        const sanitizationConfig = { ALLOWED_TAGS: [], KEEP_CONTENT: false };
		const pureSecurityAnswer = DOMPurify.sanitize(securityAnswer, sanitizationConfig);

        if (pureSecurityAnswer === "") {
			return res.json({
				data: null,
				status: 422,
				message: "Your input for 'Username or Email' could not be processed due to security concerns. Please simplify your entries and resubmit.",
				pgErrorObject: null,
			});
		};

        

        const memberInfo = await db.oneOrNone(
            `SELECT "memberID"
             FROM member
             WHERE "username" = $1`,
             [username]
        );

        

        if(memberInfo == null)
        {
          console.log("[USER NOT FOUND]-> "+ username);
          console.log("[LOG RESPONSE]:\n" + JSON.stringify({
            data: null,
            status: 404,
            message: "User Not Found",
            pgErrorObject: null,
            }));
            res.json({
                data: null,
                status: 404,
                message: "User Not Found",
                pgErrorObject: null,
            });
        }

        const securityAnswerCheck = await db.oneOrNone(
            `SELECT "answer"
            FROM security_question
            WHERE "memberID" = $1`,
            [memberInfo.memberID]
        );


        if(securityAnswerCheck == null)
        {
            console.log("[SECURITY ANSWER NOT FOUND]");
            console.log("[LOG RESPONSE]:\n" + JSON.stringify({
            data: null,
            status: 404,
            message: "Security answer is not found",
            pgErrorObject: null,
            }));
            res.json({
                data: null,
                status: 404,
                message: "User Not Found",
                pgErrorObject: null,
            });

            return res.json({
            data: null,
            status: 404,
            message: "Security answer is not found",
            pgErrorObject: null,
            });

        } else {
            const check = HmacSHA256(
                pureSecurityAnswer,
                "230e6fc32123b6164d3aaf26271bb1843c67193132c78137135d0d8f2160d1d3"
            ).toString();

            if (check == securityAnswerCheck.answer) {
                console.log("Security Answer Matches");
                res.json({
                    data: null,
                    status: 201,
                    message: "Security answer matches!",
                    pgErrorObject: null,
                    });
            } else {
                console.log("Security Answer Does Not Match");
                res.json({
                    data: null,
                    status: 401,
                    message: "Security answer does not matches!",
                    pgErrorObject: null,
                    });
            }


        }


} catch (error) {
    console.log("[ERROR NAME]:\n" + error.name);
    console.log(
      "[LOG RESPONSE]:\n" +
        JSON.stringify({
          data: null,
          status: 500,
          message: "Security Answer Fetch Failed",
          pgErrorObject: {
            ...error,
          },
        })
    );
    res.json({
      data: null,
      status: 500,
      message: "Security Answer Fetch Failed",
      pgErrorObject: {
        ...error,
      },
    });
  }


});

module.exports = router;