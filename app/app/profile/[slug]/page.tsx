"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import fetchUserData from "../api/fetchUserData";
import MemberFetch from "@/app/types/MemberFetch";
import Penguin from "../../images/ExamplePenguin.jpeg";
import ProfileFetch from "@/app/types/ProfileFetch";
import FetchProfileData from "../api/fetchProfileData";

function EditProfile({ params }: { params: { slug: string } }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [biography, setBiography] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [country, setCountry] = useState("");

  const router = useRouter();
  useEffect(() => {
    const memberData = fetchData();
  });

  const fetchData = async () => {
    const memberData: MemberFetch = await fetchUserData({ ...params });
    console.log(memberData);
    setName(memberData.data.name);
    setEmail(memberData.data.email);
    setUsername(memberData.data.username);
    const profileData: ProfileFetch = await FetchProfileData({
      id: memberData.data.memberID,
    });
    setBiography(profileData.data.bio);
    setCountry(profileData.data.country);
  };

  return (
    <section className="m-8 flex flex-row justify-evenly">
      <div className="flex flex-col justify-start max-w-sm border-2 border-gray-400 rounded-xl p-10">
        <img
          className="rounded-full w-72 h-72"
          src={Penguin.src}
          alt="Profile Picture"
        />
        <div className="my-6">
          <h1 className="font-bold text-4xl py-1">{name}</h1>
          <h2 className="font-normal text-xl py-1">@{username}</h2>
          <h2 className="font-light text-lg py-1 flex flex-row">
            <i className="ri-map-pin-line"></i>
            <p className="px-2">{country}</p>
          </h2>
        </div>
        <div className="my-2">
          <h2 className="text-xl font-light py-1">{biography}</h2>
          <button className="py-3 my-2 w-full bg-gray-800 hover:bg-gray-700 text-white rounded-xl">
            Edit Profile
          </button>
        </div>
        <div className="my-2">
          <h2 className="text-lg py-1 flex flex-row">
            <i className="ri-mail-line"></i>
            <p className="px-2 font-light">{email}</p>
          </h2>
        </div>
      </div>
      <div className="flex-1 ml-4 border-2 border-gray-400 rounded-xl p-10">
        Hello World!
      </div>
      {/* <h2 className="">{email}</h2> */}
    </section>
  );
}

export default EditProfile;
