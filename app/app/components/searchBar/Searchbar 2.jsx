"use client";
import { useState } from "react";
import OccupationTags from "../occupationTags/OccupationTags";


function SearchBar({searchQ, setSearchQ, searchBy, setSearchBy, onSearch}){


  return (

    <div className = "flex items-center mobile:w-full tablet:w-3/4 h-[4rem] p-3 shadow-lg bg-white rounded-md">
    <select
      className="w-1/4 mr-5 p-2 rounded-lg text-black text-center bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
      onChange={(event) => setSearchBy(event.target.value)}
    >
      <option value="name" selected>Name</option>
      <option value="email">Email</option>
      <option value="username">Username</option>
    </select>

      <form className="mobile:w-full tablet:w-3/4 flex" onSubmit={ (event) => {event.preventDefault(); onSearch();}}>
        <input
          type="search"
          value={searchQ || ""}
          onChange={(event) => setSearchQ(event.target.value)}
          placeholder="Search..."
          className="w-full p-3 rounded-lg text-black bg-white text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-search-bar-blue"
        />
        <button type = "submit" className = "w-1/4"> <p className = "text-blue-500 p-3 font-bold">SUBMIT</p> </button>
      </form>
     
    </div>
  );
};

export default SearchBar;
