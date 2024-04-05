"use client";
import RequestsSentDisplayer from "@/app/components/requestsSentDisplayer/RequestsSentDisplayer";
import RequestsReceivedDisplayer from "@/app/components/requestsReceivedDisplayer/RequestsReceivedDisplayer";
import BlockedUsersDisplayer from "@/app/components/blockedUsersDisplayer/blockedUsersDisplayer";
import SearchBar from "@/app/components/searchBar/SearchBar";
import fetchRequestsSent from "./api/fetchRequestsSent";
import cancelRequest from "./api/cancelRequest";
import fetchRequestsReceived from "./api/fetchRequestsReceived";
import acceptRequest from "./api/acceptRequest";
import declineRequest from "./api/declineRequest";
import fetchBlockedUsers from "./api/fetchBlockedUsers";
import unblockUser from "./api/unblockUser";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import SearchPeople from "@/public/SearchPeople.svg";

export default function Home() {
	useEffect(() => {
		document.body.classList.add("h-full");

		// Clean up function
		return () => {
			document.body.classList.remove("your-class-name");
		};
	}, []);

	// We need to make an api call to fetch the requests sent by the user.
	const results = useRef(null);
	const mode = useRef("sent");
	const [searchQ, setSearchQ] = useState("");
	const [searchBy, setSearchBy] = useState("name");
	const [rerender, setRerender] = useState(false);

	function fetchResultsByMode({ searchQ: searchQ, op: op }) {
		switch (mode.current) {
			case "received":
				fetchRequestsReceived({ searchQ: searchQ, op: op }).then(
					(res) => {
						results.current = res;
						setRerender((prev) => !prev);
					}
				);
				break;
			case "sent":
				fetchRequestsSent({ searchQ: searchQ, op: op }).then((res) => {
					results.current = res;
					setRerender((prev) => !prev);
				});
				break;
			case "blocked":
				fetchBlockedUsers({ searchQ: searchQ, op: op }).then((res) => {
					results.current = res;
					setRerender((prev) => !prev);
				});
				break;
		}
	}

	useEffect(() => {
		fetchResultsByMode({ searchQ: "", op: 0 });
	}, []);

	function onSearch() {
		let op = 0;
		if (searchBy === "name") {
			op = 0;
		} else if (searchBy === "email") {
			op = 1;
		} else if (searchBy === "username") {
			op = 2;
		}
		fetchResultsByMode({ searchQ: searchQ, op: op });
	}

	function setModeHandler(newMode) {
		results.current = null; // Clear the results and show a loading spinner or something
		mode.current = newMode;
		fetchResultsByMode({ searchQ: "", op: 0 });
	}

	function setResults(data) {
		results.current = data;
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
								cancelRequestAPI={cancelRequest}
							/>
						)}
						{mode.current === "received" && results.current && (
							<RequestsReceivedDisplayer
								requestsReceivedResults={results.current}
								setRequestsReceivedResults={setResults}
								acceptRequestAPI={acceptRequest}
								declineRequestAPI={declineRequest}
							/>
						)}
						{mode.current === "blocked" && results.current && (
							<BlockedUsersDisplayer
								blockedUsersResults={results.current}
								setBlockedUsersResults={setResults}
								unblockUserAPI={unblockUser}
							/>
						)}
					</div>
				</div>
			</section>
		</main>
	);
}
