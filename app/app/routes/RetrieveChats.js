const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");

router.get("/api", async (req, res) => {
  const memberID = req.session.loggedInUserMemberID;
  const searchQ = req.query.searchQ;
  try {
    console.log(
      "REQUEST FOR RETRIEVE CHATS WITH MEMBERID: " +
        memberID +
        " AND SEARCHQ: " +
        searchQ
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
        WHERE chats."name" ILIKE $2 OR member."username" ILIKE $2
            `,
      [memberID, searchQ + "%"]
    );


        const loggedInUsernameQuery = await db.oneOrNone (`
        SELECT username
        FROM member
        WHERE "memberID" = $1`,
      [memberID]
    );

    if (loggedInUsernameQuery == null) {
      return res.json({ status: 404, message: "User does not exist. may need to reauthenticate" });
      
    }

        console.log("CHATS WITH USERS: " + JSON.stringify(chatsWithUsers));
        if(chatsWithUsers.length == 0)
            return res.json({ status: 404, message: 'No chats found' });
        
        const loggedInUsername = loggedInUsernameQuery.username;

        chatsWithUsers.forEach(chat => {
            chat.loggedInUsername = loggedInUsername;
        });
        
        return res.json({ status: 200, message: 'Retrieved chats successfully', data: chatsWithUsers });
    

    } 
    catch(error)
    {
        console.log("[ERROR OBJECT]:\n" + JSON.stringify({...error}));
        res.json({ status: 500, message: 'Failed to retrieve chats' });
    }

});

module.exports = router;
