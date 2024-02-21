import AuthResponse from "../../types/AuthResponse";
export default async function DeleteUser(values: { username: string }) {
  const response = await fetch(`http://localhost:6969/deleteuser/api`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
    cache: "no-cache",
  });
  let resBody: AuthResponse = await response.json();
  console.log(resBody.message);
  return resBody;
}
