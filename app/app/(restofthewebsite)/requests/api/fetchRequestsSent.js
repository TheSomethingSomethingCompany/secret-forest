export async function fetchRequestsSent({searchQ, searchBy}){
    const response = await fetch(`http://localhost:6969/fetchRequestsSent/api?searchQ=${encodeURIComponent(searchQ)}&searchBy=${encodeURIComponent(searchBy)}`, {
        credentials: "include",
    });

    let resBody = await response.json(); // Retrieve response body and turn into JSON object
    console.log("[RESPONSE BODY SENT REQUESTS RESULTS]:") 
    console.log(resBody);
    return resBody;
}

export default fetchRequestsSent; 