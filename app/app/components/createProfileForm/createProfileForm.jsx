"use client";
import OccupationTags from '../occupationTags/OccupationTags'

function CreateProfileForm() {
    return (

            <form action="" method="post" className = "w-1/2 h-1/2  flex flex-col justify-center space-between bg-red-500">

            <div className = "flex h-full space-x-10"> {/* Ensures the labels div and the inputs div are side-by-side */}
                <div id = "labels" className = "flex flex-col h-full"> {/*Ensures all labels are stacked, not side by side */}
                    <FlexLabel labelVal = "Full Name: "/> 
                    <FlexLabel labelVal = "Country Of Residence: "/> 
                    <FlexLabel labelVal = "Address: "/> 
                    <FlexLabel labelVal = "Occupation Tags: "/> 
                    <FlexLabel labelVal = "Bio: "/> 
                </div>
                    
                <div id = "inputs" className = "h-full flex flex-col"> {/*Ensures all inputs are stacked, not side by side */}
                    <FlexTextInput inputName ="fullName"/>
                    <FlexTextInput inputName ="country"/>
                    <FlexTextInput inputName ="address"/>
                    <div className = "flex-grow">
                        <OccupationTags />
                    </div>
                    <div className = "flex-grow">
                        <textarea className = "text-black" name="bio" required></textarea> 
                    </div>
                </div>
            </div>
                
                <input type="submit" value="Submit" />
                <button id="goBack">Go Back</button>
            </form>
           

    );
}

function FlexLabel(props){
    return(
        <div className = "flex-grow">
            <label>{props.labelVal}</label>
        </div>);

    }

    function FlexTextInput(props){
        return(
            <div className = "flex-grow">
                <input type = "text" className = "text-black" name = {props.inputName}></input>
            </div>
        )
    }

export default CreateProfileForm;