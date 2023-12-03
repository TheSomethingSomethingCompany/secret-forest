export async function retrieveMessagesGivenChatID(data){
    const response = await fetch('http://localhost:6969/retrieveMessages/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        cache: "no-cache",
        body: JSON.stringify(data)
    });

    let resBody = await response.json(); // Retrieve body and turn into JSON object
    return resBody;
   
   }

   export default retrieveMessagesGivenChatID