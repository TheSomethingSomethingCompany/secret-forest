"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import fetchUserData from "../api/fetchUserData";
import MemberFetch from "@/app/types/MemberFetch";
import Penguin from "../../images/ExamplePenguin.jpeg";
import ProfileFetch from "@/app/types/ProfileFetch";
import FetchProfileData from "../api/fetchProfileData";
import updateProfileInfo from "../api/saveProfileData";

/*function EditProfile({ params }: { params: { slug: string } }) {
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
*/
  function EditProfile({params}: {params: {slug: string}}){
    
    const userId = params.slug;

    // Temporary data for the profile
    const [profile, setProfile] = useState({
      fullName: "",
      userName: "",
      country: "",
      address: "",
      biography: "",
      email: "",
      memberId: ""


    });


    const fetchData = async () => {
      const memberData: MemberFetch = await fetchUserData({ ...params });
      console.log(memberData);
      
      const profileData: any = await FetchProfileData({
        id: memberData.data.memberID,
      });
      setProfile({
        fullName: memberData.data.name, 
        userName: memberData.data.username,
        country: profileData.data.country,
        address: profileData.data.address,
        biography: profileData.data.bio,
        email: memberData.data.email,
        memberId: memberData.data.memberID });
    }

    useEffect(() => {fetchData();}, []);
    useEffect(() => {setTempProfile({ ...profile });}, [profile]);

    
    // Temporary state to hold changes while editing
    const [tempProfile, setTempProfile] = useState({ ...profile });

    // State to track whether we're currently editing
    const [isEditing, setIsEditing] = useState(false);

    // Handler for the Edit button
    const handleEdit = () => {
      setIsEditing(true);
    };

    // Handler for the Cancel button
    const handleCancel = () => {
      setIsEditing(false);
      setTempProfile({ ...profile });
      console.log("cancel changes");
    };

    function formDataAsJSON()
    {
        console.log("check data: ", tempProfile);
        return {
            fullName: tempProfile.fullName,
            country: tempProfile.country,
            address: tempProfile.address,
            bio: tempProfile.biography,
            username: tempProfile.userName,
            email: tempProfile.email,
            id: tempProfile.memberId
        };
    };

    // Handler for the Save Changes button
    async function handleSave(e: { preventDefault: () => void; }) {
      setIsEditing(false);
  
      if(tempProfile.fullName != "" && tempProfile.country != "" && tempProfile.address != "" && tempProfile.userName != "")
      {
          var response = await updateProfileInfo(formDataAsJSON());
          if(response.status == 202)
          {
              alert("Updated Your Profile");
              setProfile({ ...tempProfile });
             console.log("save changes: ", tempProfile)
          }
          else
          {
           alert("Sorry, we were unable to update your profile. Please try again.")
          }
      }
      else {
        console.log("Something went wrong");
      }
    };


  return (
    <section className="m-8 flex flex-row justify-evenly">
      {/*Div for the left box that displays how the user's profile will look like when people view their profile*/}
      <div className="flex flex-col justify-start max-w-sm border-2 border-gray-400 rounded-xl p-10">
        <img
          className="rounded-full w-72 h-72"
          src={Penguin.src}
          alt="Profile Picture"
        />
        <div className="my-6">
          <h1 className="font-bold text-4xl py-1">{profile.fullName}</h1>
          <h2 className="font-normal text-xl py-1">@ {profile.userName}</h2>
          <h2 className="font-light text-lg py-1 flex flex-row">
            <i className="ri-map-pin-line"></i>
            <p className="px-2">{profile.country}</p>
          </h2>
        </div>
        <div className="my-2">
          <h2 className="text-xl font-light py-1">{profile.biography}</h2>
          
        </div>
        <div className="my-2">
          <h2 className="text-lg py-1 flex flex-row">
            <i className="ri-mail-line"></i>
            <p className="px-2 font-light">{profile.email}</p>
          </h2>
        </div>
      </div>

      {/*Div for the right box that allows users to edit their profile information*/}
      <div className="flex-1 ml-4 max-w-md border-2 border-gray-400 rounded-xl p-10">
        <div className="space-y-2">
          {/*First Name*/}
          <div>
            <label className="font-bold text-xl mt-2">
             Name:
            </label>
            <input className="max-w-sm border-2 border-gray-800 rounded-xl font-normal text-xl p-1"
              type="text"
              value={tempProfile.fullName}
              required
              onChange={(e) => setTempProfile({ ...tempProfile, fullName: e.target.value })}
              readOnly={!isEditing}
            />
          </div>
    
          {/*User name*/}
          <div>
            <label className="font-bold text-xl mt-2">
              User Name:  
            </label>
            <input className="max-w-sm border-2 border-gray-800 rounded-xl font-normal text-xl p-1"
              type="text"
              value={tempProfile.userName}
              onChange={(e) => setTempProfile({ ...tempProfile, userName: e.target.value })}
              readOnly={!isEditing}
            />
          </div>
          {/*Email*/}
          <div>
            <label className="font-bold text-xl mt-2">
              Email:  
            </label>
            <input className="max-w-sm border-2 border-gray-800 rounded-xl font-normal text-xl p-1"
              type="email"
              value={tempProfile.email}
              onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
              readOnly={!isEditing}
            />
          </div>

          {/*Country*/}
          <div>
            <label className="font-bold text-xl mt-2">
              Country:  
            </label>
            <input className="max-w-sm border-2 border-gray-800 rounded-xl font-normal text-xl p-1"
              type="text"
              value={tempProfile.country}
              onChange={(e) => setTempProfile({ ...tempProfile, country: e.target.value })}
              readOnly={!isEditing}
            />
          </div>
          
          {/*Address*/}
          <div>
            <label className="font-bold text-xl mt-2">
              Address:  
            </label>
            <input className="max-w-sm border-2 border-gray-800 rounded-xl font-normal text-xl p-1"
              type="text"
              value={tempProfile.address}
              onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })}
              readOnly={!isEditing}
            />
          </div>

          {/*Bio*/}
          <div>
            <label className="font-bold text-xl mt-2">
               Bio:
            </label>
            <textarea className="max-w-sm max-h-md border-2 border-gray-800 rounded-xl font-normal text-lg p-1 mt-1 resize-none"
              value={tempProfile.biography}
              onChange={(e) => setTempProfile({ ...tempProfile, biography: e.target.value })}
              readOnly={!isEditing}
              rows={5}
              cols={30}
            />
          </div>
          
          {/*Buttons*/}
         {isEditing ? (
           <div>
              <button className="py-3 my-2 w-full bg-gray-300 hover:bg-gray-100 text-gray-800 rounded-xl"
                onClick={handleCancel}>
                  Cancel
              </button>
              <button className="py-3 my-2 w-full bg-gray-800 hover:bg-gray-700 text-white rounded-xl"
                onClick={handleSave}>
                  Save Changes
              </button>
            </div>
         ) : (
            <button className="py-3 my-2 w-full bg-gray-800 hover:bg-gray-700 text-white rounded-xl" 
              onClick={handleEdit}>
                Edit Profile
            </button>
         )}
        </div>
        
        
      </div>
      
    </section>
  );
}

export default EditProfile;

