export default async function FetchProfileData(values: { id: string }) {
  const response = await fetch(`http://localhost:6969/fetchProfileData/api`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
    cache: "no-cache",
    credentials: "include"
  });
  let resBody = await response.json();
  console.log(resBody.message);
  return resBody;
}
