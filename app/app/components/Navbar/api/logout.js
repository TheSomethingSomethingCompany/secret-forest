export async function logout(){
    const response = await fetch('http://localhost:6969/logout/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        cache: "no-cache",
        credentials: "include",
    });

    let resBody = await response.json(); 
    console.log("[RESPONSE BODY LOGOUT]:") 
    console.log(resBody);
    return resBody;
   }

   export default logout;