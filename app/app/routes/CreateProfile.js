const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");
const e = require("express");


router.post('/api', async (req, res) => { // ./createAProfile/api will utilize this route. /api isn't necessary, but it makes it apparent that this is a route call.
    const memberID = req.session.signUpMemberID; // Retrieve memberID from session data, which was set in the SignUp route
    console.log("[MEMBER ID IN CREATE PROFILE]: " + memberID);
    if(memberID == null) // If memberID is null, then a user is accessing this route without signing up first, since the memberID is stored in session data upon sign up
    {
        res.json({ status: 401, message: 'Unauthorized access' });
    }
    else
    { 
        console.log("[MEMBER ID]: " + memberID);
        console.log("[REQUEST BODY FOR PROFILE CREATION]:");
        console.log(req.body);
        const {fullName, country, address, bio, occupationTags} = req.body;

        try
        {
            if(fullName == "" || country == "" || address == "")
            {
                res.json({ status: 422, message: 'Please enter all required fields' });
            }
            else
            {
                await db.none('INSERT INTO profile("memberID", "name", "country", "address", "bio") VALUES($1, $2, $3, $4, $5)', [memberID, fullName, country, address, bio]);
                res.json({ status: 201, message: 'Profile created successfully' });
                console.log("[PROFILE CREATION SUCCESSFUL FOR MEMBER ID]: " + memberID);
                delete req.session.signUpMemberID // Destroy signUp session data
                req.session.loggedInUserMemberID = memberID; // Store memberID in session data showing that the user is now logged in upon profile creation
                req.session.save(); // Save session data
            }
        } 
        
        catch(error)
        {
            const errorResponse = {
                status: 500,
                message: "Failed to create profile",
                pgErrorObject: {
                ...error,
                },
            };
            console.log("[LOG RESPONSE]:\n" + JSON.stringify(errorResponse));
            res.json({ status: 500, message: 'Failed to create profile' });
        }
    }
});

module.exports = router;

