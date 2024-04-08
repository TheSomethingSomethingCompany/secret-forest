
"use client"
import RequestsSentDisplayer from "../../components/requestsSentDisplayer/RequestsSentDisplayer";
import RequestsReceivedDisplayer from "../../components/requestsReceivedDisplayer/RequestsReceivedDisplayer";
import BlockedUsersDisplayer from "../../components/blockedUsersDisplayer/BlockedUsersDisplayer";
import SearchBar from "../../components/searchBar/SearchBar";
import fetchRequestsSent from "./api/fetchRequestsSent";
import cancelRequest from "./api/cancelRequest";
import fetchRequestsReceived from "./api/fetchRequestsReceived";
import acceptRequest from "./api/acceptRequest";
import declineRequest from "./api/declineRequest";
import fetchBlockedUsers from "./api/fetchBlockedUsers";
import unblockUser from "./api/unblockUser";
import React, { useEffect, useState, useRef} from 'react';
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/app/contexts/WebSocketContext";
import SearchPeople from "../../../public/SearchPeople.svg";
import Image from 'next/image';


export default function Home() {
   


    // We need to make an api call to fetch the requests sent by the user.
    const {userStatus, sendMessage} = useWebSocket();
    const router = useRouter();
    const results = useRef(null);
    const mode = useRef("received");
    const [searchQ, setSearchQ] = useState("");
    const [searchBy, setSearchBy] = useState("name");
    const [rerender, setRerender] = useState(false);


    useEffect(() => {
      sendMessage("sessionCheck")
    }, []);

    useEffect(() => {
        if(userStatus === "signedOut")
        {
         // router.push("/");
        }
    }, [userStatus]);
    

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
                      alert("Failed to retrieve received requests, please try again by refreshing the page.");
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
                      alert("Failed to retrieve sent requests, please try again by refreshing the page.")
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
                      alert("Failed to retrieve blocked users, please try again by refreshing the page.");
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



	function setResults(data) {
		results.current = data;
	}


    function acceptRequestAndRefresh(data)
    {
        acceptRequest(data).then((res) => {
          switch(res.status){
            case 201:
              fetchResultsByMode({searchQ: searchQ, searchBy: searchBy});
              break;
            case 500:
              alert("Failed to accept request, please try again by refreshing the page.");
              break;
          }
        });
    }

    function declineRequestAndRefresh(data)
    {
        declineRequest(data).then((res) => {
          switch(res.status){
            case 201:
              fetchResultsByMode({searchQ: searchQ, searchBy: searchBy});
              break;
            case 500:
              alert("Failed to decline request, please try again by refreshing the page.");
              break;
          }
        });
    }

    function cancelRequestAndRefresh(data)
    {
        cancelRequest(data).then((res) => {
          switch(res.status){
            case 201:
              fetchResultsByMode({searchQ: searchQ, searchBy: searchBy});
              break;
            case 500:
              alert("Failed to cancel request, please try again by refreshing the page.");
              break;
          }
        });
    }

    function unblockUserAndRefresh(data)
    {
        unblockUser(data).then((res) => {
          switch(res.status){
            case 201:
              fetchResultsByMode({searchQ: searchQ, searchBy: searchBy});
              break;
            case 500:
              alert("Failed to unblock user, please try again by refreshing the page.");
              break;
          }
        });
    }



	return (
		<main
			className="w-full h-full chat-height justify-center items-start px-8 py-4 z-50"
			style={{
				"--requests-color":
					mode.current === "received" ? "#0094FF" : "#1F2932",
				"--sent-color": mode.current === "sent" ? "#0094FF" : "#1F2932",
				"--blocked-color":
					mode.current === "blocked" ? "#0094FF" : "#1F2932",
				"--hover-requests-color":
					mode.current === "received" ? "#0079d1" : "#2c3b48",
				"--hover-sent-color":
					mode.current === "sent" ? "#0079d1" : "#2c3b48",
				"--hover-blocked-color":
					mode.current === "blocked" ? "#0079d1" : "#2c3b48",
			}}
		>
			<section className="flex flex-col rounded-lg shadow w-full h-full mr-2 p-8">
				<div className="flex flex-col lg:flex-row justify-evenly w-full">
					<div className="lg:mx-2 w-full lg:w-auto flex flex-row my-2">
						<button
							className="w-full font-semibold px-4 py-2 bg-[--requests-color] hover:bg-[--hover-requests-color] rounded-l-lg text-white"
							onClick={() => setModeHandler("received")}
						>
							Requests
						</button>
						<button
							className="w-full font-semibold px-4 py-2 bg-[--sent-color] hover:bg-[--hover-sent-color] text-white"
							onClick={() => setModeHandler("sent")}
						>
							Sent
						</button>
						<button
							className="w-full font-semibold px-4 py-2 bg-[--blocked-color] hover:bg-[--hover-blocked-color] rounded-r-lg text-white"
							onClick={() => setModeHandler("blocked")}
						>
							Blocked
						</button>
					</div>


					<SearchBar
						searchQ={searchQ}
						setSearchQ={setSearchQ}
						searchBy={searchBy}
						setSearchBy={setSearchBy}
						onSearch={onSearch}
					/>

				</div>
				<div className="lg:p-4 flex flex-row flex-1 justify-between w-full overflow-y-hidden bg-white">
					<div className="hidden lg:flex flex-col justify-center items-center h-full p-8">
						<Image
							src={SearchPeople}
							width={300}
							height={300}
							alt="Search People"
						/>
					</div>
					<div className="flex-1 overflow-y-scroll">
						{mode.current === "sent" && results.current && (
							<RequestsSentDisplayer
								requestsSentResults={results.current}
								setRequestsSentResults={setResults}
								cancelRequestAPI={cancelRequestAndRefresh}
							/>
						)}
						{mode.current === "received" && results.current && (
							<RequestsReceivedDisplayer
								requestsReceivedResults={results.current}
								setRequestsReceivedResults={setResults}
								acceptRequestAPI={acceptRequestAndRefresh}
								declineRequestAPI={declineRequestAndRefresh}
							/>
						)}
						{mode.current === "blocked" && results.current && (
							<BlockedUsersDisplayer
								blockedUsersResults={results.current}
								setBlockedUsersResults={setResults}
								unblockUserAPI={unblockUserAndRefresh}
							/>
						)}
					</div>
				</div>
			</section>
		</main>
	);

}
