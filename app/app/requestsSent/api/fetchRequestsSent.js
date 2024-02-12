export async function fetchRequestsSent(){
    const response = await fetch('http://localhost:6969/fetchRequestsSent/api', {
        credentials: "include",
    });

    let resBody = await response.json(); // Retrieve response body and turn into JSON object
    console.log("[RESPONSE BODY SENT REQUESTS RESULTS]:") 
    console.log(resBody);
    return resBody.data;
}

export default fetchRequestsSent;