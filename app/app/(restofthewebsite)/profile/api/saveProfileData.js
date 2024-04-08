export async function updateProfileInfo(data){
const dotenv = require("dotenv");
dotenv.config();

    const response = await fetch(`http://${process.env.NEXT_PUBLIC_DNS}:6969/saveProfileData/api`, {
        method: 'POST',
        body: data,
        credentials: "include",
    });

    let resBody = await response.json(); 
    console.log("[RESPONSE BODY UPDATE PROFILE]:") 
    console.log(resBody);
    return resBody;
   }

   export default updateProfileInfo;


