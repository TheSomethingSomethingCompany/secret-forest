const express = require("express");
const router = express.Router();
const db = require("../../db-connection.js")

router.post('/api', async (req, res) => {
    
    try
    {
        
        // Since we are not using sessions, we will hardcode the memberID for now
        const fromMemberID = req.session.loggedInUserMemberID; // One of the members of chat must clearly be the logged in user
        const toUsername = req.body.username; // The username from the request body is the user that the logged in user is trying to send a request to
       
        // First, we need to check if the user exists, and if they do, use their memberID
        const toUsernameQuery = await db.oneOrNone(`
        SELECT "memberID" FROM member WHERE username = $1
        `, [toUsername]);

        if(toUsernameQuery==null)
        {
            res.json({ status: 404, message: 'User does not exist' });
        }
        else
        {
            const toMemberID = toUsernameQuery.memberID; // An array of rows is returned, which each row being an object with a memberID property. The first row is the only row, so we can access it with [0], and then access the memberID property with .memberID
            
            if(fromMemberID === toMemberID)
            {
                res.json({ status: 409, message: 'Cannot send request to yourself' });
            }

            else
            {

                // Check if the the two users have not already blocked each other
                const blockExists = await db.oneOrNone(`
                SELECT * FROM blocked_user WHERE ("blockerMemberID" = $1 AND "blockedMemberID" = $2) OR ("blockerMemberID" = $2 AND "blockedMemberID" = $1)
                `, [fromMemberID, toMemberID]);

                if(blockExists != null)
                {
                    res.json({ status: 409, message: 'Cannot send request to user that has blocked you' });
                }

                else
                {
                    // Check if request already exists
                    const requestExists = await db.oneOrNone(`
                    SELECT * FROM request WHERE ("fromMemberID" = $1 AND "toMemberID" = $2) OR ("fromMemberID" = $2 AND "toMemberID" = $1)
                    `, [fromMemberID, toMemberID]); // The left side of the OR is if the logged in user has sent a request to the other user, and the right side is if the other user has sent a request to the logged in user

                    if(requestExists != null)
                    {
                        res.json({ status: 409, message: 'Request already exists' });
                    }

                    else
                    {
                        // Before we insert the request, we need to check if a chat already exists between the two members
                        const chatExists = await db.oneOrNone(`
                        SELECT * FROM chat WHERE ("memberID1" = $1 AND "memberID2" = $2) OR ("memberID1" = $2 AND "memberID2" = $1)
                        `, [fromMemberID, toMemberID]);

                        console.log("CHAT EXISTS: ", chatExists);
            
                        if(chatExists != null)
                        {
                            res.json({ status: 409, message: 'Chat already exists' });
                        }

                        else
                        {
                            // If the chat does not exist, then we can insert the request
                            console.log("INSERTING REQUEST");
                            await db.none(`
                            INSERT INTO request("fromMemberID", "toMemberID") VALUES ($1, $2)
                            `, [fromMemberID, toMemberID]);
                            res.json({ status: 201, message: 'Created request successfully'});
                        }
                    }
                }
            }
        }
        
    } 
    catch(error)
    {
        res.json({ status: 500, message: 'Failed to create request', error: error});
    }
});

module.exports = router;