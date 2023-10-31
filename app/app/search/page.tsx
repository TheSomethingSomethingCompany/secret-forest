"use client"
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import {member} from "@prisma/client";

// Function to fetch data from the specified URL
const fetchInfo = async (url: string) => {
    const resp = await fetch(url);

    if (!resp.ok) {
        throw new Error('Fetch error');
    }

    return resp.json();
}

const SearchPage = () => {
    const search = useSearchParams();
    const searchQ = search ? search.get("q") : null;
    const enSearchQ = encodeURI(searchQ || "");

    // Use the useSWR hook to fetch data from the specified URL
    const {data, isLoading} = useSWR<{findInfo: Array<member>}>(
        `./api/search?q=${enSearchQ}` , // I think the issue is starting from here
        fetchInfo
        );
        
    if (!data?.findInfo){
        return null;
    }


    console.log("Search Params", enSearchQ);

    // Render the data from the response
    return <div>{data.findInfo.map((member) => (
        <div>{member.name}</div>
    ))}
    </div>

}

export default SearchPage;