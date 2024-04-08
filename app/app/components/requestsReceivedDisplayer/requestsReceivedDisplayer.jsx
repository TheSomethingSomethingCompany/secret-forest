"use client";


function requestsReceivedDisplayer({requestsReceivedResults, setRequestsReceivedResults, acceptRequestAPI, declineRequestAPI}){
/* Data is expected to be received as an array of JSON objects containing the usernames */

    function acceptRequestHandler(event){
        event.preventDefault();
        // Get the username of the user who sent the request
        const username = event.currentTarget.dataset.username;

        acceptRequestAPI({username: username});

     //   const newRequestsReceivedResults = requestsReceivedResults.filter((request) => request.username != username);
      //  console.log("NEW REQUESTS RECEIVED RESULTS: ", newRequestsReceivedResults);
       // setRequestsReceivedResults(newRequestsReceivedResults);
    }

    function declineRequestHandler(event){
        event.preventDefault();
        // Get the username of the user who sent the request
        const username = event.currentTarget.dataset.username;
        declineRequestAPI({username: username});

        //const newRequestsReceivedResults = requestsReceivedResults.filter((request) => request.username != username);
        //setRequestsReceivedResults(newRequestsReceivedResults);
    }

    


	return (
		<div className="flex w-full flex-col items-center overflow-y-scroll ">
			{requestsReceivedResults.map((request) => {
				return (
					<div className="w-full shadow-xl border-[1px] my-1 bg-white rounded-lg px-4 py-4">
						<h1 className="font-bold text-2xl py-1">
							@ {request.username}
						</h1>
						<h2 className="font-normal text-lg py-1">
							@ {request.username}
						</h2>
						<h2 className="font-light text-lg py-1 flex flex-row">
							<i className="ri-map-pin-line"></i>
							<p className="px-2">{request.country}</p>
						</h2>
						<h2 className="text-lg py-1 flex flex-row">
							<i className="ri-mail-line"></i>
							<p className="px-2 font-light">{request.email}</p>
						</h2>
						<div className="flex flex-row">
							<button
								className="bg-green-500 hover:bg-green-600 p-2 rounded-md text-white font-bold my-2"
								data-username={request.username}
								onClick={acceptRequestHandler}
							>
								Accept
							</button>
							<button
								className="bg-red-500 hover:bg-red-600 p-2 rounded-md text-white font-bold my-2"
								data-username={request.username}
								onClick={declineRequestHandler}
							>
								Decline
							</button>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default requestsReceivedDisplayer;

