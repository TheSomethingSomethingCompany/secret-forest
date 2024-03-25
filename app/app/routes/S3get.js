const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");
const multer = require("multer");
// const S3Client = require("@aws-sdk/client-s3");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner")

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

router.post("/api", async (req, res) => {

    const { filename } = req.body; // Extract filename directly

    if (!filename) {
        return res.status(400).json({ status: 400, message: "Filename is missing" });
    }
    console.log("getting file with key: ", filename)

    const params = {
        Bucket: bucketName, //upload will happen to this s3 bucket
        Key: filename, //name of the file that is on the user's computer
    }

    const command = new GetObjectCommand(params);
    const seconds = 3600

    try{
        const url = await getSignedUrl(s3Object, command, { expiresIn: seconds });
        if(url != null){
            console.log(url);
            res.json({status: 200, body: url});
        }else{
            res.json({status: 404, body: "file not found"});
        }

    }catch(error) {
        console.error("Server very very bad:", error);
        res.status(500).json({status: 500, message: "Server very very bad :("});
    }
  

})


module.exports = router