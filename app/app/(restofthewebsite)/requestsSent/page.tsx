"use client"
import RequestsSentDisplayer from "@/app/components/requestsSentDisplayer/RequestsSentDisplayer";
import SearchBar from "@/app/components/searchBar/SearchBar";
import fetchRequestsSent from "./api/fetchRequestsSent";
import cancelRequest from "./api/cancelRequest";
import React, { useEffect, useState} from 'react';

export default function Home() {
   
    useEffect(() => {
      document.body.classList.add('h-full');
      
      // Clean up function
      return () => {
        document.body.classList.remove('your-class-name');
      };
    }, []);

    // We need to make an api call to fetch the requests sent by the user.
    const [requestsSentResults, setRequestsSentResults] = useState([]);
    const [searchQ, setSearchQ] = useState("");
    const [searchBy, setSearchBy] = useState("name");


    useEffect(() => {
      fetchRequestsSent({searchQ: "", op: 0}).then((res) => {
          setRequestsSentResults(res);
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

      fetchRequestsSent({searchQ: searchQ, op: op}).then((res) => {
        setRequestsSentResults(res);
      });

    }
     

  return (

    <main className = "w-full h-full flex flex-col items-center">
      <SearchBar searchQ = {searchQ} setSearchQ = {setSearchQ} searchBy = {searchBy} setSearchBy = {setSearchBy} onSearch = {onSearch} />
      <RequestsSentDisplayer requestsSentResults={requestsSentResults} setRequestsSentResults = {setRequestsSentResults} cancelRequestAPI = {cancelRequest} />
    </main>
    
  );
}
