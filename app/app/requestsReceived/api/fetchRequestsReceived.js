export async function fetchRequestsReceived({searchQ, op}){

    const response = await fetch(`http://localhost:6969/fetchRequestsReceived/api?searchQ=${encodeURIComponent(searchQ)}&op=${encodeURIComponent(op)}`, {
        credentials: "include",
    });

    let resBody = await response.json(); // Retrieve response body and turn into JSON object
    console.log("[RESPONSE BODY SEARCH RESULTS]:") 
    console.log(resBody);
    return resBody.data;
}

export default fetchRequestsReceived;