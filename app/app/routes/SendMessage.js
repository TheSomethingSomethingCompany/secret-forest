const express = require("express");
const router = express.Router();
const db = require("../db-connection.js")

router.post('/api', async (req, res) => {
    const chatID = req.chatID;
    
    try
    {

        //Since we still need to implement sessions, we will use a dummy memberID for now.
        console.log(req.body);
        const memberID = '777878f5-1ee2-4731-92f9-ecfe983e95bb'; //dummy memberID, will be replaced with session memberID later.
        const chatID = req.body.chatID;
        const message = req.body.message;


        // First, we must ensure that the user is a member of the chat, in order to prevent unauthorized insertion of chat messages by other users not in the chat.
        const isMember = await db.any(`
        SELECT * from chat WHERE "chatID" = $1 AND ("memberID1" = $2 OR "memberID2" = $2)
            `, [chatID, memberID]);

        if(isMember.length === 0)
        {
            res.json({ status: 401, message: 'Unauthorized access' });
        }

        else
        {
            await db.none(`
            INSERT into message ("chatID", "senderID", "message") VALUES ($1, $2, $3)
                `, [chatID, memberID, message]);    
            res.json({ status: 201, message: 'Successfully inserted message'});
        }

    } 
    catch(error)
    {
        res.json({ status: 500, message: 'Failed to insert message' });
    }

});

module.exports = router;