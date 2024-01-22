const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");

router.post("/api", async (req, res) => {
  console.log(req.body);

  const { name, occupationTags} = req.body;
  try {
    
    query = `SELECT profile."memberID", profile."name", profile."country", array_agg(tag."tagName") as "tags" 
            FROM profile JOIN user_tag ON profile."memberID" = user_tag."memberID"
            JOIN tag ON user_tag."tagID" = tag."tagID" `;


    if(occupationTags.length > 0){
        query += `WHERE tag."tagName" = ANY($1) AND profile."name" LIKE $2`; // Even if name is empty, it will still work because empty string is a substring of all strings
        query += `GROUP BY profile."memberID", profile."name", profile."country"`;
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
        query += `WHERE profile."name" LIKE $1`;
        query += `GROUP BY profile."memberID", profile."name", profile."country"`;
        const profiles = await db.any(query, [name + '%']);
        console.log("[SUCCESS]: PROFILE FETCHED SUCCESSFUL");
        res.json({
            data: profiles,
            status: 202,
            message: "Search Query Fetch Successful",
            pgErrorObject: null,
          });
        }
    else{
        query += `GROUP BY profile."memberID", profile."name", profile."country"`;
        const profiles = await db.any(query);
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
