export default async function SignUp(values: {
  name: string;
  email: string;
  username: string;
  password: string;
  isorganization: boolean;
}) {
  const response = await fetch(`/auth/signup/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
    cache: "no-cache",
  });
  let res = JSON.parse(await response.text());
  return res.data ? res.data.id : res.status;
}
