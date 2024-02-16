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
        const newRequestsSentResults = requestsSentResults.filter((request) => request.username != username);
        setRequestsSentResults(newRequestsSentResults);
    }

  return (
    <div className = "flex w-full flex-col items-center">
      <h1 className = "text-2xl font-bold">Requests Sent</h1>
      <div className = "flex w-1/2 flex-col items-center">
      {requestsSentResults.map((request) => {
        return (
          <div className = "flex items-center justify-between w-full p-3 my-2 bg-white shadow-lg rounded-md">
            <div className = "w-full">
            <p className = "text-lg font-bold">Username: {request.username}</p>
            <p className = "text-lg font-bold">Name: {request.name}</p>
            <p className = "text-lg font-bold">Email: {request.email}</p>
            <p className = "text-lg font-bold">Country: {request.country}</p>
            </div>
            <div className = "flex items-center">
              <button className = "bg-red-400 p-2 rounded-md text-white font-bold" data-username = {request.username} onClick = {cancelRequestHandler}>Cancel</button>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default requestsSentDisplayer;
