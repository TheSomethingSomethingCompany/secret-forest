const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");

router.get("/api", async (req, res) => {
	console.log("body: " + req.body);
	const memberID = req.session.loggedInUserMemberID;
	try {

		const userInfo = await db.oneOrNone(`
        SELECT member."username" AS "username", profile."name" AS "name"
        FROM member
        INNER JOIN profile ON member."memberID" = profile."memberID"
        WHERE member."memberID" = $1
        `, [memberID]);

		if (!userInfo) {
			res.json({ data: null, status: 404, message: 'Cannot find user. Failed to retrieve information.', pgErrorObject: null });
			return;
		} else {
			res.json({ data: userInfo, status: 201, message: 'Fetch user successfully', pgErrorObject: null });
		}


	} catch (error) {
		console.log("[ERROR NAME]:\n" + error.name);
		console.log(
			"[LOG RESPONSE]:\n" +
			JSON.stringify({
				data: null,
				status: 500,
				message: "Fetch User Info Failed",
				pgErrorObject: {
					...error,
				},
			})
		);
		res.json({
			data: null,
			status: 500,
			message: "Fetch User Info Failed",
			pgErrorObject: {
				...error,
			},
		});
	}


});

module.exports = router;
