"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const Search = () => {
  // Get the current search parameters from the URL
  const search = useSearchParams();
  // Initialize the searchQ state with the "q" parameter from the URL or null if not present
  const [searchQ, setSearchQ] = useState(search ? search.get("q") : null);

  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // Encode the search query for URL
    const encodedSearchQ = encodeURI(searchQ || "");

    // Navigate to the search page with the encoded search query
    router.push(`/search?q=${encodedSearchQ}`);

    //temporary. not needed.
    console.log("current query", encodedSearchQ);
  };
  return (
    <form className="" onSubmit={onSearch}>
      <input
        type="search"
        value={searchQ || ""}
        onChange={(event) => setSearchQ(event.target.value)}
        placeholder="Search Here"
        className="w-full p-3 rounded-lg text-black bg-white text-sm"
      />
    </form>
  );
};

export default Search;
