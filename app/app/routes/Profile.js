const express = require("express");
const router = express.Router();
const db = require("../db-connection.js")


router.post('/api', async (req, res) => { // ./createAProfile/api will utilize this route. /api isn't necessary, but it makes it apparent that this is a route call.
    console.log(req.body);

    const {fullName, country, address, bio, occupationTags} = req.body;
    try{
    if(fullName == "" || country == "" || address == "")
    {
        return res.json({ status: 422, message: 'Please enter all required fields' })
    }
    await db.none('INSERT INTO tag("tagName") VALUES($1)', ['testing']);
    res.json({ status: 201, message: 'Profile created successfully' });
    } catch(error){
        res.json({ status: 500, message: 'Failed to create profile' });
    }
});

module.exports = router;

