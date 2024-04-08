const db = require("../db-connection.js")

async function handleDeletingMessage (req, res) {
    
    try
    {
        // Must confirm that the logged in user is a member of the chat
        // Since we are not using sessions, we will hardcode the memberID for now
        
        const memberID = req.session.loggedInUserMemberID;
        const messageID = req.body.messageID;
        console.log("REQUEST FOR DELETE MESSAGE WITH MESSAGEID: " + messageID + " AND MEMBERID: " + memberID + "");
        
        //First, we need to get the chatID of the message being deleted
        const isMessage = await db.any(`
        SELECT "chatID" FROM message WHERE "messageID" = $1
        `, [messageID]);
        
        if(isMessage.length == 0) //If the message does not exist, then we cannot delete it
        {
            res.json({status: 404, message: 'Message does not exist', action: 'deleteMessage'});
        }
        else
        {

            // Must confirm that the logged in user is a member of the chat
            const chatID = isMessage[0].chatID; // An array of rows is returned, which each row being an object with a chatID property. The first row is the only row, so we can access it with [0], and then access the chatID property with .chatID
            const isMember = await db.any(`
            SELECT * FROM chat WHERE "chatID" = $1 AND ("memberID1" = $2 OR "memberID2" = $2)
            `, [chatID, memberID]);
            

            //Must confirm that the sender is the one deleting the message
            const isSender = await db.any(`
            SELECT * FROM message WHERE "messageID" = $1 AND "senderID" = $2
            `, [messageID, memberID]);


            if(isMember.length == 0 || isSender.length == 0)
            {
                res.json({status: 401, message: 'Unauthorized access'});
            }

            else if(isSender.length == 0)
            {
                res.json({status: 403, message: 'Forbidden access'});
            }

            else
            {
                await db.none(`
                DELETE FROM message WHERE "messageID" = $1
                `, [messageID]);
                res.json({ status: 201, message: 'Message deleted successfully', action: 'deleteMessage' });
            }
        }
        
    } 
    catch(error)
    {
        res.json({ status: 500, message: 'Failed to delete message', action: 'deleteMessage' });
    }
};

module.exports = handleDeletingMessage;