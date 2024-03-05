export async function fetchBlockedUsers({searchQ, op}){
    const response = await fetch(`http://localhost:6969/fetchBlockedUsers/api?searchQ=${encodeURIComponent(searchQ)}&op=${encodeURIComponent(op)}`, {
        credentials: "include",
    });

    let resBody = await response.json(); // Retrieve response body and turn into JSON object
    console.log("[RESPONSE BODY BLOCKED USERS RESULTS]:") 
    console.log(resBody);
   
    if(resBody.status === 200){
       return resBody.data;
   }
    else{
         return null;
    }
}

export default fetchBlockedUsers 
  