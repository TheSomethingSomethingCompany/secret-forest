const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");

router.post("/api", async (req, res) => {
    console.log("body: " + req.body);

    const userInfo = req.body.username;
    console.log("GET PFP FOR USER: " + userInfo);
    try {

    const pfpImg = await db.oneOrNone(
        `SELECT profile."pfpPath"
      FROM profile
      JOIN member ON profile."memberID" = member."memberID"
      WHERE member."username" = $1`,
      [userInfo]
    );

    if(pfpImg == null)
    {
      console.log("[USER NOT FOUND]-> Username: "+ userInfo);
      console.log("[LOG RESPONSE]:\n" + JSON.stringify({
        data: null,
        status: 404,
        message: "User Not Found",
        pgErrorObject: null,
      }));

      return res.json({
        data: null,
        status: 404,
        message: "User Not Found",
        pgErrorObject: null,
      });
    } 


    const imgName = pfpImg.pfpPath;
    let imgPath = ``;
    if (imgName.length <= 6) 
    {
        imgPath = `/profile-pictures/${imgName}`;
    } else 
    {
        imgPath = `/pfp-uploads/${imgName}`;
    }

    console.log("User Fetch PFP Successful: " + imgPath);
    res.json({
        data: imgPath,
        status: 200,
        message: "User Fetch Successful",
        pgErrorObject: null,
    });

    

} catch (error) {
    console.log("[ERROR NAME]:\n" + error.name);
    console.log(
      "[LOG RESPONSE]:\n" +
        JSON.stringify({
          data: null,
          status: 500,
          message: "User Fetch PFP Failed",
          pgErrorObject: {
            ...error,
          },
        })
    );
    res.json({
      data: null,
      status: 500,
      message: "User Fetch PFP Failed",
      pgErrorObject: {
        ...error,
      },
    });
  }


});

module.exports = router;