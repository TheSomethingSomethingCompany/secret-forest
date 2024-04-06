export async function updateProfileInfo(data){
    const response = await fetch('http://localhost:6969/saveProfileData/api', {
        method: 'POST',
        body: data,
        credentials: "include",
    });

    let resBody = await response.json(); 
    console.log("[RESPONSE BODY UPDATE PROFILE]:") 
    console.log(resBody);
    return resBody;
   }

   export default updateProfileInfo;


