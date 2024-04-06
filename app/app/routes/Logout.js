const express = require("express");
const router = express.Router();



router.post("/api", async (req, res) => {
  

  try {
    req.session.destroy((err) => {
        if (err) 
            return res.json({ status: 422, message: 'Cannot Delete Session' });
        
        return res.json({ status: 202, message: 'User Logged Out' });
        
    });



  } catch (error) {
    console.log("[ERROR NAME]:\n" + error.name);
    console.log(
      "[LOG RESPONSE]:\n" +
        JSON.stringify({
          data: null,
          status: 500,
          message: "Cannot Logout",
          pgErrorObject: {
            ...error,
          },
        })
    );
    res.json({
      data: null,
      status: 500,
      message: "Cannot Logout",
      pgErrorObject: {
        ...error,
      },
    });
  }
  
});

module.exports = router;