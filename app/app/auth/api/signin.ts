import AuthResponse from "../../types/AuthResponse";
export default async function SignIn(values: {
  identifier: string;
  password: string;
  isEmail: boolean;
}) {
  const response = await fetch(`http://localhost:6969/signin/api`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
    cache: "no-cache",
  });
  let resBody: AuthResponse = await response.json();
  console.log(resBody.message);
  return resBody;
  // if (resBody.status == 201) return resBody.data;
  // else if (resBody.status == 404 || resBody.status == 500) return false;
}
