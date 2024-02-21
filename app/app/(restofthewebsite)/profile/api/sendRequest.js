export async function sendRequest(data){
    const response = await fetch('http://localhost:6969/sendRequest/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: "include",
    });

    let resBody = await response.json(); // Retrieve response body and turn into JSON object
    console.log(resBody);
    return resBody.data;
   }

   export default sendRequest;