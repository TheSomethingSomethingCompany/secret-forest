"use client"
import RequestsSentDisplayer from "../components/requestsSentDisplayer/RequestsSentDisplayer";
import fetchRequestsSent from "./api/fetchRequestsSent";
import cancelRequest from "./api/cancelRequest";
import React, { useEffect, useState} from 'react';

export default function Home() {
   
    useEffect(() => {
      document.body.classList.add('h-full');
      
      // Clean up function
      return () => {
        document.body.classList.remove('your-class-name');
      };
    }, []);

    // We need to make an api call to fetch the requests sent by the user.
    const [requestsSentResults, setRequestsSentResults] = useState([]);
     

    useEffect(() => {
        fetchRequestsSent().then((res) => {
            setRequestsSentResults(res);
          });
      }, []);
      
   

  return (

    <main className = "w-full h-full flex justify-center items-center">
      <RequestsSentDisplayer requestsSentResults={requestsSentResults} setRequestsSentResults = {setRequestsSentResults} cancelRequestAPI = {cancelRequest} />
    </main>
    
  );
}
