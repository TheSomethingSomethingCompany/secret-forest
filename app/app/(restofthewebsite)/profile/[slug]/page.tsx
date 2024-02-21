"use client";
import OccupationTags from "@/app/components/occupationTags/OccupationTags";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import fetchUserData from "../api/fetchUserData";
import MemberFetch from "@/app/types/MemberFetch";
import Penguin from "@/app/images/ExamplePenguin.jpeg";
import updateProfileInfo from "../api/saveProfileData";
import sendRequest from "../api/sendRequest";
import acceptRequest from "../../requestsReceived/api/acceptRequest";
import declineRequest from "../../requestsReceived/api/declineRequest";
import cancelRequest from "../../requestsSent/api/cancelRequest";

  function EditProfile({params}: {params: {slug: string}}){

    const [currentTags, setTags] = useState(
      []
    );
    

    const [profile, setProfile] = useState({
      fullName: "Loading",
      userName: "Loading",
      country: "Loading",
      address: "Loading",
      biography: "Loading",
      email: "Loadig",
      currentTags: [],
    });

    const [isUser, setIsUser] = useState(false);

    const [hasRequest, setHasRequest] = useState(-1);
    const [hasChat, setHasChat] = useState(-1);

    const fetchData = async () => {

      const memberData: MemberFetch = await fetchUserData({ ...params });
      console.log(memberData);
  

      if (memberData.status == 202) {
        console.log("User found, and is the logged in user.");
        setIsUser(true);
      }
      else if(memberData.status == 200) {
        console.log("User found, but not the logged in user.");
        setIsUser(false);
      } 
      else if(memberData.status == 404) {
        console.log("User not found");
        router.push('/404');
        setIsUser(false);
      }
      else {
        console.log("Error");
        setIsUser(false);
        router.push('/404');
      }

      setHasChat(memberData.data.hasChat);
      setHasRequest(memberData.data.hasRequest);
      

      setProfile({
        fullName: memberData.data.name, 
        userName: memberData.data.username,
        country: memberData.data.country,
        address: memberData.data.address,
        biography: memberData.data.bio,
        email: memberData.data.email,
        currentTags: memberData.data.tags || [] as string[] // Add a default value for tags
      });

      setTags(memberData.data.tags);
    }



    const router = useRouter();

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
      setTags(profile.currentTags);
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
            tags: JSON.stringify(currentTags),
        };
    };


    // Handler for the Save Changes button
    async function handleSave(e: { preventDefault: () => void; }) {
      setIsEditing(false);
      tempProfile.currentTags = currentTags;
      if(tempProfile.fullName != "" && tempProfile.country != "" && tempProfile.address != "" && tempProfile.userName != "")
      {
          var response = await updateProfileInfo(formDataAsJSON());
          if(response.status == 202)
          {
              setProfile({ ...tempProfile });
              console.log("save changes: ", tempProfile);

          }
          else if (response.status == 404) {
            alert("The username you selected is already taken. Please choose a different one.")

          }
          else 
          {
           alert("Sorry, we were unable to update your profile. Please try again.")
          }
      }
      else {
        alert("Please ensure that the name, country, address, and username boxes are not left empty!");
        console.log("Something went wrong");
      }
    };


    function handleSendRequest() {
      sendRequest({username: profile.userName}).then((res) => {
        setHasRequest(1);
      });

    }

    function handleCancelRequest() {
      cancelRequest({username: profile.userName}).then((res) => {
        setHasRequest(0);
      });
    }

    function handleAcceptRequest() {
      acceptRequest({username: profile.userName}).then((res) => {
        setHasRequest(0);
        setHasChat(1);
      });
    }

    function handleDeclineRequest() {
      declineRequest({username: profile.userName}).then((res) => {
        setHasRequest(0);
      });
    }

    // Create function handle going to chat, which just redirects to the chat page
    function handleGoToChat() {
      router.push('/chats');
    }



  return (
    <div className="relative">
    <section className="m-8 flex flex-row justify-evenly border-2">
      {/*Div for the left box that displays how the user's profile will look like when people view their profile*/}
      <div className="relative flex flex-col justify-start max-w-sm border-2 border-gray-400 rounded-xl p-10">
        <img
          className="rounded-full w-72 h-72"
          src={Penguin.src}
          alt="Profile Picture"
        />
        <div className="my-4">
          <h1 className="font-bold text-4xl py-1">{profile.fullName}</h1>
          <h2 className="font-normal text-xl py-1">@ {profile.userName}</h2>
          <h2 className="font-light text-lg py-1 flex flex-row">
            <i className="ri-map-pin-line"></i>
            <p className="px-2">{profile.country}</p>
          </h2>
        </div>
        <div className="my-2">
          <h2 className="text-xl font-light py-1 break-words">{profile.currentTags.join(', ')}</h2>  
        </div>
        <div className="my-2">
          <h2 className="text-xl font-light py-1 break-words">{profile.biography}</h2>  
        </div>
        <div className="my-2">
          <h2 className="text-lg py-1 flex flex-row">
            <i className="ri-mail-line"></i>
            <p className="px-2 font-light">{profile.email}</p>
          </h2>
        </div>
      </div>

      {/*Div for the right box that allows users to edit their profile information*/}
      {isUser ? (
        <div className="flex-1 ml-4 max-w-md border-2 border-gray-400 rounded-xl p-10">
        <div className="space-y-2 min-w-64">
          {/*First Name*/}
          <div>
            <label className="font-bold text-xl mt-2">
             Name:
            </label>
            <input className="w-full border-2 border-gray-800 rounded-xl font-normal text-xl p-1 block"
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
            <input className="w-full border-2 border-gray-800 rounded-xl font-normal text-xl p-1 block"
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
            <input className="w-full border-2 border-gray-800 rounded-xl font-normal text-xl p-1 block"
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
            <input className="w-full border-2 border-gray-800 rounded-xl font-normal text-xl p-1 block"
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
            <input className="w-full border-2 border-gray-800 rounded-xl font-normal text-xl p-1 block"
              type="text"
              value={tempProfile.address}
              onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })}
              readOnly={!isEditing}
            />
          </div>
          {/*Tags*/}
          {isEditing ? (
           <div>
           <label className="font-bold text-xl mt-2">
             Tags:  
           </label>
           <OccupationTags
             id = "occupationTags"
             inputName = "occupationTags"
             currentTags = {currentTags}
             setTags = {setTags}
             inputFieldStyles = "w-full border-2 border-gray-800 rounded-xl font-normal text-xl p-1 block"
             textSize = "text-lg"
             tagColor= "bg-blue-500"
             placeHolder= "Enter tags here"/>
         </div>
         ) : (
          <div>
          <label className="font-bold text-xl mt-2">
            Tags:  
          </label>
          <h2 className="text-xl font-light py-1 break-words">{profile.currentTags.join(', ')}</h2>   
        </div>
         )}


          {/*Bio*/}
          <div>
            <label className="font-bold text-xl mt-2">
               Bio:
            </label>
            <textarea className="w-full max-h-md border-2 border-gray-800 rounded-xl font-normal text-lg p-1 mt-1 resize-none block"
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

      ) : null} 

    {/* Buttons */}
{!isUser && (
  <div>
    {hasRequest === 0 && hasChat === 0 && (
      <button 
      className="bg-blue-400 p-2 rounded-md text-white font-bold"
      onClick = {handleSendRequest}
      >
        Send Request
      </button>
    )}

    {hasRequest === 1 && hasChat === 0 && (
      <button 
      className="bg-red-400 p-2 rounded-md text-white font-bold"
      onClick = {handleCancelRequest}
      >
        Cancel Request
      </button>
    )}

    {hasRequest === 2 && hasChat === 0 && (
      <div>
        <button 
        className="bg-green-400 p-2 rounded-md text-white font-bold"
        onClick = {handleAcceptRequest}
        >
          Accept Request
        </button>
        <button 
        className="bg-red-400 p-2 rounded-md text-white font-bold"
        onClick = {handleDeclineRequest}
        >
          Decline Request
        </button>
      </div>
    )}

    {hasRequest === 0 && hasChat === 1 && (
      <div>
        <button 
        className="bg-blue-400 p-2 rounded-md text-white font-bold"
        onClick = {handleGoToChat}
        >
          Go To Chat
        </button>

      </div>
    )}

  </div>
)}
      
    
      
      
    </section>
    </div>
  );
}

export default EditProfile;


