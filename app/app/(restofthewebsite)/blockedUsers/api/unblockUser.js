export default async function unblockUser(data) {
    const response = await fetch(`http://localhost:6969/unblockUser/api`, {
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

  