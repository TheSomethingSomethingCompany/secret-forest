export default async function GetProfilePicture(data) {
    const response = await fetch(`http://localhost:6969/getPFP/api`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-cache",
      credentials: "include"
    });
    let resBody = await response.json();
    console.log(resBody.message);
    return resBody;
  }
  