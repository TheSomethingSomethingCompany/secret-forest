export async function getQuestion(data){
const dotenv = require("dotenv");
dotenv.config();

    const response = await fetch(`http://${process.env.NEXT_PUBLIC_DNS}:6969/getQuestion/api`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        cache: "no-cache",
        credentials: "include"
    });   

    let resBody = await response.json();
    console.log(resBody.message);
    return resBody;
}
export default getQuestion;