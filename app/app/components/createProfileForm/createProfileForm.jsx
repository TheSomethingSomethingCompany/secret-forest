"use client";
import OccupationTags from "../occupationTags/OccupationTags";
import defaultProfilePicture from "@/public/profile-pictures/1.svg";
import editIcon from "../../images/pencil-solid.svg";
import { useState } from "react";
import { createAProfile } from "../../(unauthenticated)/createProfile/api/createAProfile.js";
import getRandomProfilePicture from "@/app/scripts/getRandomProfilePicture";
import "remixicon/fonts/remixicon.css";

import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import Input from "../formComponents/Input";
import { useWebSocket } from "../../contexts/WebSocketContext";


function CreateProfileForm() {
	const { isConnected, sendMessage } = useWebSocket();
	return (
		<>	
			<form method="POST" className="mx-6">
				<CreateProfileHeader />
				<div
					id="labels-and-inputs-container"
					className="flex w-full flex-row items-center"
				>
					<FormLabelsAndInputs />
				</div>
			</form>
		</>
	);
}

function CreateProfileHeader() {
	return (
		<section className="w-full flex flex-col items-start">
			<h1 className="font-bold text-6xl pb-4 text-[#343a40]">
				Tell Others About Yourself
			</h1>
			<p className="text-xl font-light pb-8 text-[#343a40]">
				Complete your profile to let others know who you are.
			</p>
		</section>
	);
}

function FormLabelsAndInputs() {
	const router = useRouter();
	const [imageFile, setImageFile] = useState(getRandomProfilePicture());
	const [currentTags, setTags] = useState(
		[]
	); /* Send this as a reference to OccupationTags */
	/* OccupationTags will be able to modify currentTags as needed, but CreateProfileForm has access to it */
	/* Given that currentTags is an object, any change to it in OccupationTags will be reflected in memory */
	const [fullName, setFullName] = useState("");
	const [country, setCountry] = useState("");
	const [address, setAddress] = useState("");
	const [bio, setBio] = useState("");

	const [fullNameLabelHTML, setFullNameLabelHTML] = useState({
		__html: 'Full Name: <span class = "text-red-500"> * </span>',
	});
	const [countryLabelHTML, setCountryLabelHTML] = useState({
		__html: 'Country Of Residence: <span class = "text-red-500"> * </span> ',
	});
	const [addressLabelHTML, setAddressLabelHTML] = useState({
		__html: 'Address: <span class = "text-red-500"> * </span> ',
	});

	// Using dangerouslySetInnerHTML allows us to set the innerHTML of a label, which is useful for adding a red asterisk to required fields and for adding error messages
	// dangerouslySetInnerHTML does not have a security risk here because we are not using user input to set the innerHTML, we are using a string that we have defined ourselves
	// dangerouslySetInnerHTML does have a security risk if we were to use user input to set the innerHTML, because it would allow users to inject HTML into our page, but since we are using a label and it is not possible to save this HTML to the database or show it to other users, there is no security risk here.

	function onFullNameChange(e) {
		const value = e.target.value.trim();
		setFullName(value);

		if (value == "")
			setFullNameLabelHTML({
				__html: '<span class = "text-red-500"> You cannot leave this field empty! Please enter your full name:</span>',
			});
		else
			setFullNameLabelHTML({
				__html: 'Full Name: <span class = "text-red-500"> * </span> ',
			});
	}

	function onCountryChange(e) {
		const value = e.target.value.trim();
		setCountry(value);
		if (value == "")
			setCountryLabelHTML({
				__html: '<span class = "text-red-500"> You cannot leave this field empty! Please enter your country of residence:</span>',
			});
		else
			setCountryLabelHTML({
				__html: 'Country Of Residence: <span class = "text-red-500"> * </span> ',
			});
	}

	function onAddressChange(e) {
		const value = e.target.value.trim();
		setAddress(value);
		if (value == "")
			setAddressLabelHTML({
				__html: '<span class = "text-red-500"> You cannot leave this field empty! Please enter your address:</span>',
			});
		else
			setAddressLabelHTML({
				__html: 'Address: <span class = "text-red-500"> * </span>',
			});
	}

	function onBioChange(e) {
		const value = e.target.value.trim();
		setBio(value);
	}

	function displayRequiredFields() {
		if (fullName == "")
			setFullNameLabelHTML({
				__html: '<span class = "text-red-500"> You cannot leave this field empty! Please enter your full name:</span>',
			});
		if (country == "")
			setCountryLabelHTML({
				__html: '<span class = "text-red-500"> You cannot leave this field empty! Please enter your country of residence:</span>',
			});
		if (address == "")
			setAddressLabelHTML({
				__html: '<span class = "text-red-500"> You cannot leave this field empty! Please enter your address:</span>',
			});
	}

	function collectFormData() {
		const formData = new FormData();
		console.log("imageFile: ", imageFile);
		formData.append("profilePicture", imageFile);
		formData.append("fullName", fullName);
		formData.append("country", country);
		formData.append("address", address);
		formData.append("bio", bio);
		formData.append("occupationTags", JSON.stringify(currentTags));
		return formData;
	}

	async function onSubmit(e) {
		e.preventDefault();	
		if (fullName != "" && country != "" && address != "") {
			console.log("ProfileImage: ", imageFile);

			var response = await createAProfile(collectFormData());
			if (response.status == 201) {
				router.push("/chats", true, { shallow: false }); 
			} else if (response.status == 401) {
				alert("You have not signed up yet. Please sign up first.");
				router.push("/auth?signin=false");
			} else {
				alert(
					"Sorry, we were unable to create your profile. Please try again."
				);
			}
		} else displayRequiredFields();
	}

	return (
		<section className="rounded-lg shadow-lg p-6 w-full">
			<div className="flex flex-col items-start w-full">
				<h4 className="font-bold font-xl py-4 text-[#343a40]">
					PERSONAL DETAILS
				</h4>

				<FlexLabelAndTextInput
					labelVal={fullNameLabelHTML}
					inputName="fullName"
					required={true}
					onChangeFunction={onFullNameChange}
					placeHolder="e.g., John Wilfred Doe"
				/>
				<div className="flex flex-row justify-evenly w-full">
					<div className="pr-2 w-full">
						<FlexLabelAndTextInput
							labelVal={countryLabelHTML}
							inputName="country"
							required={true}
							onChangeFunction={onCountryChange}
							placeHolder="e.g, Canada"
						/>
					</div>
					<div className="pl-2 w-full">
						<FlexLabelAndTextInput
							labelVal={addressLabelHTML}
							inputName="address"
							required={true}
							onChangeFunction={onAddressChange}
							placeHolder="e.g, 111 Wellington St."
						/>
					</div>
				</div>
				<h4 className="font-bold font-xl py-4 text-[#343a40]">
					PROFILE PICTURE
				</h4>
				<ProfilePicture setImageFile={setImageFile} />
				<FlexLabelAndOtherInput
					labelVal="OCCUPATION TAGS"
					inputName="occupationTags"
				>
					<OccupationTags
						id="occupationTags"
						inputName="occupationTags"
						inputFieldStyles="rounded-sm p-2 text-lg"
						placeHolder="e.g, Software Engineer"
						currentTags={currentTags}
						setTags={setTags}
					/>
				</FlexLabelAndOtherInput>
				<FlexLabelAndOtherInput labelVal="BIOGRAPHY" inputName="bio">
					{" "}
					<textarea
						id="bio"
						className="mobile:h-auto text-black w-3/4 rounded-md text-[1.25rem] resize-none p-2"
						name="bio"
						placeholder="e.g, I have a Bachelor's degree in computer science and am an avid learner. While I love working in software, when not at work, you can find me in the great outdoors."
						onChange={onBioChange}
					></textarea>{" "}
				</FlexLabelAndOtherInput>
			</div>
			<div className="w-full flex flex-row justify-end">
				<button
					className="h-fit p-2 my-2 text-lg font-normal rounded-lg bg-black border-2 border-black hover:bg-white text-white hover:text-black transition-all duration-300 ease-in-out"
					onClick={onSubmit}
				>
					Create Profile
				</button>
			</div>
		</section>
	);
}

function FlexLabelAndOtherInput(props) {
	return (
		<div className="w-full mt-10 mb-10 flex flex-col items-start">
			{" "}
			{/* Flex box ensures that the occupation tags can keep growing while pushing down the bio*/}
			<label
				htmlFor={props.inputName}
				className="font-bold font-xl py-4 text-[#343a40]"
			>
				{props.labelVal}
			</label>
			<br></br>
			{props.children}
		</div>
	);
}

function FlexLabelAndTextInput(props) {
	return (
		<div className="w-full">
			<Input
				label={props.labelVal}
				dsh={props.labelVal}
				type="text"
				id={props.inputName}
				name={props.inputName}
				placeholder={props.placeHolder}
				onChange={props.onChangeFunction}
				onBlur={props.onChangeFunction}
			/>
		</div>
	);
}

function ProfilePicture({ setImageFile }) {
	const [image, setImage] = useState(getRandomProfilePicture());

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImageFile(file);
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	function Picture() {
		return (
			<div className="flex flex-row w-full items-center">
				<div className="pr-2">
					<Image
						id="pfp"
						className="rounded-full"
						src={image}
						alt="Picture"
						width={100}
						height={100}
					/>
				</div>
				<div className="ml-4 flex flex-row flex-1 items-center">
					<div className="pr-1">
						<input
							type="file"
							id="edit-pfp"
							accept="image/jpeg, image/png, image/svg+xml"
							onChange={handleImageChange}
							hidden
						/>
						<label
							htmlFor="edit-pfp"
							className="inline-block bg-green-200 text-green-800 border-green-200 border-[1px] p-2 cursor-pointer rounded-sm hover:bg-green-300 transition-all ease-in-out duration-300"
						>
							Upload New Picture
						</label>
					</div>
					<div className="pl-1">
						<button
							type="button"
							className="h-full bg-blue-200 text-blue-800 border-blue-200 border-[1px] p-2 cursor-pointer rounded-sm hover:bg-blue-300 transition-all ease-in-out duration-300"
							onClick={() => setImage(getRandomProfilePicture())}
						>
							<i className="ri-restart-line"></i>
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			id="pfp-container"
			className="w-full h-fullpx flex flex-col justify-center items-center"
		>
			<Picture />
		</div>
	);
}

export default CreateProfileForm;
