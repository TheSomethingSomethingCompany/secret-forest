"use client";
import OccupationTags from '../occupationTags/OccupationTags'

function CreateProfileForm() {
    return (

            <form action="" method="post" className = "w-1/2 h-1/2 flex flex-col justify-center items-center bg-red-500">

            <div className = "flex">
            <div id = "labelsCreateProfile">
                <label>Full Name: </label>
                <br></br>
                <br></br>
                <label>Country Of Residence</label>
                <br></br>
                <br></br>
                <label>Occupation Tags</label>
                <br></br>
                <br></br>
                <label>Address</label>
                <br></br>
                <br></br>
                <label>Bio</label>
            </div>
                
            <div id = "inputsCreateProfile">
                <input type="text" className = "text-black"  name="fullName" required />
                <br></br>
                <br></br>

                <input type="text" className = "text-black"  name="country" required />
               
                <br></br>
                <br></br>
    
                <OccupationTags />
                <br></br>
                <br></br>
                

                <input type="text" className = "text-black"  name="address" />
                <br></br>
                <br></br>
                
                <textarea className = "text-black" name="bio" required></textarea>
                
            </div>
                </div>
                
                <input type="submit" value="Submit" />
                <button id="goBack">Go Back</button>
            </form>
           

    );
}

export default CreateProfileForm;