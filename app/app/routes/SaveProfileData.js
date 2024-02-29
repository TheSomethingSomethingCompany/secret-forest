const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");

router.post("/api", async (req, res) => {
  

  const {fullName, country, address, bio, username, email, tags} = req.body;
  const occupationTagsAsArray = JSON.parse(tags);
  console.log("TAGS: " + occupationTagsAsArray);
  const id = req.session.loggedInUserMemberID;

  try {

    // Check if the username is unique, except for the user's own username by excluding the logged in user's memberID in the query
    const uniqueUserName = await db.any(`SELECT * FROM member WHERE "username" = $1 AND "memberID"!=$2`, [username, id]);
    

    if (uniqueUserName.length > 1){
      res.json({ status: 404, message: 'This username is already being used' });
    }

    else if (uniqueUserName.length === 1 && uniqueUserName[0].memberID !== id) {
      res.json({ status: 404, message: 'This username is already being used'});
    }

    else {
    await db.tx(async t => {
      await t.none(
        `UPDATE profile SET "name" = $1, "country" = $2, "address" = $3, "bio" = $4 WHERE "memberID" = $5`, 
        [fullName, country, address, bio, id]
      );
      await t.none(
        `UPDATE member SET "email" = $1, "username" = $2 WHERE "memberID" = $3`, [email, username, id]
      );

      for (let tag of occupationTagsAsArray) {
          await t.none(`INSERT INTO tag("tagName") VALUES($1) ON CONFLICT DO NOTHING`, [tag]);
      }


      await t.none(`DELETE FROM user_tag WHERE "memberID" = $1`,[id]);

      const tagIDs = await t.any(`SELECT "tagID" FROM tag WHERE "tagName" = any($1)`, [occupationTagsAsArray]); 
      console.log("[TAG IDS]: " + tagIDs);
      for (let tagIDsRow of tagIDs) {
          await t.none(`INSERT INTO user_tag("memberID", "tagID") VALUES($1, $2)`, [id, tagIDsRow.tagID]);
      }

  });


    console.log("[SUCCESS]: USER INFO UPDATED");

    res.json({
      //data: { ...t }, 
      status: 202,
      message: "User Info Successfully Updated",
      pgErrorObject: null,
    });
      }

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