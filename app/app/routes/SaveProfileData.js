const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");
const multer = require("multer");
const fs = require("fs");


var pfpName = null;
var fileExt = null;
const storage = multer.diskStorage({
	destination: "./public/pfp-uploads", // Store the file in this directory
	filename: function (req, file, cb) {
		pfpName = req.session.signUpMemberID;
		fileExt = path.extname(file.originalname); // Get the file extension of the uploaded file
    const filePath = `./public/pfp-uploads/${pfpName}${fileExt}`;

    if (fs.existsSync(filePath)) { // if on existing/ older file is already save, remove it to make room for the new one
      fs.unlinkSync(filePath)
    }
		cb(null, pfpName + fileExt);
	},
});

const upload = multer({ storage: storage, limits: { fileSize: 1000 * 1024 * 1024 }}); 


router.post("/api", upload.single("pfp"), async (req, res) => {
  

  const {fullName, country, address, bio, username, email, tags, pfp} = req.body;
  const occupationTagsAsArray = JSON.parse(tags);
  console.log("TAGS: " + occupationTagsAsArray);
  const id = req.session.loggedInUserMemberID;

  try {

    // Check if the username is unique, except for the user's own username by excluding the logged in user's memberID in the query
    const isUniqueUsernameQuery = await db.oneOrNone(`SELECT * FROM member WHERE "username" = $1 AND "memberID"!=$2`, [username, id]);
    

    
    if (isUniqueUsernameQuery != null)
    {
      return res.json({ status: 409, message: 'This username is already being used' });
    }




    // Setting the pfpPath for the profile relation
    console.log("[FILE] | " + pfp); //DEBUG LINE
    if (req.file == null){
      const parts = pfp.split('/');
      const imgName = parts[parts.length - 1];
      pfpPath = imgName;
      console.log("[pfpPath] | " + pfpPath); //DEBUG LINE
    } else {
      pfpPath = id + fileExt;
      console.log("[pfpPath] | " + pfpPath); //DEBUG LINE
    }
    await db.tx(async t => {

      // Update profile with edited user data
      await t.none(
        `UPDATE profile SET "name" = $1, "country" = $2, "address" = $3, "bio" = $4, "pfpPath" = $5 WHERE "memberID" = $6`, 
        [fullName, country, address, bio, pfpPath, id]
      );

      // Update member with edited username and email
      await t.none(
        `UPDATE member SET "email" = $1, "username" = $2 WHERE "memberID" = $3`, [email, username, id]
      );

      for (let tag of occupationTagsAsArray) {
          await t.none(`INSERT INTO tag("tagName") VALUES($1) ON CONFLICT DO NOTHING`, [tag]);
      }


      // Remove all previous tags associated with the user
      await t.none(`DELETE FROM user_tag WHERE "memberID" = $1`,[id]);

      const tagIDs = await t.any(`SELECT "tagID" FROM tag WHERE "tagName" = any($1)`, [occupationTagsAsArray]); 
      console.log("[TAG IDS FOR UPDATED TAGS]: " + tagIDs);
      for (let tagIDsRow of tagIDs) {
        await t.none(`INSERT INTO user_tag("memberID", "tagID") VALUES($1, $2)`, [id, tagIDsRow.tagID]);
      }

  });


  console.log("[SUCCESS]: USER INFO UPDATED");

  return res.json({
    //data: { ...t }, 
    status: 202,
    message: "User Info Successfully Updated",
    pgErrorObject: null,
  });
    

  } catch (error) {
    console.log("[ERROR NAME]:\n" + error.name);
    console.log(
      "[LOG RESPONSE]:\n" +
        JSON.stringify({
          data: null,
          status: 500,
          message: "User Info Update Failed",
          pgErrorObject: {
            ...error,
          },
        })
    );
    res.json({
      data: null,
      status: 500,
      message: "User Update Failed",
      pgErrorObject: {
        ...error,
      },
    });
  }
  
});

module.exports = router;
