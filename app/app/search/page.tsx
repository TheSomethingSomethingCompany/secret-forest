"use client"
import SearchBar from "../components/searchBar/Searchbar";
import OccupationTags from "../components/occupationTags/OccupationTags";
import fetchSearchResults from "./api/search";
import React, { useEffect, useState } from 'react';

export default function Home() {
   
    useEffect(() => {
      document.body.classList.add('h-full');
      
      // Clean up function
      return () => {
        document.body.classList.remove('your-class-name');
      };
    }, []);


    const [currentTags, setTags] = useState([]);
    const [searchQ, setSearchQ] = useState("");
    const [searchBy, setSearchBy] = useState("name");
    const [searchResults, setSearchResults] = useState([]);

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
        fetchSearchResults({name: searchQ, occupationTags: currentTags, op: op}).then((res) => {
          setSearchResults(res);
        });
      }


  return (

    <main className = "w-full h-full flex flex-col justify-center items-center">
        <SearchBar searchQ = {searchQ} setSearchQ = {setSearchQ} searchBy = {searchBy} setSearchBy = {setSearchBy} onSearch = {onSearch}/>
        <br></br>
        <OccupationTags  id = "occupationTags" inputName = "occupationTags" inputFieldStyles = "mobile:w-full tablet:w-3/4 h-[2.5rem] rounded-md p-2 text-lg" textSize = "text-[1.25rem]" placeHolder = "Enter Tag Here. E.g, Software Engineer" tagColor = "bg-green-500" currentTags = {currentTags} setTags = {setTags}/>
    </main>
    
  );
}