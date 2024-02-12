"use client";


function requestsSentDisplayer({requestsSentResults}){
/* Data is expected to be received as an array of JSON objects containing the usernames */

  return (
    <div className = "flex flex-col items-center">
      <h1 className = "text-2xl font-bold">Requests Sent</h1>
      <div className = "flex flex-col items-center">
      {requestsSentResults.map((request) => {
        return (
          <div className = "flex items-center justify-between w-3/4 p-3 my-2 bg-white shadow-lg rounded-md">
            <p className = "text-lg font-bold">{request.username}</p>
            <p className = "text-lg font-bold">{request.name}</p>
            <p className = "text-lg font-bold">{request.country}</p>
            <div className = "flex items-center">
              <button className = "bg-red-400 p-2 rounded-md text-white font-bold">Cancel</button>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default requestsSentDisplayer;
