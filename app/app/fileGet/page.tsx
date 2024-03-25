"use client"
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import fileGet from "./api/fileGet.js";

export default function main(){

    const filename = "0505e2a3-dd29-483b-a729-361210315690_test_video2.mp4";
    const [fileUrl, setFileUrl] = useState("");
    const [fileType, setFileType] = useState("");


    useEffect(() => {
        async function getFile() {
            try {
                console.log("Sending filename:", filename); // Log the filename being sent
                const url = await fileGet(filename);
                console.log("recieved file with this url: ", url)
                setFileUrl(url);
                getFileType(url);
            } catch (error) {
                console.error("Error fetching file:", error);
            }
        }

        getFile();
    }, []);


    function getFileType(url: string) {
        console.log("Getting file type for URL:", url);
        try {
          const parts = url.split('?')[0].split('/');
          const fileName = parts.pop();
          if (fileName) {
            const extension = fileName.split('.').pop()?.toLowerCase();
            console.log("file extension:", extension);
            setFileType(extension || "");
          } else {
            console.error("Unable to extract filename from URL:", url);
          }
        } catch (error) {
          console.error("Error getting file type:", error);
        }
      }
          
  return(

      <>

            {/* {fileUrl && <img src={fileUrl} alt="Image" />}
            {fileUrl && <video src={fileUrl} />} */}

        {(fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' || fileType === 'gif') && fileUrl && <img src={fileUrl} alt="Image" />}
        {(fileType === 'mp4' || fileType === 'mov') && fileUrl && <video src={fileUrl} controls />}

 
      </>
  

  )}