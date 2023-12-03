export async function retrieveChats(){
    const response = await fetch(`http://localhost:6969/retrieveChats/api`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        cache: "no-cache",
        credentials: "include"
    });

    /** Sort resBody.data by the messageID */
    

    let resBody = await response.json(); // Retrieve body and turn into JSON object
    return resBody;
}
export default retrieveChats;