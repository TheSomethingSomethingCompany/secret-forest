export async function createAProfile(data){
    const response = await fetch('http://localhost:6969/createAProfile/api', {
        method: 'POST',
        body: data,
        credentials: "include",
    });

    let resBody = await response.json(); // Retrieve response body and turn into JSON object
    console.log("[RESPONSE BODY CREATE PROFILE]:") 
    console.log(resBody);
    return resBody;
   }

   export default createAProfile;