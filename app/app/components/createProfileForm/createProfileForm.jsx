"use client";
import OccupationTags from "../occupationTags/OccupationTags";
import defaultProfilePicture from "../../images/defaultProfilePicture.jpg";
import editIcon from "../../images/pencil-solid.svg";
import { useState, useEffect } from "react";
import { createAProfile } from "../../createProfile/api/createAProfile.js";

import Image from "next/legacy/image";

function CreateProfileForm() {
  // Inside CreateProfileForm component

  const [currentTags, setTags] = useState(
    []
  ); /* Send this as a reference to OccupationTags */
  /* OccupationTags will be able to modify currentTags as needed, but CreateProfileForm has access to it */
  /* Given that currentTags is an object, any change to it in OccupationTags will be reflected in memory */

  function handleSubmit(event) {
    event.preventDefault();

    var fullName = document.querySelector('[name = "fullName"]');
    var country = document.querySelector('[name = "country"]');
    var address = document.querySelector('[name = "address"]');
    var bio = document.querySelector('[name = "bio"]');
    var occupationTags = document.querySelector('[name = "occupationTags"]');
    var pfp = document.querySelector("#pfp");

    if (
      fullName.value.trim() === "" ||
      country.value.trim() === "" ||
      country.value.trim() === ""
    ) {
      if (fullName.value.trim() === "")
        document.querySelector('[err_assoc = "fullName"]').innerHTML =
          "Please Enter Your Full Name";
      if (country.value.trim() === "")
        document.querySelector('[err_assoc = "country"]').innerHTML =
          "Please Enter Your Country Of Residence";
      if (country.value.trim() === "")
        document.querySelector('[err_assoc= "address"]').innerHTML =
          "Please Enter Your Address";
    } else {
      // Collect all form fields
      var profileData = {
        fullName: fullName.value,
        country: country.value,
        address: address.value,
        bio: bio.value,
        occupationTags: JSON.stringify(currentTags),
      };

      if (createAProfile(profileData)) {
        alert("Created Your Profile");
      } else {
        alert("Could Not Create");
      }
    }
  }

  return (
    <>
      <form
        action=""
        method="post"
        className="relative overflow-y-auto w-full h-screen overflow-y-auto bg-gradient-to-r from-blue-500 to-green-500"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center flex-col-reverse w-screen h-[100vh]">
          <div
            id="labels-and-inputs-container"
            className="flex h-[100vh] w-1/2 flex-col items-center p-2"
          >
            {" "}
            {/* Ensures the labels div and the inputs div are side-by-side */}
            <div className="w-full mb-10 mt-20 flex justify-center">
              <h1 className="font-semibold mobile:text-[5vw] tablet:text-[4rem] desktop:text-[4rem]">
                Create Your Profile
              </h1>{" "}
            </div>
            <div
              id="pfp-container"
              className="w-1/2 flex flex-col items-center"
            >
              {" "}
              {/* On mobile, having this here will ensure it does not take up the full height */}
              <ProfilePicture></ProfilePicture>
            </div>
            <FlexLabelAndTextInput
              labelVal="Full Name:"
              inputName="fullName"
              assoc="fullName"
              required={true}
            />
            <FlexLabelAndTextInput
              labelVal="Country Of Residence:"
              inputName="country"
              assoc="country"
              required={true}
            />
            <FlexLabelAndTextInput
              labelVal="Address:"
              inputName="address"
              assoc="address"
              required={true}
            />
            <FlexLabelAndOtherInput
              labelVal="Occupation Tags:"
              assoc="occupationTags"
            >
              {" "}
              <OccupationTags
                inputName="occupationTags"
                inputWidth="w-3/4 max-w-[35rem] min-w-[15rem]"
                inputHeight="h-[2.5rem]"
                cornerDesign="rounded-md"
                textSize="text-[1.25rem]"
                tagColor="bg-green-500"
                currentTags={currentTags}
                setTags={setTags}
              />
            </FlexLabelAndOtherInput>
            <FlexLabelAndOtherInput labelVal="Bio:" assoc="bio">
              {" "}
              <textarea
                className="min-w-[15rem] min-h-[10rem] text-black w-3/4 max-w-[35rem] h-[18vw] rounded-md text-[1.25rem]"
                name="bio"
              ></textarea>{" "}
            </FlexLabelAndOtherInput>
            <button
              className="bg-black p-2 font-semibold rounded-lg hover:text-green-500 w-1/4"
              onClick={handleSubmit}
            >
              SUBMIT
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

function FlexLabelAndOtherInput(props) {
  return (
    <div className="w-full mt-10 mb-10 flex flex-col items-center ">
      {" "}
      {/* Flex box ensures that the occupation tags can keep growing while pushing down the bio*/}
      <label className="mobile:text-[1rem] tablet:text-[2rem] desktop:text-[2rem]">
        {props.labelVal}
      </label>
      <br></br>
      {props.children}
      <p err_assoc={props.assoc}></p>
    </div>
  );
}

function FlexLabelAndTextInput(props) {
  return (
    <div className="w-full mt-10 mb-10 flex flex-col items-center">
      <label className="mobile:text-[1rem] tablet:text-[2rem] desktop:text-[2rem]">
        {" "}
        {props.labelVal}{" "}
        {props.required && <span className="text-red-500"> * </span>}{" "}
      </label>
      <br></br>
      <input
        type="text"
        className="min-w-[15rem] text-black w-3/4 h-[2.5rem] max-w-[35rem] rounded-md text-[1.25rem]"
        name={props.inputName}
        required={props.required}
      ></input>
      <p err_assoc={props.assoc} className="text-red-500"></p>
    </div>
  );
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

  const handleEditButtonClick = function (e) {
    e.preventDefault();
    document.getElementById("edit-pfp").click();
  };

  return (
    <div
      id="pfp-container"
      className="w-full h-fullpx flex flex-col justify-center items-center"
    >
      <div
        className="relative w-[20vw] h-[20vw]"
        style={{
          maxWidth: "300px",
          maxHeight: "300px",
          minWidth: "10rem",
          minHeight: "10rem",
        }}
      >
        <Image
          id="pfp"
          src={image}
          alt="Profile Preview"
          layout="fill"
          objectFit="cover"
          className="rounded-full"
        />
      </div>
      <div
        id="edit-pfp-button-container"
        className="relative w-[2vw] h-[2vw] max-h-[70px] max-w-[70px]"
      >
        <button id="edit-pfp-button">
          <Image
            src={editIcon}
            layout="fill"
            objectFit="cover"
            alt="Edit"
            onClick={handleEditButtonClick}
          ></Image>
        </button>
      </div>
      <input
        id="edit-pfp"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
}

export default CreateProfileForm;
