"use client";
import OccupationTags from '../occupationTags/OccupationTags'
import defaultProfilePicture from '../../images/defaultProfilePicture.jpg'
import {useState} from "react"

function CreateProfileForm() {
    return (

            <form action="" method="post" className = "w-3/4 h-3/4 flex flex-col bg-red-500">

                <div className = "w-full flex justify-center"><h1 className = "text-[5vh]">Create Profile</h1></div>
                <div className = "flex flex-grow w-full h-full">
                    <div id = "labels-and-inputs-container" className = "flex h-full w-1/2 flex-col "> {/* Ensures the labels div and the inputs div are side-by-side */}
                        <FlexLabelAndTextInput labelVal = "Full Name" inputName = "fullName"/> 
                        <FlexLabelAndTextInput labelVal = "Country Of Residence" inputName="country"/> 
                        <FlexLabelAndTextInput labelVal = "Address" inputName = "address"/> 
                        <FlexLabelAndOtherInput labelVal = "Occupation Tags"> <OccupationTags/></FlexLabelAndOtherInput> 
                        <FlexLabelAndOtherInput labelVal = "Bio"> <textarea className = "text-black w-1/2 h-[18vh] resize-y" name = "bio"> </textarea> </FlexLabelAndOtherInput> 
                    </div>
                    <div id = "pfp" className = "w-1/2 h-full flex flex-col justify-center items-center">
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
        <>
        <img src={image} alt="Profile Preview" className="rounded-full w-[20vw] h-[20vw] object-cover mb-4"/>
        <input type="file" accept="image/*" onChange={handleImageChange}/>
        </>
    );
}

export default CreateProfileForm;