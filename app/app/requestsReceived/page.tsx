"use client"
import RequestsReceivedDisplayer from "../components/requestsReceivedDisplayer/RequestsReceivedDisplayer";
import fetchRequestsReceived from "./api/fetchRequestsReceived";
import acceptRequest from "./api/acceptRequest";
import declineRequest from "./api/declineRequest";
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
    const [requestsReceivedResults, setRequestsReceivedResults] = useState([]);
     

    useEffect(() => {
        fetchRequestsReceived().then((res) => {
            setRequestsReceivedResults(res);
          });
      }, []);
      
   

  return (

    <main className = "w-full h-full flex justify-center items-center">
      <RequestsReceivedDisplayer requestsReceivedResults={requestsReceivedResults} setRequestsReceivedResults = {setRequestsReceivedResults} acceptRequestAPI = {acceptRequest} declineRequestAPI = {declineRequest} />
    </main>
    
  );
}
