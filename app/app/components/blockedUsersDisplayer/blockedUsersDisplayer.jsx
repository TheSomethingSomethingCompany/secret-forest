"use client";



function BlockedUsersDisplayer({blockedUsersResults, setBlockedUsersResults, unblockUserAPI}){
/* Data is expected to be received as an array of JSON objects containing the usernames */


    function unblockUserHandler(event){
        event.preventDefault();
        // Get the username of the user who sent the request
        const username = event.currentTarget.dataset.username;
        unblockUserAPI({username: username});

        //const newBlockedUsersResults = blockedUsersResults.filter((blockedUser) => blockedUser.username != username);
        //setBlockedUsersResults(newBlockedUsersResults);
    }

    
	return (
		<div className="flex w-full flex-col items-center overflow-y-scroll">
			{blockedUsersResults.map((blockedUser) => {
				return (
					<div className="w-full shadow-xl border-[1px] my-1 bg-white rounded-lg px-4 py-4">
						<h1 className="font-bold text-2xl py-1">
							@ {blockedUser.username}
						</h1>
						<h2 className="font-normal text-lg py-1">
							@ {blockedUser.username}
						</h2>
						<h2 className="font-light text-lg py-1 flex flex-row">
							<i className="ri-map-pin-line"></i>
							<p className="px-2">{blockedUser.country}</p>
						</h2>
						<h2 className="text-lg py-1 flex flex-row">
							<i className="ri-mail-line"></i>
							<p className="px-2 font-light">
								{blockedUser.email}
							</p>
						</h2>
						<button
							className="bg-red-500 hover:bg-red-600 p-2 rounded-md text-white font-bold my-2"
							data-username={blockedUser.username}
							onClick={unblockUserHandler}
						>
							Unblock
						</button>
					</div>
				);
			})}
		</div>
	);
};

export default BlockedUsersDisplayer;

