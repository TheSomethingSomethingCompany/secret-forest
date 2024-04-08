const db = require("../db-connection.js")
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
// const S3Client = require("@aws-sdk/client-s3");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
dotenv.config();



// get the environment variables from the .env file
const outputBucketName = process.env.OUTPUT_BUCKET_NAME;
const inputBucketName = process.env.INPUT_BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION // Region is the same for both input and output buckets
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const sessionToken = process.env.SESSION_TOKEN;

const s3Object = new S3Client({ //creates a s3 object given the environment variables
	credentials: {
		accessKeyId: accessKey,
		secretAccessKey: secretAccessKey,
		sessionToken: sessionToken,
	},
	region: bucketRegion
});

async function handleInsertingMessage(req, res) {
	try {
		console.log(req.body);
		const memberID = req.session.loggedInUserMemberID;
		const chatID = req.body.chatID;
		let message = req.body.message;
		let file = req.body.file;
		let shouldBlur = req.body.shouldBlur;
		console.log("REQUEST FOR INSERT MESSAGE WITH CHATID: " + chatID + "" + " AND MESSAGE: " + message + "" + " AND MEMBERID: " + memberID + "");

		// First, we must ensure that the user is a member of the chat, in order to prevent unauthorized insertion of chat messages by other users not in the chat.
		const isMember = await db.any(`
        SELECT * from chat WHERE "chatID" = $1 AND ("memberID1" = $2 OR "memberID2" = $2)
            `, [chatID, memberID]);

		if (isMember.length === 0) {
			return res.json({ status: 401, message: 'Unauthorized access', action: 'insertMessage' });
		}




			// Insert the message into the database, and return the messageID of the inserted message.
			const messageRes = await db.oneOrNone(`
            INSERT into message ("chatID", "senderID", "message") 
            VALUES ($1, $2, $3)
            RETURNING "messageID"
                `, [chatID, memberID, message]);
			const messageID = messageRes.messageID;

			if (!messageRes) 
      {
				res.json({ status: 404, message: 'Message ID was not returned.', action: 'insertMessage' });
				return;
			}
      
       if(file)
        {
            console.log('[UPLOADED FILE]');
            const uniqueFilename = `${uuidv4()}_${file.originalName}`; //creates a unique filename for the image
            const mimeType = file.mimetype;
            const base64File = file.fileData;
            const base64Data = base64File.replace(/^data:\w+\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const params = {
                Bucket: shouldBlur ? inputBucketName: outputBucketName, //upload will happen to this s3 bucket
                Key: uniqueFilename, //name of the file that is on the user's computer
                Body: buffer,  //buffer contains the actual binary data of the file
                ContentType: mimeType, //the type of the file in question
            }
            const command = new PutObjectCommand(params)

            // await s3Object.send(command);
            try 
            {
                await s3Object.send(command);
            } 
            catch (error) 
            {
                console.error("Error uploading image to S3:", error);
                res.status(500).json({status: 500, message: "Failed to save image."});
            }
            // Insert the fileName into the "file" table in the database.
            await db.none('INSERT INTO file("messageID", "fileName") VALUES ($1, $2)', [messageID, uniqueFilename]); 
        }

        // If message is inserted successfully, and if a file is uploaded and it too is inserted successfully, then return a status 200.
        res.json({ status: 201, message: 'Message inserted successfully', action: 'insertMessage' });

            
    } 
    catch(error)
    {
        console.error("Error inserting message:", error); 
        res.json({ status: 500, message: 'Failed to insert message',  action: 'insertMessage'});
    }

}



module.exports = handleInsertingMessage;
