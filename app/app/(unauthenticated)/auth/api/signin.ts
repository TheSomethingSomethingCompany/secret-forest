import AuthResponse from "@/app/types/AuthResponse";
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
    credentials: "include",
  });
  let resBody: AuthResponse = await response.json();
  console.log("[MIDDLEMAN]:\n", JSON.stringify(resBody));
  return resBody;
}
