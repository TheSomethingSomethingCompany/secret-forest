const express = require("express");
const router = express.Router();
const db = require("../db-connection.js")

router.post('/api', async (req, res) => {
    
    try
    {
        
        // Since we are not using sessions, we will hardcode the memberID for now
        const memberID1 = '777878f5-1ee2-4731-92f9-ecfe983e95bb'; // One of the members of chat must clearly be the logged in user, which is hardcoded for now.
        const memberID2 = req.body.memberID2;

        // Check if chat already exists
        const chatExists = await db.any(`
        SELECT * FROM chat WHERE ("memberID1" = $1 AND "memberID2" = $2) OR ("memberID1" = $2 AND "memberID2" = $1)
        `, [memberID1, memberID2]);

        if(chatExists.length > 0)
        {
            res.json({ status: 409, message: 'Chat already exists' });
        }

        else
        {
            await db.none(`
            INSERT INTO chat ("memberID1", "memberID2") VALUES ($1, $2)
            `, [memberID1, memberID2]);
            res.json({ status: 201, message: 'Created chat successfully' });
        }
        
        
    } 
    catch(error)
    {
        res.json({ status: 500, message: 'Failed to create chat'});
    }
});

module.exports = router;