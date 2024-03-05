"use client";


function BlockedUsersDisplayer({blockedUsersResults, setBlockedUsersResults, unblockUserAPI}){
/* Data is expected to be received as an array of JSON objects containing the usernames */


    function unblockUserHandler(event){
        event.preventDefault();
        // Get the username of the user who sent the request
        const username = event.currentTarget.dataset.username;
        unblockUserAPI({username: username});

        const newBlockedUsersResults = blockedUsersResults.filter((blockedUser) => blockedUser.username != username);
        setBlockedUsersResults(newBlockedUsersResults);
    }

    

  return (
    <div className = "flex w-full flex-col items-center">
      <h1 className = "text-2xl font-bold">Users You Have Blocked</h1>
      <div className = "flex w-1/2 flex-col items-center">
      {blockedUsersResults.map((blockedUser) => {
        return (
          <div className = "flex items-center justify-between w-full p-3 my-2 bg-white shadow-lg rounded-md">
            <div className = "w-full">
            <p className = "text-lg font-bold">Username: {blockedUser.username}</p>
            <p className = "text-lg font-bold">Name: {blockedUser.name}</p>
            <p className = "text-lg font-bold">Country: {blockedUser.country}</p>
            </div>
            <div className = "flex items-center">
                <button className = "bg-blue-400 p-2 rounded-md text-white font-bold" data-username = {blockedUser.username} onClick = {unblockUserHandler}>Unblock</button>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default BlockedUsersDisplayer;
