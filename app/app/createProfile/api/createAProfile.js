export async function createAProfile(data){
    const response = await fetch('http://localhost:6969/createAProfile/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    let resBody = await response.json(); // Retrieve body and turn into JSON object
    console.log(resBody.message);
    console.log(resBody.status)
    if(resBody.status == 201)
        return true;
    else if(resBody.status == 422 || resBody.status == 500) return false;
   }

   export default createAProfile;