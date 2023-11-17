const express = require("express");
const router = express.Router();
const db = require("../db-connection.js")

router.get('/api', async (req, res) => {
    const memberID = '777878f5-1ee2-4731-92f9-ecfe983e95bb';
    try
    {
        const chatsWithUsers = await db.any(`
        SELECT "chatID", "memberID1" as "memberID" from (SELECT * from chat where "memberID1" = $1 or "memberID2" = $1) WHERE "memberID1" != $1
        UNION
        SELECT "chatID", "memberID2" as "memberID" from (SELECT * from chat where "memberID2" = $1 or "memberID2" = '777878f5-1ee2-4731-92f9-ecfe983e95bb') WHERE "memberID2" != $1
            `, [memberID]);
        
        console.log(chatsWithUsers);
        res.json({ status: 201, message: 'Retrieved chats successfully', data: chatsWithUsers });
    } 
    catch(error)
    {
        res.json({ status: 500, message: 'Failed to retrieve chats' });
    }
});

module.exports = router;
