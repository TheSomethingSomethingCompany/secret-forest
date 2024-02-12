export async function fetchRequestsReceived(){
    const response = await fetch('http://localhost:6969/fetchRequestsReceived/api', {
        credentials: "include",
    });

    let resBody = await response.json(); // Retrieve response body and turn into JSON object
    console.log("[RESPONSE BODY SEARCH RESULTS]:") 
    console.log(resBody);
    return resBody.data;
}

export default fetchSearchResults;