const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");
const cryptojs = require("crypto-js");
const HmacSHA256 = cryptojs.HmacSHA256;
const DOMPurify = require("isomorphic-dompurify");

router.post("/api", async (req, res) => {
	console.log(req.body);

	const { name, username, email, password, isorganization } = req.body;
	try {
		// CHECK IF INPUTS ARE EMPTY. IF SO, THROW ERROR.
		if (name == "" || email == "" || username == "" || password == "") {
			return res.json({
				data: null,
				status: 400,
				message:
					"Missing Fields. Please ensure all fields are filled out.",
				pgErrorObject: null,
			});
		}

		// SANITIZE INPUTS. IF OUTPUT IS EMPTY, THROW ERROR
		const sanitizationConfig = { ALLOWED_TAGS: [], KEEP_CONTENT: false };
		const pureName = DOMPurify.sanitize(name, sanitizationConfig);
		const pureUsername = DOMPurify.sanitize(username, sanitizationConfig);
		const pureEmail = DOMPurify.sanitize(email, sanitizationConfig);
		
		if(pureName === ""){
			return res.json({
				data: null,
				status: 400,
				message:
					"Please enter a valid Name.",
				pgErrorObject: null,
			});
	
		}

		if(pureUsername === ""){
			return res.json({
				data: null,
				status: 400,
				message:
					"Please enter a valid Username.",
				pgErrorObject: null,
			});

		}

		if(pureEmail === ""){
			return res.json({
				data: null,
				status: 400,
				message:
					"Please enter a valid Email.",
				pgErrorObject: null,
			});

		}

		await db.none(
			'INSERT INTO member("name", "username", "email", "password", "isOrg") VALUES($1, $2, $3, $4, $5)',
			[
				name,
				username,
				email,
				HmacSHA256(
					password,
					"230e6fc32123b6164d3aaf26271bb1843c67193132c78137135d0d8f2160d1d3"
				).toString(),
				isorganization,
			]
		);
		let memberData = await db.one(
			'SELECT "memberID" FROM member WHERE "username" = $1',
			[username]
		);
		console.log("[SUCCESS]: SIGN-UP SUCCESSFUL");
		console.log("[RESPONSE DATA]\n" + memberData);

		req.session.signUpMemberID = memberData.memberID; // Store memberID in session data
		req.session.save(); // Save session data

		res.json({
			data: { id: memberData.memberID },
			status: 201,
			message: "User SignUp Successful",
			pgErrorObject: null,
		});
	} catch (error) {
		console.log("[ERROR NAME]:\n" + error.name);
		console.log(
			"[LOG RESPONSE]:\n" +
				JSON.stringify({
					data: null,
					status: 500,
					message: "User SignUp Failed",
					pgErrorObject: {
						...error,
					},
				})
		);
		res.json({
			data: null,
			status: 500,
			message: "User SignUp Failed",
			pgErrorObject: {
				...error,
			},
		});
	}
});

module.exports = router;
