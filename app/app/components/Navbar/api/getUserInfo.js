export async function fetchUserInfo(){
const dotenv = require("dotenv");
dotenv.config();

    const response = await fetch(`http://${process.env.NEXT_PUBLIC_DNS}:6969/getUserInfo/api`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
        credentials: "include"
    });

    let resBody = await response.json(); 
    console.log("[RESPONSE BODY GET USER]:") 
    console.log(resBody);
    return resBody;
   }

   export default fetchUserInfo;