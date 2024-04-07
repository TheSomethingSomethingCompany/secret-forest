
export default async function updatePassword(data) {
	const response = await fetch(`http://localhost:6969/updatePassword/api`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
		cache: "no-cache",
		credentials: "include",
	});
	let resBody = await response.json();
	console.log("[MIDDLEMAN]:\n", JSON.stringify(resBody));
	return resBody;
}