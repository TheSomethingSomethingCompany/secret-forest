const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");
const e = require("express");

router.post("/api", async (req, res) => {
	const memberID = req.session.signUpMemberID; // RETRIEVE SESSION DATA IS USER IS LOGGED IN 
	console.log("[MEMBER ID IN CREATE PROFILE]: " + memberID);
	// IF NULL, THEN USER IS NOT SIGNED IN.
	if (memberID == null) {
		res.json({ status: 401, message: "Unauthorized access" });
	} else {
		console.log("[MEMBER ID]: " + memberID);
		console.log("[CONFIRMATION THAT USER IS LOGGED IN]:");
		res.json(
			{
				status: 201,
				message: "User Signed in.",
				data: memberID
			}
		)
	}
});

module.exports = router; // Export the router, as this is necessary as the second argument of server.use(). Remember, the first argument is always the path, and the second argument is the router object. The router object will then specify an endpoint, and the endpoint will specify a callback function.
