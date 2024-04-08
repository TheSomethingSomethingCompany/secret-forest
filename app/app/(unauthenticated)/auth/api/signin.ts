import AuthResponse from "@/app/types/AuthResponse";
export default async function SignIn(values: {
	identifier: string;
	password: string;
	isEmail: boolean;
}) {
const dotenv = require("dotenv");
dotenv.config();

	const response = await fetch(`http://${process.env.NEXT_PUBLIC_DNS}:6969/signin/api`, {
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
