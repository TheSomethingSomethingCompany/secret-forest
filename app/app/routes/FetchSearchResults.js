const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");
const { identifierToKeywordKind } = require("typescript");

router.post("/api", async (req, res) => {
  console.log(req.body);

  const { name, occupationTags, op} = req.body; //If op is 0, then we are searching by name. If op is 1, then we are searching by email. If op is 2, then we are searching by username.
  id = ``; // Name, email, or username
  joinWithMember = ``;

  switch(op){ 
    case 0: // Search by name
      id += ` profile."name"`;
      break;
    case 1: // Search by email
      id += ` member."email"`;
      joinWithMember = ` JOIN member ON profile."memberID" = member."memberID"`;
      break;
    case 2: // Search by username
      id += ` member."username"`;
      joinWithMember = ` JOIN member ON profile."memberID" = member."memberID"`;
      break;
  }
  try {
    
    if(occupationTags.length > 0){

        query = `SELECT `+ id + `,profile."country", array_agg(tag."tagName") as "tags" 
        FROM profile JOIN (
          select "memberID"
          from user_tag join tag on user_tag."tagID" = tag."tagID"
          where tag."tagName" = any($1) 
        ) as matchingProfiles ON profile."memberID" = matchingProfiles."memberID"
        JOIN user_tag ON profile."memberID" = user_tag."memberID"
        join tag on user_tag."tagID" = tag."tagID"` + joinWithMember + `
        group by profile."memberID", profile."country",`+id+`
        HAVING` + id + ' ILIKE $2;';

      
        const profiles = await db.any(query, [occupationTags, name+'%']);
        console.log("[SUCCESS]: PROFILE FETCHED SUCCESSFUL");
        res.json({
            data: profiles,
            status: 202,
            message: "Search Query Fetch Successful",
            pgErrorObject: null,
          });

        }
    else if(occupationTags.length == 0){ // If no tags are selected, then just search by name. even if name is empty, it will still work because empty string is a substring of all strings
        query = `SELECT` + id + `,profile."country", array_agg(tag."tagName") as "tags" 
        FROM profile 
        JOIN user_tag ON profile."memberID" = user_tag."memberID"
        join tag on user_tag."tagID" = tag."tagID"` + joinWithMember + `
        group by profile."memberID", profile."country",` + id + ` ILIKE $1;`;

        const profiles = await db.any(query, [name + '%']);
        console.log("[SUCCESS]: PROFILE FETCHED SUCCESSFUL");
        res.json({
            data: profiles,
            status: 202,
            message: "Search Query Fetch Successful",
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
          message: "Search Query Fetch Failed",
          pgErrorObject: {
            ...error,
          },
        })
    );
    res.json({
      data: null,
      status: 500,
      message: "Search Query Fetch Failed",
      pgErrorObject: {
        ...error,
      },
    });
  }
});

module.exports = router;
