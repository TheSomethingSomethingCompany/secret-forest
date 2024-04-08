const db = require("../db-connection.js")

async function handleEditingMessage(req, res) {
    
    try
    {
        // Must confirm that the logged in user is a member of the chat
        // Since we are not using sessions, we will hardcode the memberID for now
        
        
        const memberID = req.session.loggedInUserMemberID;
        const messageID = req.body.messageID;
        const editedMessage = req.body.message;

        console.log("REQUEST FOR EDIT MESSAGE WITH MESSAGEID: " + messageID + " AND MEMBERID: " + memberID + "" +" AND MESSAGE: " + editedMessage + "");


        // First, we need to get the chatID of the message being edited
        const isMessage = await db.any(`
        SELECT "chatID" FROM message WHERE "messageID" = $1
        `, [messageID]);

        if(isMessage.length == 0) //If the message does not exist, then we cannot edit it
        {
            res.json({status: 404, message: 'Message does not exist', action: 'editMessage'});
        }

        else
        {
            const chatID = isMessage[0].chatID; // An array of rows is returned, which each row being an object with a chatID property. The first row is the only row, so we can access it with [0].
           
            // Must confirm that the logged in user is a member of the chat
            const isMember = await db.any(`
            SELECT * FROM chat WHERE "chatID" = $1 AND ("memberID1" = $2 OR "memberID2" = $2)
            `, [chatID, memberID]); 

        
            //Must confirm that the message being deleted was sent by the logged in user
            const isSender = await db.any(`
            SELECT * FROM message WHERE "messageID" = $1 AND "senderID" = $2
            `, [messageID, memberID]);


            if(isMember.length == 0)
            {
                res.json({ status: 401, message: 'Unauthorized access', action: 'editMessage' });
            }
            else if(isSender.length == 0)
            {
                res.json({ status: 403, message: 'Forbidden access', action: 'editMessage' });
            }

            else
            { 
                console.log("PRE EDIT MESSAGE: " + editedMessage + "");
                await db.none(`
                UPDATE message SET "message" = $1 WHERE "messageID" = $2
                `, [editedMessage, messageID]);
                res.json({ status: 201, message: 'Message edited successfully', action: 'editMessage' });
            }
        }
        
    } 
    catch(error)
    {
        res.json({ status: 500, message: 'Failed to delete message', action: 'editMessage' });
    }
};

module.exports = handleEditingMessage;