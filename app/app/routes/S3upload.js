const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
// const S3Client = require("@aws-sdk/client-s3");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
dotenv.config();

// get the environment variables from the .env file
const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = "ASIAQ23K775AEHOUMXF5";
const secretAccessKey = "8xgEvuavENiY8ILygidtX+OjrTui3c1rsgATZ4Uc";
const sessionToken = "IQoJb3JpZ2luX2VjEEUaDGNhLWNlbnRyYWwtMSJHMEUCIQCI/23leNvd7sbvvACTgHwCSPDlqkgu76/o+izL7EutKgIgEp1oOgYIsjdTsZUhwa4sHCyMF+92rHWkITXC4j7XmvcqlgMIPhAAGgwwNTc2Njk1ODI2NTYiDJGhRkZbxTuu1f2u0irzAp05MEu20oFooUNpXj3cMAgHtQrvNbArn1oFnOqQCCp9thqsJMRgWCps0wQptr/4tt8mdNaGYa4M5z+/EIBzOYwriaTd3jr478M+xPCI2kdWM5F1tewULOOB7XUIZG1SqMqA++6znmWNLQhMM9GKEB97p0/GL1z1ngajTy3MP8+G9EW7YyJ0bSvs+6Z411F2fHJPDwpxQ4xi/c+sGSwgcOsoo1nTjcBOPXNnIxz8SiRp8ScEryivtKyMcmVOcj4TMpdTT7TLtBZfA38j4W7FSDjCldRZ4SSS8Ml4Wi8ZdOaCjVr5kepSRSZzLEkHf6dZJ1WGOJ/vIBbPafUUtZL2Ir8sKuI+Qj3T4XFRg7PZVU8eu40B+uaReOyWt6/jgFyWZGAp6FM5foU2yYlT/u2UE5h8a4lNFXXcH9olnvPIWbUCzTHdFSXNSG3oXCpUNLZ4mUhDDSoHQjvSf2X4b2zpkvIPfWcF5bUNvtist0z4fF/E+GpGMODiiq8GOqYBlmIvjRgJe7OayON4AEAE4AisJamrH3iK/vZJ7bBtqo8SochQiwRpFhUIWI/eO3uW0I0T9ODJJhP+eVxTafCR6jUkyrTrHZjjC4eFyz0TYZRvodQOJAlOg6K9u2DdnuQ9v5Fp7d1JGvMGfTYvKf0JB5rXwK8vkWIdZy/7T0j1XmPWe8wADk9ht/U6JYCDpkEfBJgWEeIvVqy/RvTANdACeH6Trh+LTw==";

const s3Object = new S3Client({ //creates a s3 object given the environment variables
    credentials:{
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
        sessionToken: sessionToken,
    },
    region: bucketRegion
});

const storage = multer.memoryStorage();
const upload = multer({storage: storage});


router.post('/api', upload.single('file'), async(req,res) => {

    const memberID = req.session.signUpMemberID;

    console.log('req.body', req.body)
    console.log('req.file', req.file)

    if(req.file){

        const uniqueFilename = `${uuidv4()}_${req.file.originalname}`; //creates a unique filename for the image
        
        const params = {
            Bucket: bucketName, //upload will happen to this s3 bucket
            Key: uniqueFilename, //name of the file that is on the user's computer
            Body: req.file.buffer,  //buffer contains the actual binary data of the file
            ContentType: req.file.mimetype, //the type of the file in question
        }
        const command = new PutObjectCommand(params)
    
        // await s3Object.send(command);

        try {
            await s3Object.send(command);
            res.json({status: 200, message: "Image saved successfully."});
        } catch (error) {
            console.error("Error uploading image to S3:", error);
            res.status(500).json({status: 500, message: "Failed to save image."});
        }
    
        // await db.none('INSERT INTO files("memberID", "fileName") VALUES ($1, $2)', [memberID, req.file.originalname]); 
        //inserts image name and associates it with the current user. 
        //currently this serves no purpose but will be needed when retrieving images from s3 with signed URLs
        
        // res.json({status:200, message:"image saved successfuly??"});
    
    } else {
        res.status(400).json({status: 400, message: "No file provided."});
    }
})

module.exports = router