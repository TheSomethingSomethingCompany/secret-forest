export default async function FetchUserData(values: { slug: string }) {
  const response = await fetch(`http://localhost:6969/fetchUserData/api`, {
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
