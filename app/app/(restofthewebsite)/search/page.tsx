"use client";
import SearchBar from "@/app/components/searchBar/Searchbar";
import OccupationTags from "@/app/components/occupationTags/OccupationTags";
import fetchSearchResults from "./api/search";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/app/components/ui/checkbox";

export default function Home() {
	useEffect(() => {
		document.body.classList.add("h-full");

		// Clean up function
		return () => {
			document.body.classList.remove("your-class-name");
		};
	}, []);

	const router = useRouter();
	const [currentTags, setTags] = useState([]);
	const [searchQ, setSearchQ] = useState("");
	const [searchBy, setSearchBy] = useState("name");
	const [searchResults, setSearchResults] = useState<
		{ username: string; name: string; email: string; tags: string[] }[]
	>([]);
	// Boolean value used to track if all Tags must be present in search results or not.
	const [hasOnlyTags, setHasOnlyTags] = useState(false);

	function onSearch() {
		let op = 0;

		switch (searchBy) {
			case "name":
				op = 0;
				break;
			case "email":
				op = 1;
				break;
			case "username":
				op = 2;
				break;
		}
		fetchSearchResults({
			searchQ: searchQ,
			occupationTags: currentTags,
			op: op,
			hasOnlyTags,
		}).then((res) => {
			setSearchResults(res);
		});
	}

	function onCheckBoxChange() {
		setHasOnlyTags(!hasOnlyTags);
	}

	// Create function that when a result is clicked, it will router.push to the profile, with slug as the username
	function handleResultClick(event: any) {
		// Use currentTarget, which is the div that was clicked, to get the username
		let username = event.currentTarget.dataset.username;
		router.push(`/profile/${username}`);
	}

	return (
		<main className="w-full h-full chat-height justify-center items-start px-8 py-4 z-50 bg-[#fbfcff]">
			<section className="flex flex-col rounded-lg shadow w-full h-full mr-2 p-8 bg-white">
				<div className="flex flex-col lg:flex-row justify-evenly w-full">
					<SearchBar
						searchQ={searchQ}
						setSearchQ={setSearchQ}
						searchBy={searchBy}
						setSearchBy={setSearchBy}
						onSearch={onSearch}
						placeholder={`Search`}
					/>
				</div>
				<OccupationTags
					id="occupationTags"
					inputName="occupationTags"
					currentTags={currentTags}
					setTags={setTags}
				/>
				<div className="flex flex-row items-center">
					<Checkbox
						checked={false}
						onCheckedChange={onCheckBoxChange}
					/>
					<p className="ml-2">Must Contain All Tags</p>
				</div>
				<section className="my-6">
					{searchResults.map((result, _) => (
						<div
							key={_}
							data-username={result.username}
							className="shadow bg-white rounded-lg w-full p-4 cursor-pointer"
							onClick={handleResultClick}
						>
							<h1 className="text-2xl font-bold">
								{result.name}
							</h1>
							<p className="text-xl mb-2"><i className="ri-at-line mr-2"></i>{result.username}</p>
							<p className="text-lg mb-2">
								<i className="ri-mail-line mr-2"></i>{result.email}
							</p>
							<p className="text-lg mr-2">
								{result.tags.map((tag, _) => {
									return (
										<div key={_} className="py-1.5 px-4 rounded-lg bg-[#0085ff] w-fit text-white">
											{tag}	
										</div>
									)
								})}
							</p>
						</div>
					))}
				</section>
			</section>
		</main>
	);
}
