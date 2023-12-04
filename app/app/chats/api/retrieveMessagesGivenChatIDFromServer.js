export async function retrieveMessagesGivenChatID(data){
    const response = await fetch('http://localhost:6969/retrieveMessages/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        cache: "no-cache",
        body: JSON.stringify(data),
        credentials: "include"
    });

    let resBody = await response.json(); // Retrieve body and turn into JSON object
   
    resBody.data.sort((a, b) => { // Sort by messageID
        return a.messageID - b.messageID;
    });

    return resBody;
   
   }

   export default retrieveMessagesGivenChatID