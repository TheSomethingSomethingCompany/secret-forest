"use client";


function requestsReceivedDisplayer({requestsReceivedResults}){
/* Data is expected to be received as an array of JSON objects containing the usernames, names, country */

// Display the requests received by the user by the username, name, and country of the user who sent the request
    return (
        <div className = "flex flex-col items-center">
        <h1 className = "text-2xl font-bold">Requests Received</h1>
        <div className = "flex flex-col items-center">
        {requestsReceivedResults.map((request) => {
            return (
            <div className = "flex items-center justify-between w-3/4 p-3 my-2 bg-white shadow-lg rounded-md">
                <p className = "text-lg font-bold">{request.username}</p>
                <p className = "text-lg font-bold">{request.name}</p>
                <p className = "text-lg font-bold">{request.country}</p>
                <div className = "flex items-center">
                <button className = "bg-green-400 p-2 rounded-md text-white font-bold">Accept</button>
                <button className = "bg-red-400 p-2 rounded-md text-white font-bold">Decline</button>
                </div>
            </div>
            );
        })}
        </div>
        </div>
    );

};

export default requestsReceivedDisplayer;
