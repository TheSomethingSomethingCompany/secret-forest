const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");

router.get("/api", async (req, res) => {
	const memberID = req.session.loggedInUserMemberID;
	try {
		console.log(
			"REQUEST FOR RETRIEVE CHATS WITH MEMBERID: " + memberID + ""
		);
		const chatsWithUsers = await db.any(
			`
        SELECT chats."chatID" as "chatID", member."username" as "username", chats."name" as "name"
        FROM(
            SELECT chatsWithLoggedInUser."chatID" as "chatID", chatsWithLoggedInUser."memberID1" as "memberID", profile."name" as "name" 
            FROM (SELECT * FROM chat where "memberID1" = $1 or "memberID2" = $1) as chatsWithLoggedInUser JOIN profile ON chatsWithLoggedInUser."memberID1" = profile."memberID"
            WHERE chatsWithLoggedInUser."memberID1" != $1
        UNION
            SELECT chatsWithLoggedInUser."chatID" as "chatID", chatsWithLoggedInUser."memberID2" as "memberID", profile."name" as "name"
            FROM (SELECT * from chat where "memberID1" = $1 or "memberID2" = $1) as chatsWithLoggedInUser JOIN profile ON chatsWithLoggedInUser."memberID2" = profile."memberID"
            WHERE chatsWithLoggedInUser."memberID2" != $1
        ) as chats JOIN member USING("memberID")
            `,
			[memberID]
		);

		const urUsername = await db.oneOrNone(
			`
        SELECT username
        FROM member
        WHERE "memberID" = $1`,
			[memberID]
		);

		if (!urUsername) {
			res.json({ status: 404, message: "No Username Retrieved!" });
			return;
		}

		if (chatsWithUsers.length == 0) {
			res.json({ status: 404, message: "No chats found" });
			return;
		} else {
			const loggedInUsername = urUsername.username;

			chatsWithUsers.forEach((chat) => {
				chat.loggedInUsername = loggedInUsername;
			});

			res.json({
				status: 201,
				message: "Retrieved chats successfully",
				data: chatsWithUsers,
			});
		}
	} catch (error) {
		res.json({ status: 500, message: "Failed to retrieve chats" });
	}
});

module.exports = router;
