"use client"
import RequestsReceivedDisplayer from "@/app/components/requestsReceivedDisplayer/RequestsReceivedDisplayer";
import fetchRequestsReceived from "./api/fetchRequestsReceived";
import acceptRequest from "./api/acceptRequest";
import declineRequest from "./api/declineRequest";
import React, { useEffect, useState} from 'react';
import SearchBar from "@/app/components/searchBar/SearchBar";

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
    const [searchQ, setSearchQ] = useState("");
    const [searchBy, setSearchBy] = useState("name");

    useEffect(() => {
        fetchRequestsReceived({searchQ:"", op:0}).then((res) => {
            setRequestsReceivedResults(res);
          });
      }, []);
      
      function onSearch(){
        let op = 0;
        if(searchBy === "name"){
          op = 0;
        } else if(searchBy === "email"){
          op = 1;
        } else if(searchBy === "username"){
          op = 2;
        }
  
        fetchRequestsReceived({searchQ: searchQ, op: op}).then((res) => {
          setRequestsReceivedResults(res);
        });
      }
   

  return (

    <main className = "w-full h-full flex flex-col items-center">
      <SearchBar searchQ = {searchQ} setSearchQ = {setSearchQ} searchBy = {searchBy} setSearchBy = {setSearchBy} onSearch={onSearch}/>
      <RequestsReceivedDisplayer requestsReceivedResults={requestsReceivedResults} setRequestsReceivedResults = {setRequestsReceivedResults} acceptRequestAPI = {acceptRequest} declineRequestAPI = {declineRequest} />
    </main>
    
  );
}
