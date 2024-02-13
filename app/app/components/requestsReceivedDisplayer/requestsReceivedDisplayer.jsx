"use client";


function requestsReceivedDisplayer({requestsReceivedResults, setRequestsReceivedResults, acceptRequestAPI, declineRequestAPI}){
/* Data is expected to be received as an array of JSON objects containing the usernames */

    function acceptRequestHandler(event){
        event.preventDefault();
        // Get the username of the user who sent the request
        const username = event.currentTarget.dataset.username;

        acceptRequestAPI({username: username});

        const newRequestsReceivedResults = requestsReceivedResults.filter((request) => request.username != username);
        setRequestsReceivedResults(newRequestsReceivedResults);
    }

    function declineRequestHandler(event){
        event.preventDefault();
        // Get the username of the user who sent the request
        const username = event.currentTarget.dataset.username;
        declineRequestAPI({username: username});

        const newRequestsReceivedResults = requestsReceivedResults.filter((request) => request.username != username);
        setRequestsReceivedResults(newRequestsReceivedResults);
    }

    

  return (
    <div className = "flex w-full flex-col items-center">
      <h1 className = "text-2xl font-bold">Requests Received</h1>
      <div className = "flex w-1/2 flex-col items-center">
      {requestsReceivedResults.map((request) => {
        return (
          <div className = "flex items-center justify-between w-full p-3 my-2 bg-white shadow-lg rounded-md">
            <div className = "w-full">
            <p className = "text-lg font-bold">Username: {request.username}</p>
            <p className = "text-lg font-bold">Name: {request.name}</p>
            <p className = "text-lg font-bold">Country: {request.country}</p>
            </div>
            <div className = "flex items-center">
                <button className = "bg-green-400 p-2 rounded-md text-white font-bold" data-username = {request.username} onClick = {acceptRequestHandler}>Accept</button>
                <button className = "bg-red-400 p-2 rounded-md text-white font-bold" data-username = {request.username} onClick = {declineRequestHandler}>Decline</button>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default requestsReceivedDisplayer;
