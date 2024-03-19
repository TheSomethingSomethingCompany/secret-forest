"use client"
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import fileGet from "./api/fileGet.js";

export default function main(){

// const filename = "aws issue.PNG";
// let fileurl = "";

//     async function getfile() {
//       var response = await fileGet(filename)
//       fileurl = response;
//     }

const filename = "burn up.PNG";
    const [fileUrl, setFileUrl] = useState("");

    useEffect(() => {
        async function getFile() {
            try {
                console.log("Sending filename:", filename); // Log the filename being sent
                const url = await fileGet(filename);
                setFileUrl(url);
            } catch (error) {
                console.error("Error fetching file:", error);
            }
        }

        getFile();
    }, []);



  return(

      <>

            {fileUrl && <img src={fileUrl} alt="Image" />}
 
      </>
  

  )}
  
  
  
  
