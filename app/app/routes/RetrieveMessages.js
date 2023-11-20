const express = require("express");
const router = express.Router();
const db = require("../db-connection.js")

router.post('/api', async (req, res) => {
    const chatID = req.chatID;
    
    try
    {

        
        //Since we still need to implement sessions, we will use a dummy memberID for now.
        const memberID = '777878f5-1ee2-4731-92f9-ecfe983e95bb';
        const chatID = req.body.chatID;

        
        //First, we must confirm if the current logged on user is a member of the chat, in order to prevent unauthorized access of chat messages by other users not in the chat.
        const isMember = await db.any(`
        SELECT * from chat WHERE "chatID" = $1 AND ("memberID1" = $2 OR "memberID2" = $2)
            `, [chatID, memberID]);


        if(isMember.length === 0)
        {
            res.json({ status: 401, message: 'Unauthorized access' });
        }

        else
        {
            const chatMessages = await db.any(`
            SELECT * from message WHERE "chatID" = $1
                `, [chatID]);
            
            console.log(chatMessages);

            if (chatMessages.length === 0)
            {
                res.json({ status: 422, message: 'No messages found' });
                return;
            }
            else res.json({ status: 201, message: 'Retrieved messages', data: chatMessages });
        }

    } 
    catch(error)
    {
        res.json({ status: 500, message: 'Failed to retrieve messages' });
    }

});

module.exports = router;
