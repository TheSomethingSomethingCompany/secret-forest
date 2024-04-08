export async function createAProfile(data){
const dotenv = require("dotenv");
dotenv.config();

    const response = await fetch(`http://${process.env.NEXT_PUBLIC_DNS}:6969/createAProfile/api`, {
        method: 'POST',
        body: data,
        credentials: "include",
    });

    let resBody = await response.json(); // Retrieve response body and turn into JSON object
    console.log("[RESPONSE BODY CREATE PROFILE]:") 
    console.log(resBody);
    return resBody;
   }

   export default createAProfile;