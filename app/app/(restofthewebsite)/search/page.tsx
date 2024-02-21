"use client"
import SearchBar from "@/app/components/searchBar/Searchbar";
import OccupationTags from "@/app/components/occupationTags/OccupationTags";
import fetchSearchResults from "./api/search";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
   
    useEffect(() => {
      document.body.classList.add('h-full');
      
      // Clean up function 
      return () => {
        document.body.classList.remove('your-class-name');
      };

    }, []);

    const router = useRouter();
    const [currentTags, setTags] = useState([]);
    const [searchQ, setSearchQ] = useState("");
    const [searchBy, setSearchBy] = useState("name");
    const [searchResults, setSearchResults] = useState([]);
    // Boolean value used to track if all Tags must be present in search results or not.
    const[hasOnlyTags, setHasOnlyTags] = useState(false);

    function onSearch(){
      let op= 0;

      switch(searchBy){
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
        fetchSearchResults({searchQ: searchQ, occupationTags: currentTags, op: op, hasOnlyTags}).then((res) => {
          setSearchResults(res);
        });
    }

      function onCheckBoxChange(){
        setHasOnlyTags(!hasOnlyTags);
      }

      // Create function that when a result is clicked, it will router.push to the profile, with slug as the username
        function handleResultClick(event){
        // Use currentTarget, which is the div that was clicked, to get the username
        let username = event.currentTarget.dataset.username;
         router.push(`/profile/${username}`);
        }


  return (

    <main className = "w-full h-full flex flex-col justify-center items-center">
        <SearchBar searchQ = {searchQ} setSearchQ = {setSearchQ} searchBy = {searchBy} setSearchBy = {setSearchBy} onSearch = {onSearch}/>
        <br></br>
        <OccupationTags  id = "occupationTags" inputName = "occupationTags" inputFieldStyles = "mobile:w-full tablet:w-3/4 h-[2.5rem] rounded-md p-2 text-lg" textSize = "text-[1.25rem]" placeHolder = "Enter Tag Here. E.g, Software Engineer" tagColor = "bg-green-500" currentTags = {currentTags} setTags = {setTags}/>
        <div className = "flex"><input type = "checkbox" onChange = {onCheckBoxChange} className = "ml-5"></input><p>Must Contain All Tags</p></div>
        {searchResults.map((result, index) => (
        <div key={index} data-username = {result.username}  className="result-card bg-white shadow-md rounded-lg p-6 m-4 w-full md:w-1/2 lg:w-1/3 hover:cursor-pointer hover:shadow-xl hover:bg-gray-200" onClick = {handleResultClick}>
          <h2 className="text-2xl font-bold mb-2">Username: {result.username}</h2>
          <p className="text-lg mb-2">Email: {result.email}</p>
          <p className="text-lg mb-2">Name: {result.name}</p>
          <p className="text-lg">Tags: {result.tags.join(', ')}</p>
        </div>
))}
    </main>
    
  );
}