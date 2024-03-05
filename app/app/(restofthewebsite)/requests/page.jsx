"use client"
import RequestsSentDisplayer from "@/app/components/requestsSentDisplayer/RequestsSentDisplayer";
import RequestsReceivedDisplayer from "@/app/components/requestsReceivedDisplayer/RequestsReceivedDisplayer";
import BlockedUsersDisplayer from "@/app/components/blockedUsersDisplayer/BlockedUsersDisplayer";
import SearchBar from "@/app/components/searchBar/SearchBar";
import fetchRequestsSent from "./api/fetchRequestsSent";
import cancelRequest from "./api/cancelRequest";
import fetchRequestsReceived from "./api/fetchRequestsReceived";
import acceptRequest from "./api/acceptRequest";
import declineRequest from "./api/declineRequest";
import fetchBlockedUsers from "./api/fetchBlockedUsers";
import unblockUser from "./api/unblockUser";
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
    const [results, setResults ] = useState([]);
    const [searchQ, setSearchQ] = useState("");
    const [searchBy, setSearchBy] = useState("name");
    const [mode, setMode] = useState("sent"); // received, sent, or blocked 


    function fetchResultsByMode({searchQ: searchQ, op: op})
    {
        switch(mode)
        {
            case "received":
                fetchRequestsReceived({searchQ: searchQ, op: op}).then((res) => {
                    setResults(res);
                });
                break;
            case "sent":
                fetchRequestsSent({searchQ: searchQ, op: op}).then((res) => {
                    setResults(res);
                });
                break;
            case "blocked":
                fetchBlockedUsers({searchQ: searchQ, op: op}).then((res) => {
                    setResults(res);
                });
                break;
        }
    
    }

    useEffect(() => {
        fetchResultsByMode({searchQ: "", op: 0});
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
      fetchResultsByMode({searchQ: searchQ, op: op});
    }
     
    function setModeHandler(mode){
      setMode(mode);
      fetchResultsByMode({searchQ: "", op: 0});
      setResults([]);
    }
  

  return (

    <main className = "w-full h-full flex flex-col items-center">
      <SearchBar searchQ = {searchQ} setSearchQ = {setSearchQ} searchBy = {searchBy} setSearchBy = {setSearchBy} onSearch = {onSearch} />
      <div className="flex mb-4">
      <button onClick={() => setModeHandler("received")} className={`ml-4 mr-4 ${mode === 'received' ? 'text-blue-500' : ''}`}>Received</button>
      <button onClick={() => setModeHandler("sent")} className={`mr-4 ${mode === 'sent' ? 'text-blue-500' : ''}`}>Sent</button>
      <button onClick={() => setModeHandler("blocked")} className={`mr-4 ${mode === 'blocked' ? 'text-blue-500' : ''}`}>Blocked</button>
    </div>
      {mode === 'sent' && <RequestsSentDisplayer requestsSentResults={results} setRequestsSentResults={setResults} cancelRequestAPI={cancelRequest} />}
      {mode === 'received' && <RequestsReceivedDisplayer requestsReceivedResults={results} setRequestsReceivedResults={setResults} acceptRequestAPI={acceptRequest} declineRequestAPI={declineRequest} />}
      {mode === 'blocked' && <BlockedUsersDisplayer blockedUsersResults={results} setBlockedUsersResults={setResults} unblockUserAPI={unblockUser} />}
           
      </main>
    
  );
}
