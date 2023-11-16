export default async function SignIn(values: {
  identifier: string;
  password: string;
  isEmail: boolean;
}) {
  const url = values.isEmail
    ? `/auth/signin/api/signin/emailSign`
    : `/auth/signin/api/signin/usernameSign`;

  console.log("TEST URL: " + url);
  const response = await fetch(`${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: values.identifier,
      password: values.password,
    }),
    cache: "no-cache",
  });
  // console.log("AWIAT" + response);
  let res = JSON.parse(await response.text());
  return res.data ? res.data.username : res.status;
}
