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
import React, { useEffect, useState, useRef} from 'react';

export default function Home() {
   
    useEffect(() => {
      document.body.classList.add('h-full');
      
      // Clean up function
      return () => {
        document.body.classList.remove('your-class-name');
      };
    }, []);

    // We need to make an api call to fetch the requests sent by the user.
    const results = useRef(null);
    const mode = useRef("received");
    const [searchQ, setSearchQ] = useState("");
    const [searchBy, setSearchBy] = useState("name");
    const [rerender, setRerender] = useState(false);

    function fetchResultsByMode({searchQ, searchBy})
    {
        
        switch(mode.current)
        {
          

            // Handle the response
            case "received":
                fetchRequestsReceived({searchQ: searchQ, searchBy: searchBy}).then((res) => {
                  
                  // Handle the response
                  console.log("[RESPONSE BODY RECEIVED REQUESTS RESULTS]: "+ JSON.stringify(res));
                  switch(res.status){
                    case 200:
                      results.current = res.data;
                      console.log("[RECEIVED REQUESTS RESULTS IN RESULTS.CURRENT]: "+ JSON.stringify(results.current));
                      break;
                    case 500:
                      results.current = [];
                      
                      break;
                  }
                  setRerender(prev => !prev);
                });
                break;
            case "sent":
                fetchRequestsSent({searchQ: searchQ, searchBy: searchBy}).then((res) => {

                  // Handle the response
                  switch(res.status){
                    case 200:
                      results.current = res.data;
                      break;
                    case 500:
                      results.current = [];
                    
                      break;
                  }
                    setRerender(prev => !prev)
                });
                break;
            case "blocked":
                fetchBlockedUsers({searchQ: searchQ, searchBy: searchBy}).then((res) => {

                  // Handle the response
                  switch(res.status){
                    case 200:
                      results.current = res.data;
                      break;
                    case 500:
                      results.current = [];
                      toast.error("Failed to retrieve blocked users, please try again by refreshing the page.", {
                        position: toast.POSITION.BOTTOM_LEFT
                      });
                      break;
                  }
                  setRerender(prev => !prev);
                });
                break;
        }
    
    }

    useEffect(() => {
        fetchResultsByMode({searchQ: "", searchBy: "name"});
    }, []);


    function onSearch(){
      fetchResultsByMode({searchQ: searchQ, searchBy: searchBy});
    }
     
    function setModeHandler(newMode){
      results.current = null; // Clear the results and show a loading spinner or something
      mode.current = newMode;
      fetchResultsByMode({searchQ: "",  searchBy: "name"});
    }

    function setResults(data){
        results.current = data;
    }

  

  return (

    <main className = "w-full h-full flex flex-col items-center">
      <SearchBar searchQ = {searchQ} setSearchQ = {setSearchQ} searchBy = {searchBy} setSearchBy = {setSearchBy} onSearch = {onSearch} />
      <div className="flex mb-4">
      <button className = "text-green-300">Hi</button>
      <button onClick={() => setModeHandler("received")} className={`ml-4 mr-4 ${mode === 'received' ? 'text-blue-500' : ''}`}>Received</button>
      <button onClick={() => setModeHandler("sent")} className={`mr-4 ${mode === 'sent' ? 'text-blue-500' : ''}`}>Sent</button>
      <button onClick={() => setModeHandler("blocked")} className={`mr-4 ${mode === 'blocked' ? 'text-blue-500' : ''}`}>Blocked</button>
    </div>
      {mode.current === 'sent' && results.current && <RequestsSentDisplayer requestsSentResults={results.current} setRequestsSentResults={setResults} cancelRequestAPI={cancelRequest} />}
      {mode.current === 'received' && results.current && <RequestsReceivedDisplayer requestsReceivedResults={results.current} setRequestsReceivedResults={setResults} acceptRequestAPI={acceptRequest} declineRequestAPI={declineRequest} />}
      {mode.current === 'blocked' && results.current && <BlockedUsersDisplayer blockedUsersResults={results.current} setBlockedUsersResults={setResults} unblockUserAPI={unblockUser} />}
           
      </main>
    
  );
}
