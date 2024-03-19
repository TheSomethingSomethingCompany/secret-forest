//BARELY WORKS BARELY WORKS BARELY WORKS BARELY WORKS BARELY WORKS BARELY WORKS BARELY WORKS  

// export async function fileGet(data){
//     const response = await fetch('http://localhost:6969/S3get/api', {
//         method: 'POST',
//         body: JSON.stringify({ data }),
        
//         // credentials: "include",
//     });

//     let resBody = await response.json(); // Retrieve response body and turn into JSON object
//     // console.log("[RESPONSE BODY CREATE PROFILE]:") 
//     console.log(resBody);
//     return resBody.body;
//    }

// export default fileGet;


export async function fileGet(filename) {
    const response = await fetch('http://localhost:6969/S3get/api', {
        method: 'POST',
        body: JSON.stringify({ filename }), // Send only the filename
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let resBody = await response.json();
    console.log(resBody);
    return resBody.body;
}

export default fileGet;

//BARELY WORKS BARELY WORKS BARELY WORKS BARELY WORKS BARELY WORKS BARELY WORKS BARELY WORKS 