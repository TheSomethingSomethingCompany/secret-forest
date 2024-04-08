import AuthResponse from "../../../types/AuthResponse";
export default async function SessionCheck() {
const dotenv = require("dotenv");
dotenv.config();

	const response = await fetch(`http://${process.env.NEXT_PUBLIC_DNS}:6969/sessionCheck/api`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: null,
		cache: "no-cache",
		credentials: "include",
	});
	let resBody: AuthResponse = await response.json();
	console.log(resBody.message);
	return resBody;
}
