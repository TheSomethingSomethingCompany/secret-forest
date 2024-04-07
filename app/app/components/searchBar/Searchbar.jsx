"use client";
import { useState } from "react";
import OccupationTags from "../occupationTags/OccupationTags";

function SearchBar({ searchQ, setSearchQ, searchBy, setSearchBy, onSearch, placeholder = "Search for Requests..." }) {
	return (
		<div className="flex-1 flex flex-col lg:flex-row w-full my-2 bg-transparent">
			<div className="flex flex-row justify-between items-center py-4 px-4 bg-[#1F2932] rounded-lg my-2 lg:my-0 lg:mr-2">
				<p className="font-semibold text-white py-2 lg:py-0 px-4">Search By:</p>
				<select
					className="bg-[#1F2932] text-white hover:text-white"
					onChange={(event) => setSearchBy(event.target.value)}
				>
					<option value="name" defaultValue={true}>
						Name
					</option>
					<option value="email">Email</option>
					<option value="username">Username</option>
				</select>
			</div>

			<form
				className="flex-1 flex flex-row items-center py-2 lg:py-0 px-4 bg-[#1F2932] rounded-lg  my-2 lg:my-0"
				onSubmit={(event) => {
					event.preventDefault();
					onSearch();
				}}
			>
				<input
					type="search"
					value={searchQ || ""}
					onChange={(event) => setSearchQ(event.target.value)}
					placeholder={placeholder}
					className="text-white px-2 outline-none focus:outline-none bg-[#1F2932] flex-1"
				/>
				<button type="submit">
					<i className="ri-send-plane-2-line text-white"></i>
				</button>
			</form>
		</div>
	);
}

export default SearchBar;
