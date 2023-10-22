"use client";
import OccupationTags from '../occupationTags/OccupationTags'
import defaultProfilePicture from '../../images/defaultProfilePicture.jpg'
import {useState} from "react"

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

            <form action="" method="post" className = "w-3/4 h-3/4 flex flex-col bg-red-500" onSubmit={handleSubmit}>

                <div className = "w-full flex justify-center"><h1 className = "text-[5vh]">Create Profile</h1></div>
                <div className = "flex flex-grow w-full h-full">
                    <div id = "labels-and-inputs-container" className = "flex h-full w-1/2 flex-col "> {/* Ensures the labels div and the inputs div are side-by-side */}
                        <FlexLabelAndTextInput labelVal = "Full Name" inputName = "fullName"/> 
                        <FlexLabelAndTextInput labelVal = "Country Of Residence" inputName="country"/> 
                        <FlexLabelAndTextInput labelVal = "Address" inputName = "address"/> 
                        <FlexLabelAndOtherInput labelVal = "Occupation Tags"> <OccupationTags currentTags = {currentTags} setTags = {setTags}/></FlexLabelAndOtherInput> 
                        <FlexLabelAndOtherInput labelVal = "Bio"> <textarea className = "text-black w-1/2 h-[18vh] resize-y" name = "bio"> </textarea> </FlexLabelAndOtherInput> 
                    </div>
                    <ProfilePicture></ProfilePicture>
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
        <div className = "flex-grow w-full bg-yellow-500">
            <label className = "text-lg">{props.labelVal}</label>
            <br></br>
            {props.children}
        </div>);
}

function FlexLabelAndTextInput(props){
    return(
        <div className = "flex-grow w-full bg-yellow-500">
            <label className="text-lg"> {props.labelVal} </label>
            <br></br>
            <input type = "text" className = "text-black w-1/2" name = {props.inputName}></input>
        </div>);

    }

function ProfilePicture(){
    const [image, setImage] = useState(defaultProfilePicture);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader(); /**  */
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    return(
        <div id = "edit-pfp" className = "w-1/2 h-full flex flex-col justify-center items-center bg-orange-500">
            <img src={image} alt="Profile Preview" className="rounded-full w-[20vw] h-[20vw] object-cover mb-4"/>
            <input id = "pfp" type="file" accept="image/*" onChange={handleImageChange}/>
        </div>
    );
}

export default CreateProfileForm;