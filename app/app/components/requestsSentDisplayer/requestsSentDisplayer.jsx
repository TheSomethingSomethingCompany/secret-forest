"use client";


function requestsSentDisplayer({requestsSentResults, setRequestsSentResults, cancelRequestAPI}){
/* Data is expected to be received as an array of JSON objects containing the usernames */

    function cancelRequestHandler(event){
        event.preventDefault();
        // Get the username of the user who sent the request
        const username = event.currentTarget.dataset.username;
        // Send the username to the server to cancel the request
        cancelRequestAPI({username: username});

        //Next, remove the request from the list of requests sent
        //const newRequestsSentResults = requestsSentResults.filter((request) => request.username != username);
        //setRequestsSentResults(newRequestsSentResults);
    }

	return (
		<div className="flex w-full flex-col items-center overflow-y-scroll ">
			{requestsSentResults.map((request) => {
				return (
					<div className="w-full shadow-xl border-[1px] my-1 bg-white rounded-lg px-4 py-4">

						<h1 className="font-bold text-2xl py-1">
							{request.name}
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
							<p className="px-2 font-light">
								{request.email}
							</p>
						</h2>

						<button
							className="bg-red-500 hover:bg-red-600 p-2 rounded-md text-white font-bold my-2"
							data-username={request.username}
							onClick={cancelRequestHandler}
						>
							Cancel Request	
						</button>
					</div>
				);
			})}
		</div>
	);
};

export default requestsSentDisplayer;

