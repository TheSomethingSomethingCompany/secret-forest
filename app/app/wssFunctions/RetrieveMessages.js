const db = require("../db-connection.js")
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner");

const dotenv = require("dotenv");
dotenv.config();

const bucketName = process.env.OUTPUT_BUCKET_NAME
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
            const chatMessagesAndFileNames = await db.any(`
            SELECT message."chatID", message."messageID", message."message", profile."name", file."fileName", CASE WHEN message."senderID" = $2 THEN true ELSE false END AS "isYou" 
            FROM member 
            JOIN message on member."memberID" = message."senderID" 
            JOIN profile on message."senderID" = profile."memberID"
            LEFT JOIN file on message."messageID" = file."messageID"
            WHERE "chatID" = $1
                `, [chatID, memberID]);
            
            //console.log(chatMessagesAndFileNames);

            if (chatMessagesAndFileNames.length === 0)
            {
                res.json({ status: 404, message: 'No messages found', action: 'retrieveMessages'});
                return;
            }
            else 
            {
                // 1) Iterate through the chatMessagesAndFileNames array
                // 2) For each element, check if the fileName is null or not
                // 3) If it is null, then move on to the next element, and delete the fileName property from the object
                // 4) If it is not null, then do the following
                    // - Use the fileName to get a signed URL from S3
                    // Create a new property in the object called signedURL, and assign the signed URL to it
                    // Create a new property in the object called fileExtension, and assign the file extension to it
                    // - Delete the fileName property from the object
                // 5) Return the chatMessagesAndFileNames array to the client

                for (let i = 0; i < chatMessagesAndFileNames.length; i++)
                {
                    if(chatMessagesAndFileNames[i].fileName != null)
                    {
                        
                        const params = {
                            Bucket: bucketName, //upload will happen to this s3 bucket
                            Key: chatMessagesAndFileNames[i].fileName, //name of the file on s3
                        }

                        const command = new GetObjectCommand(params);
                        const seconds = 3600

                        try
                        {
                            const url = await getSignedUrl(s3Object, command, { expiresIn: seconds });
                            chatMessagesAndFileNames[i].signedURL = url; // Add the signed URL to the object
                            chatMessagesAndFileNames[i].fileExtension = chatMessagesAndFileNames[i].fileName.split('.').pop(); // Add the file extension to the object

                        }
                        catch(error) 
                        {
                            console.error("Error getting file from S3:", error);
                            res.status(500).json({status: 500, message: "Failed to get file from S3.", error: error, action: 'retrieveMessages'});
                        }
                        
                    }

                    delete chatMessagesAndFileNames[i].fileName; // Delete the fileName property from the object
                }
                const chatMessages = chatMessagesAndFileNames;
                console.log(chatMessages);
                res.json({ status: 200, message: 'Retrieved messages', chatMessages: chatMessages, action: 'retrieveMessages' });
            }
        }

    } 
    catch(error)
    {
        console.log("Error retrieving messages:", error);
        res.json({ status: 500, message: 'Failed to retrieve messages' , action: 'retrieveMessages'});
    }

};

module.exports = handleRetrievingMessages
