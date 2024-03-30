"use client"
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import fileUpload from "./api/fileUpload.js";


export default function main(){

  const [file, setFile] = useState(null);

  const fileSelected = e => {
    const file = e.target.files[0]
		setFile(file)
    console.log(file)
	}


  async function submit(e){
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    
    var response = await fileUpload(formData)
    if(response.status == 200){
      alert("file uploaded successfuly!");
    }else if(response.status == 400){
      alert("No file provided!");
    }else{
      alert("no response from server");
    }
  }

return(
    <>

    <div>
      <form onSubmit={submit}>
        <input type="text" className="border"/>
        <input type="file"id="file" onChange={fileSelected}/>
        <button type="submit">Click here to upload your file</button>
      </form>
    </div>    
    
    </>



)

}



