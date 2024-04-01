export async function retrieveChats(searchQuery){
    console.log("REQUEST FOR RETRIEVE CHATS WITH SEARCHQ: " + searchQuery);
    const response = await fetch(`http://localhost:6969/retrieveChats/api?searchQ=${encodeURIComponent(searchQuery)}`, {
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