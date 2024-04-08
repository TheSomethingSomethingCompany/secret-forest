export async function fetchRequestsSent({searchQ, searchBy}){
const dotenv = require("dotenv");
dotenv.config();

    const response = await fetch(`http://${process.env.NEXT_PUBLIC_DNS}:6969/fetchRequestsSent/api?searchQ=${encodeURIComponent(searchQ)}&searchBy=${encodeURIComponent(searchBy)}`, {
        credentials: "include",
    });

    let resBody = await response.json(); // Retrieve response body and turn into JSON object
    console.log("[RESPONSE BODY SENT REQUESTS RESULTS]:") 
    console.log(resBody);
    return resBody;
}

export default fetchRequestsSent; 