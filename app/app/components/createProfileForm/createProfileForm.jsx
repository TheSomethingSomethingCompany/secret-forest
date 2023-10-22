"use client";
import OccupationTags from '../occupationTags/OccupationTags'

function CreateProfileForm() {
    return (

            <form action="" method="post" className = "w-1/2 h-1/2 flex flex-col bg-red-500">

      
            <div id = "labels-and-inputs-container" className = "flex h-full w-full flex-col "> {/* Ensures the labels div and the inputs div are side-by-side */}
                <FlexLabelAndTextInput labelVal = "Full Name" inputName = "fullName"/> 
                <FlexLabelAndTextInput labelVal = "Country Of Residence" inputName="country"/> 
                <FlexLabelAndTextInput labelVal = "Address" inputName = "address"/> 
                <FlexLabelAndOtherInput labelVal = "Occupation Tags"> <OccupationTags/></FlexLabelAndOtherInput> 
                <FlexLabelAndOtherInput labelVal = "Bio"> <textarea className = "text-black" name = "bio"> </textarea> </FlexLabelAndOtherInput> 
            </div>

                
                <input type="submit" value="Submit" />
                <button id="goBack">Go Back</button>
            </form>
           

    );
}

function FlexLabelAndOtherInput(props){
    return(
        <div className = "flex-grow">
            <label>{props.labelVal}</label>
            <br></br>
            {props.children}
        </div>);
}

function FlexLabelAndTextInput(props){
    return(
        <div className = "flex-grow">
            <label>{props.labelVal}</label>
            <br></br>
            <input type = "text" className = "text-black" name = {props.inputName}></input>
        </div>);

    }

export default CreateProfileForm;