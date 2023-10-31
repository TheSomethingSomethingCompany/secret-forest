const express = require("express");
const router = express.Router();
const db = require("../db-connection.js")

const connection = {
    host: 'db',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres'
}


router.post('/api', async (req, res) => { // ./createAProfile/api will utilize this route. /api isn't necessary, but it makes it apparent that this is a route call.
    console.log(req.body);

    const{fullName, country, address, bio, occupationTags} = req.body;
    await db.none('INSERT INTO tag("tagName") VALUES($1)',["Doctor"]);
    res.json({ success: true, message: 'Profile created successfully' });
});

module.exports = router;