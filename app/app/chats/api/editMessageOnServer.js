export async function editMessage(data){
    const response = await fetch('http://localhost:6969/editMessage/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        cache: "no-cache",
        credentials: "include"

    });

    let resBody = await response.json(); // Retrieve body and turn into JSON object
    return resBody;
   }
    export default editMessage