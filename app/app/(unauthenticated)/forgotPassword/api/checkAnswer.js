export async function checkAnswer(data){
    const response = await fetch(`http://localhost:6969/checkAnswer/api`, {
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
export default checkAnswer;