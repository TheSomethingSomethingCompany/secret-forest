import AuthResponse from "../../types/AuthResponse";
export default async function SignUp(values: {
  name: string;
  email: string;
  username: string;
  password: string;
  isorganization: boolean;
}) {
  const response = await fetch(`http://localhost:6969/signup/api`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
    cache: "no-cache",
  });
  let resBody: AuthResponse = await response.json();
  console.log("[MIDDLEMAN]:\n" + JSON.stringify(resBody));
  return resBody;
}
