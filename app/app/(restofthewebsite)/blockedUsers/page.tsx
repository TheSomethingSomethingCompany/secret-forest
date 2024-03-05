"use client"
import BlockedUsersDisplayer from "@/app/components/blockedUsersDisplayer/blockedUsersDisplayer";
import SearchBar from "@/app/components/searchBar/SearchBar";
import fetchBlockedUsers from "./api/fetchBlockedUsers";
import unblockUser from "./api/unblockUser";
import React, { useEffect, useState} from 'react';

export default function Home() {
   
    useEffect(() => {
      document.body.classList.add('h-full');
      
      // Clean up function
      return () => {
        document.body.classList.remove('your-class-name');
      };
    }, []);


    const [blockedUsersResults, setBlockedUsersResults] = useState([]);
    const [searchQ, setSearchQ] = useState("");
    const [searchBy, setSearchBy] = useState("name");


    useEffect(() => {
      fetchBlockedUsers({searchQ: "", op: 0}).then((res) => {
          setBlockedUsersResults(res);
        });
    }, []);


    function onSearch(){
      let op = 0;
      if(searchBy === "name"){
        op = 0;
      } else if(searchBy === "email"){
        op = 1;
      } else if(searchBy === "username"){
        op = 2;
      }

      fetchBlockedUsers({searchQ: searchQ, op: op}).then((res) => {
        if(res === null){
            res = [];
            alert("error fetching blocked users. Please try again.")
        }

        setBlockedUsersResults(res);
      });

    }
     

  return (

    <main className = "w-full h-full flex flex-col items-center">
      <SearchBar searchQ = {searchQ} setSearchQ = {setSearchQ} searchBy = {searchBy} setSearchBy = {setSearchBy} onSearch = {onSearch} />
      <BlockedUsersDisplayer blockedUsersResults={blockedUsersResults} setBlockedUsersResults = {setBlockedUsersResults} unblockUserAPI={unblockUser}/>
    </main>
    
  );
}
