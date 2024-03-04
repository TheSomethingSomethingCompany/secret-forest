const db = require("../db-connection.js")
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner")

const dotenv = require("dotenv");
dotenv.config();

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY
const sessionToken = process.env.SESSION_TOKEN

const s3Object = new S3Client({ //creates a s3 object given the environment variables
    credentials:{
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
        sessionToken: sessionToken,
    },
    region: bucketRegion
});

async function handleRetrievingMessages(req, res){
    
    try
    {
        
        //Since we still need to implement sessions, we will use a dummy memberID for now.
        
        const memberID = req.session.loggedInUserMemberID;
        const chatID = req.body.chatID;
        console.log("REQUEST FOR RETRIEVE MESSAGES WITH CHATID: " + chatID + " AND MEMBERID: " + memberID + "");

        
        //First, we must confirm if the current logged on user is a member of the chat, in order to prevent unauthorized access of chat messages by other users not in the chat.
        const isMember = await db.any(`
        SELECT * from chat WHERE "chatID" = $1 AND ("memberID1" = $2 OR "memberID2" = $2)
            `, [chatID, memberID]);


        if(isMember.length === 0)
        {
            res.json({ status: 401, message: 'Unauthorized access', action: 'retrieveMessages' });
        }

        else
        {
            const chatMessages = await db.any(`
            SELECT "chatID", "messageID", "message", "name", CASE WHEN message."senderID" = $2 THEN true ELSE false END AS "isYou" 
            FROM member 
            JOIN message on member."memberID" = message."senderID" 
            JOIN profile on message."senderID" = profile."memberID"
            WHERE "chatID" = $1
                `, [chatID, memberID]);
            
            console.log(chatMessages);

            if (chatMessages.length === 0)
            {
                res.json({ status: 422, message: 'No messages found', action: 'retrieveMessages'});
                return;
            }
            else 
            {

                try // For each message, if the message has a .extension, then we need to get the signed URL for the image.
                {
                    for (let i = 0; i < chatMessages.length; i++)
                    {
                        const message = chatMessages[i];
                        const messageID = message.messageID;
                        const hasExtension = await db.any(`
                        SELECT * FROM message WHERE "messageID" = $1 AND "extension" IS NOT NULL
                            `, [messageID]);
                        
                        if(hasExtension.length > 0)
                        {
                            const filename = messageID + "." + message.extension;
                            const params = {
                                Bucket: bucketName, //upload will happen to this s3 bucket
                                Key: filename, //name of the file that is on the user's computer
                            }
                            const command = new GetObjectCommand(params);
                            const seconds = 3600
                            const url = await getSignedUrl(s3Object, command, { expiresIn: seconds });
                            chatMessages[i].url = url;
                        }
                    }
                    
                }


                res.json({ status: 201, message: 'Retrieved messages', chatMessages: chatMessages, action: 'retrieveMessages' });
            }
        }

    } 
    catch(error)
    {
        res.json({ status: 500, message: 'Failed to retrieve messages' , action: 'retrieveMessages'});
    }

};

module.exports = handleRetrievingMessages
