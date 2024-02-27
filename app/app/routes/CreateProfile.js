const express = require("express");
const router = express.Router();
const db = require("../db-connection.js");
const path = require("path");
const multer = require("multer");

var currentDate = null;
var fileExt = null;
const storage = multer.diskStorage({
	destination: "./app/uploads", // Store the file in this directory
	filename: function (req, file, cb) {
		currentDate = Date.now(); // Get the current date and time in milliseconds
		fileExt = path.extname(file.originalname); // Get the file extension of the uploaded file
		cb(null, currentDate + fileExt); // Since file names are not guaranteed to be unique, we will use the current date and time in milliseconds as the file name, along with the file extension, such as .jpg or .png.                                                        // Also, cb is just a callback that takes in the first argument as null, and the second argument as the file name that we want to use for the uploaded file.
	},
});
const upload = multer({ storage: storage }); // "profilePicture" is the name of the file input field in the form

router.post("/api", upload.single("profilePicture"), async (req, res) => {
	// ./createAProfile/api will utilize this route. /api isn't necessary, but it makes it apparent that this is a route call.
	// By calling router.get() or router.post(), it will implicitly send 3 arguments to the callback function: req, res, and next. req is the request object from the client, res is the response object that handles sending data back to the client, and next is a function that will call the next middleware function in the stack.
	const memberID = req.session.signUpMemberID; // Retrieve memberID from session data, which was set in the SignUp route
	console.log("[MEMBER ID IN CREATE PROFILE]: " + memberID);
	console.log("[REQUEST FILE]: " + req.file);
	if (memberID == null) {
		// If memberID is null, then a user is accessing this route without signing up first, since the memberID is stored in session data upon sign up
		res.json({ status: 401, message: "Unauthorized access" });
	} else {
		console.log("[MEMBER ID]: " + memberID);
		console.log("[REQUEST BODY FOR PROFILE CREATION]:");
		console.log(req.body);
		const { fullName, country, address, bio, occupationTags } = req.body;
		const occupationTagsAsArray = JSON.parse(occupationTags);

		try {
			if (fullName == "" || country == "" || address == "") {
				res.json({
					status: 422,
					message: "Please enter all required fields",
				});
			} else {
				if (req.file == null)
					// If user did not upload a profile picture, then set the profile picture path to be the default profile picture
					pfpPath = "defaultProfilePicture.png";
				else pfpPath = currentDate + fileExt; // Set the profile picture path to be the current date and time in milliseconds, along with the file extension

				await db.tx(async (t) => {
					// Use transactions to ensure that all queries are executed successfully, or else rollback all queries
					await t.none(
						'INSERT INTO profile("memberID", "name", "country", "address", "bio", "pfpPath") VALUES($1, $2, $3, $4, $5, $6)',
						[memberID, fullName, country, address, bio, pfpPath]
					); // Insert profile data into profile table
					for (let tag of occupationTagsAsArray) {
						await t.none(
							'INSERT INTO tag("tagName") VALUES($1) ON CONFLICT DO NOTHING',
							[tag]
						);
					}

					const tagIDs = await t.any(
						'SELECT "tagID" FROM tag WHERE "tagName" = any($1)',
						[occupationTagsAsArray]
					); // Retrieve tagIDs for each tag in occupationTags

					for (let tagIDsRow of tagIDs) {
						await t.none(
							'INSERT INTO user_tag("memberID", "tagID") VALUES($1, $2)',
							[memberID, tagIDsRow.tagID]
						); // Insert tagIDs into user_tag table
					}
				});

				res.json({
					status: 201,
					message: "Profile created successfully",
				});
				console.log(
					"[PROFILE CREATION SUCCESSFUL FOR MEMBER ID]: " + memberID
				);
				delete req.session.signUpMemberID; // Destroy signUp session data
				req.session.loggedInUserMemberID = memberID; // Store memberID in session data showing that the user is now logged in upon profile creation
				req.session.save(); // Save session data

				// ESTABILISH CONNECTION WITH SESSION WEBSOCKET SERVER
				// const ws = new WebSocket("ws://localhost:8989");
				//
				// ws.on("open", () => {
				// 	console.log("[Sign-In] Connected to Session WebSocket server.");
				// 	ws.send(JSON.stringify({action: "signedIn", body:{}}));
				// 	ws.close();
				// });
				//
				// ws.on("close", () => {
				// 	console.log("[Sign-In] Disconnected from Session WebSocket server.");
				// });
			}
		} catch (error) {
			const errorResponse = {
				status: 500,
				message: "Failed to create profile",
				pgErrorObject: {
					...error,
				},
			};
			console.log("[LOG RESPONSE]:\n" + JSON.stringify(errorResponse));
			res.json({ status: 500, message: "Failed to create profile" });
		}
	}
});

module.exports = router; // Export the router, as this is necessary as the second argument of server.use(). Remember, the first argument is always the path, and the second argument is the router object. The router object will then specify an endpoint, and the endpoint will specify a callback function.
