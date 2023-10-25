"use client";
import OccupationTags from '../occupationTags/OccupationTags'
import defaultProfilePicture from '../../images/defaultProfilePicture.jpg'
import editIcon from '../../images/pencil-solid.svg'
import {useState, useEffect} from "react"

import Image from "next/image"

function CreateProfileForm() {
    // Inside CreateProfileForm component

    const [currentTags, setTags] = useState([]); /* Send this as a reference to OccupationTags */
    /* OccupationTags will be able to modify currentTags as needed, but CreateProfileForm has access to it */
    /* Given that currentTags is an object, any change to it in OccupationTags will be reflected in memory */

    function handleSubmit(event) {
        event.preventDefault();
    
        const formData = new FormData();
        
        // Collect all form fields
        formData.append('fullName', event.target.fullName.value);
        formData.append('country', event.target.country.value);
        formData.append('address', event.target.address.value);
        formData.append('bio', event.target.bio.value);
        formData.append('occupationTags', JSON.stringify(currentTags)); // Send tags as a JSON string
        
        // Collect image data
        const imageInput = document.querySelector('#pfp');
        if (imageInput.files[0]) {
            formData.append('profileImage', imageInput.files[0]);
        }
    };

    

    return (

        <form action="" method="post" className="relative overflow-y-auto w-full h-screen" onSubmit={handleSubmit}>
        
                <div className = "flex w-screen h-[100vh] overflow-y-auto bg-gradient-to-r from-blue-500 to-green-500">
                    <div id = "labels-and-inputs-container" className = "flex h-[100vh] w-1/2 flex-col items-center"> {/* Ensures the labels div and the inputs div are side-by-side */}
                        <div className = "w-3/4 mb-10 mt-20"><h1 className = "text-[5vw] font-semibold">Create Your Profile</h1> </div>
                        <FlexLabelAndTextInput labelVal = "Full Name:" inputName = "fullName" required = {true}/> 
                        <FlexLabelAndTextInput labelVal = "Country Of Residence:" inputName="country" required = {true} /> 
                        <FlexLabelAndTextInput labelVal = "Address:" inputName = "address" required = {true}  /> 
                        <FlexLabelAndOtherInput labelVal = "Occupation Tags:"> <OccupationTags inputWidth = "w-3/4" inputHeight="h-[4vw] max-h-[45px]" cornerDesign = "rounded-md" textSize = "text-xl" tagColor = "bg-green-500" currentTags = {currentTags} setTags = {setTags}/></FlexLabelAndOtherInput> 
                        <FlexLabelAndOtherInput labelVal = "Bio:"> <textarea className = "text-black w-3/4 h-[18vw] rounded-md text-xl" name = "bio"> </textarea> </FlexLabelAndOtherInput> 
                      
                    </div>
                    <div id = "pfp-container" className = "w-1/2 h-full flex flex-col items-center">
                        <div className = "w-3/4 mb-10 mt-20 flex justify-center"><h1 className = "text-[5vw] font-semibold">Add A Profile Picture</h1> </div>
                        <ProfilePicture></ProfilePicture>
                    </div>
                 </div>
                
                <div id = "form-buttons" className = "flex justify-between w-full">
                    <button id="go-back" className = "bg-purple-500">Go Back</button>
                    <input type="submit" className = "bg-purple-500 hover:cursor-pointer" value="Submit" />
                </div>
            </form>
           

    );
}

function FlexLabelAndOtherInput(props){
    return(
    <div className = "w-3/4 mt-10 mb-10 flex flex-col"> {/* Flex box ensures that the occupation tags can keep growing while pushing down the bio*/}
            <label className = "text-[1.5vw]">{props.labelVal}</label>
            <br></br>
            {props.children}
        </div>);
}

function FlexLabelAndTextInput(props){
    return(
        <div className = "w-3/4 mt-10 mb-10">
            <label className="text-[1.5vw]"> {props.labelVal} {props.required && <span className = "text-red-500"> * </span> } </label>
            <br></br>
            <input type = "text" className = "text-black w-3/4 h-[4vw] max-h-[45px] rounded-md text-xl" name = {props.inputName} required = {props.required}></input>
        </div>);

    }

    function ProfilePicture() {
        const [image, setImage] = useState(defaultProfilePicture);
    
        const handleImageChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImage(reader.result);
                };
                reader.readAsDataURL(file);
            }
        };
    
        
    
        return (
            <div id="edit-pfp" className="w-full h-fullpx flex flex-col justify-center items-center">
                <div className="relative w-[20vw] h-[20vw]" style = { {maxWidth: '300px', maxHeight: '300px'} }>
                    <Image src={image} alt="Profile Preview" layout="fill" objectFit="cover" className="rounded-full" />
                </div>
                <div id = "edit-button-container" className = "relative w-[2vw] h-[2vw] max-h-[70px] max-w-[70px]">
                <button><Image src = {editIcon} layout = "fill" objectFit = "cover" alt = ""></Image></button>
                </div>
                <input id="pfp" type="file" accept="image/*" onChange={handleImageChange} className = "hidden" />
            </div>
        );
    }
    

export default CreateProfileForm;