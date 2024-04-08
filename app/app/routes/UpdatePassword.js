const express = require("express");
const router = express.Router();

const db = require("../db-connection.js");
const cryptojs = require("crypto-js");
const HmacSHA256 = cryptojs.HmacSHA256;

const DOMPurify = require("isomorphic-dompurify");

router.post("/api", async (req, res) => {
	console.log(req.body);

	const { username, password} = req.body;
	try {
		// CHECK IF INPUTS ARE EMPTY. IF SO, THROW ERROR.
		if (username === "" || password === "") {
			return res.json({
				data: null,
				status: 400,
				message:
					"Unable to get information.",
				pgErrorObject: null,
			});

		}

		const sanitizationConfig = { ALLOWED_TAGS: [], KEEP_CONTENT: false };
		const purePassword = DOMPurify.sanitize(password, sanitizationConfig);

		if (purePassword === "") {
			return res.json({
				data: null,
				status: 422,
				message: "Your input for 'Password' could not be processed due to security concerns. Please simplify your entries and resubmit.",
				pgErrorObject: null,
			});
		}



        await db.none(
            `UPDATE member SET "password"= $1 WHERE "username" = $2`, 
            [				
                HmacSHA256(
                purePassword,
                "230e6fc32123b6164d3aaf26271bb1843c67193132c78137135d0d8f2160d1d3"
            ).toString(),
            username]
        );
       
        console.log("[SUCCESS]: USER INFO UPDATED");
        res.json({
            status: 201,
            message: "User info successfully updated",
            pgErrorObject: null,
            });
    

    
    } catch (error) {
        console.log("[ERROR NAME]:\n" + error.name);
        console.log(
          "[LOG RESPONSE]:\n" +
            JSON.stringify({
              data: null,
              status: 500,
              message: "User updated failed",
              pgErrorObject: {
                ...error,
              },
            })
        );
        res.json({
          data: null,
          status: 500,
          message: "User updated",
          pgErrorObject: {
            ...error,
          },
        });
      }
    
    
    });
    
    module.exports = router;
