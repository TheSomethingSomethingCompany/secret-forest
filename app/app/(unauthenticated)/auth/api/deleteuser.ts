import AuthResponse from "../../../types/AuthResponse";

export default async function DeleteUser(values: { username: string }) {
const dotenv = require("dotenv");
dotenv.config();

	const response = await fetch(`http://${process.env.NEXT_PUBLIC_DNS}:6969/deleteuser/api`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
		cache: "no-cache",
	});
	let resBody: AuthResponse = await response.json();
	console.log(resBody.message);
	return resBody;
}
