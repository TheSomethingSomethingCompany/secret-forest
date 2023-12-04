const db = require("../db-connection.js")

async function handleInsertingMessage (req, res){
    const chatID = req.chatID;
    
    try
    {
        //Since we still need to implement sessions, we will use a dummy memberID for now.
        console.log(req.body);
        const memberID = req.session.loggedInUserMemberID; //dummy memberID, will be replaced with session memberID later.
        const chatID = req.body.chatID;
        const message = req.body.message;
        console.log("REQUEST FOR INSERT MESSAGE WITH CHATID: " + chatID + "" + " AND MESSAGE: " + message + "" + " AND MEMBERID: " + memberID + "");

        // First, we must ensure that the user is a member of the chat, in order to prevent unauthorized insertion of chat messages by other users not in the chat.
        const isMember = await db.any(`
        SELECT * from chat WHERE "chatID" = $1 AND ("memberID1" = $2 OR "memberID2" = $2)
            `, [chatID, memberID]);

        if(isMember.length === 0)
        {
            res.json({ status: 401, message: 'Unauthorized access', action: 'insertMessage' });
        }

        else
        {
            await db.none(`
            INSERT into message ("chatID", "senderID", "message") VALUES ($1, $2, $3)
                `, [chatID, memberID, message]);    
            res.json({ status: 201, message: 'Successfully inserted message', action: 'insertMessage'});
        }

    } 
    catch(error)
    {
        res.json({ status: 500, message: 'Failed to insert message',  action: 'insertMessage'});
    }

}

module.exports = handleInsertingMessage;