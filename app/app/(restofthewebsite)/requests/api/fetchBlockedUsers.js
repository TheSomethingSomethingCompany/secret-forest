export async function fetchBlockedUsers({searchQ, searchBy}){
    const response = await fetch(`http://localhost:6969/fetchBlockedUsers/api?searchQ=${encodeURIComponent(searchQ)}&searchBy=${encodeURIComponent(searchBy)}`, {
        credentials: "include",
    });

    let resBody = await response.json(); // Retrieve response body and turn into JSON object
    console.log("[RESPONSE BODY BLOCKED USERS RESULTS]:") 
    console.log(resBody);
   
    return resBody;
}

export default fetchBlockedUsers 
  