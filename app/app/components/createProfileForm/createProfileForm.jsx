"use client";
import OccupationTags from '../occupationTags/OccupationTags'
import defaultProfilePicture from '../../images/defaultProfilePicture.jpg'
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

            <form action="" method="post" className = "w-full h-full flex flex-col" onSubmit={handleSubmit}>

                <div className = "w-full flex justify-center"></div>
                <div className = "flex flex-grow w-full h-full">
                    <div id = "labels-and-inputs-container" className = "flex h-full w-1/2 flex-col items-center bg-blue-500"> {/* Ensures the labels div and the inputs div are side-by-side */}
                        <div className = "w-3/4 mb-10 mt-20"><h1 className = "text-[5vh] font-semibold">Create Your Profile</h1> </div>
                        <FlexLabelAndTextInput labelVal = "Full Name:" inputName = "fullName" required = {true}/> 
                        <FlexLabelAndTextInput labelVal = "Country Of Residence:" inputName="country" required = {true} /> 
                        <FlexLabelAndTextInput labelVal = "Address:" inputName = "address" required = {true}  /> 
                        <FlexLabelAndOtherInput labelVal = "Occupation Tags:"> <OccupationTags inputWidth = "w-3/4" inputHeight="h-1/4" cornerDesign = "rounded-md" textSize = "text-xl" tagColor = "bg-green-500" currentTags = {currentTags} setTags = {setTags}/></FlexLabelAndOtherInput> 
                        <FlexLabelAndOtherInput labelVal = "Bio:"> <textarea className = "text-black w-3/4 h-[18vh] rounded-md text-xl" name = "bio"> </textarea> </FlexLabelAndOtherInput> 
                    </div>
                    <div className = "w-1/2 bg-green-500 flex flex-col items-center">
                        <div className = "w-3/4 mb-10 mt-20 flex justify-center"><h1 className = "text-[5vh] font-semibold">Add A Profile Picture</h1> </div>
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
        <div className = "flex-grow w-3/4">
            <label className = "text-[1.25vw]">{props.labelVal}</label>
            <br></br>
            {props.children}
        </div>);
}

function FlexLabelAndTextInput(props){
    return(
        <div className = "flex-grow w-3/4">
            <label className="text-[1.25vw]"> {props.labelVal} {props.required && <span className = "text-red-500"> * </span> } </label>
            <br></br>
            <input type = "text" className = "text-black w-3/4 h-1/4 rounded-md text-xl" name = {props.inputName} required = {props.required}></input>
        </div>);

    }

    function ProfilePicture() {
        const [image, setImage] = useState(defaultProfilePicture);
        const [dimensions, setDimensions] = useState({ width: '20vw', height: '20vw'});
    
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
    
        useEffect(() => {
            function updateDimensions() {
                const container = document.getElementById('edit-pfp');
    
                const width = container.offsetWidth;
                const height = container.offsetHeight;
    
                const size = Math.min(width, height) * 0.5; // 50% of the smallest dimension
                const limitedSize = Math.min(size, 400); // Limit to 400px
    
                setDimensions({ width: `${limitedSize}px`, height: `${limitedSize}px` });
            }
    
            // Initially set dimensions
            updateDimensions();
    
            // Add event listener to window resize event
            window.addEventListener('resize', updateDimensions);
    
            // Cleanup listener on component unmount
            return () => window.removeEventListener('resize', updateDimensions);
        }, []);
    
        return (
            <div id="edit-pfp" className="w-full h-3/4 flex flex-col justify-center items-center bg-green-500">
                <div className="relative" style={dimensions}>
                    <Image src={image} alt="Profile Preview" layout="fill" objectFit="cover" className="rounded-full" />
                </div>
                <input id="pfp" type="file" accept="image/*" onChange={handleImageChange} />
            </div>
        );
    }
    

export default CreateProfileForm;