export default async function FetchUserData(values: { slug: string }) {
const dotenv = require("dotenv");
dotenv.config();

  const response = await fetch(`http://${process.env.NEXT_PUBLIC_DNS}:6969/fetchUserData/api`, {
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
