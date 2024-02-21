"use client";
import OccupationTags from "../occupationTags/OccupationTags";
import defaultProfilePicture from "../../images/defaultProfilePicture.jpg";
import editIcon from "../../images/pencil-solid.svg";
import { useState } from "react";
import { createAProfile } from "@/app/(unauthenticated)/createProfile/api/createAProfile.js";
import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/legacy/image";
import Input from "../formComponents/Input";

function CreateProfileForm() {
	const [imageFile, setImageFile] = useState(defaultProfilePicture);
	const [currentTags, setTags] = useState(
		[]
	); /* Send this as a reference to OccupationTags */
	/* OccupationTags will be able to modify currentTags as needed, but CreateProfileForm has access to it */
	/* Given that currentTags is an object, any change to it in OccupationTags will be reflected in memory */
	const [fullName, setFullName] = useState("");
	const [country, setCountry] = useState("");
	const [address, setAddress] = useState("");
	const [bio, setBio] = useState("");

	return (
		<>
			<form
				method="POST"
				className="m-4 p-4 flex flex-col justify-center relative overflow-y-auto w-full h-auto bg-white"
			>
				<CreateProfileHeader />
				<div
					id="labels-and-inputs-container"
					className="flex w-full flex-row items-center"
				>
					{" "}
					{/* Ensures the labels div and the inputs div are side-by-side */}
					<ProfilePicture
						imageFile={imageFile}
						setImageFile={setImageFile}
					/>
					<FormLabelsAndInputs
						imageFile={imageFile}
						fullName={fullName}
						setFullName={setFullName}
						country={country}
						setCountry={setCountry}
						address={address}
						setAddress={setAddress}
						bio={bio}
						setBio={setBio}
						currentTags={currentTags}
						setTags={setTags}
					/>
				</div>
			</form>
		</>
	);
}

function CreateProfileHeader() {
	return (
		<div className="w-full flex flex-row justify-left">
			<h1 className="font-semibold mobile:text-[2rem] tablet:text-[3rem] desktop:text-[4rem]">
				Create Your Profile
			</h1>
		</div>
	);
}

function FormLabelsAndInputs({ imageFile }) {
	const router = useRouter();
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
			var response = await createAProfile(collectFormData());
			if (response.status == 201) {
				router.push("/chats"); // Code for this page has not been written yet
			} else if (response.status == 401) {
				alert("You have not signed up yet. Please sign up first.");
				router.push("/SignUp");
			} else {
				alert(
					"Sorry, we were unable to create your profile. Please try again."
				);
			}
		} else displayRequiredFields();
	}

	return (
		<section className="flex flex-col w-full">
			<FlexLabelAndTextInput
				labelVal={fullNameLabelHTML}
				inputName="fullName"
				required={true}
				onChangeFunction={onFullNameChange}
				placeHolder="e.g., John Wilfred Doe"
			/>
			<FlexLabelAndTextInput
				labelVal={countryLabelHTML}
				inputName="country"
				required={true}
				onChangeFunction={onCountryChange}
				placeHolder="e.g, Canada"
			/>
			<FlexLabelAndTextInput
				labelVal={addressLabelHTML}
				inputName="address"
				required={true}
				onChangeFunction={onAddressChange}
				placeHolder="e.g, 111 Wellington St."
			/>
			{
			//<Input label="Occupation Tags:" type="text" id="occupationTags" name="occupationTags" placeholder="e.g., Software Engineer" />
				//<OccupationTags
				//	id="occupationTags"
				//	inputName="occupationTags"
				//	inputFieldStyles="w-3/4 h-[2.5rem] rounded-md p-2 text-[1.25rem]"
				//	placeHolder="e.g, Software Engineer"
				//	tagColor="bg-green-500"
				//	currentTags={currentTags}
				//	setTags={setTags}
				///>
			}
			<FlexLabelAndOtherInput
				labelVal="Occupation Tags:"
				inputName="occupationTags"
			>
				{" "}
				<OccupationTags
					id="occupationTags"
					inputName="occupationTags"
					inputFieldStyles="w-3/4 h-[2.5rem] rounded-md p-2 text-[1.25rem]"
					placeHolder="e.g, Software Engineer"
					tagColor="bg-green-500"
					currentTags={currentTags}
					setTags={setTags}
				/>
			</FlexLabelAndOtherInput>
			<FlexLabelAndOtherInput labelVal="Bio:" inputName="bio">
				{" "}
				<textarea
					id="bio"
					className="mobile:h-auto text-black w-3/4 rounded-md text-[1.25rem] resize-none p-2"
					name="bio"
					placeholder="e.g, I have a Bachelor's degree in computer science and am an avid learner. While I love working in software, when not at work, you can find me in the great outdoors."
					onChange={onBioChange}
				></textarea>{" "}
			</FlexLabelAndOtherInput>
			<FormButtons onSubmitHandler={onSubmit} />
		</section>
	);
}

function FlexLabelAndOtherInput(props) {
	return (
		<div className="w-full mt-10 mb-10 flex flex-col items-center">
			{" "}
			{/* Flex box ensures that the occupation tags can keep growing while pushing down the bio*/}
			<label
				htmlFor={props.inputName}
				className="font-semibold mb-2 hover:cursor-text mobile:text-[1rem] tablet:text-[1.25rem] desktop:text-[1.25rem]"
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
		<div className="w-full mx-4 px-4 flex flex-col justify-start items-start">
			{
				//<label htmlFor = {props.inputName} cum = {props.inputName} className="font-semibold mb-2 hover:cursor-text mobile:text-[1rem] tablet:text-[1.25rem] desktop:text-[1.25rem]" dangerouslySetInnerHTML={props.labelVal}></label>  {/* "for" attribute specified what input a label is associated by providing the ID of the input*/}
				//<br></br>
				//<input id = {props.inputName}  type = "text" className = "bg-[#f4f4f5] hover:bg-[#e4e4e7] py-2 px-3 flex flex-col w-full rounded-xl hover:cursor-text my-2 text-md" name = {props.inputName} required = {props.required}  onChange = {props.onChangeFunction} onBlur = {props.onChangeFunction} placeholder = {props.placeHolder}></input>
			}
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

function FormButtons({ onSubmitHandler }) {
	return (
		<div className="flex mobile:w-full mobile:flex-col-reverse mobile:items-center mobile:space-y-reverse mobile:space-y-5 desktop:w-3/4 desktop:space-x-52 desktop:space-y-0 desktop:flex-row desktop:justify-center ">
			{" "}
			{/* space-y puts margin top on the seocnd, third, fourth, etc elements. But, if col-reversed, the margin-top property still remains. You'll need to specify space-y-reverse to ensure the correct order of margin-top*/}
			<button className="h-fit my-2 p-2 text-xl font-normal rounded-lg bg-black border-2 border-black hover:bg-white text-white hover:text-black transition-all duration-300 ease-in-out w-3/4">
				Go Back
			</button>
			<button
				className="h-fit my-2 p-2 text-xl font-normal rounded-lg bg-black border-2 border-black hover:bg-white text-white hover:text-black transition-all duration-300 ease-in-out w-3/4"
				onClick={onSubmitHandler}
			>
				Create Profile
			</button>
		</div>
	);
}

function ProfilePicture({ imaageFile, setImageFile }) {
	const [image, setImage] = useState(defaultProfilePicture);

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

	const handleEditButtonClick = function (e) {
		e.preventDefault();
		document.getElementById("edit-pfp").click();
	};

	function Picture() {
		return (
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
		);
	}

	function EditPictureButton() {
		return (
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

	return (
		<div
			id="pfp-container"
			className="w-full h-fullpx flex flex-col justify-center items-center"
		>
			<Picture />
			<EditPictureButton />
		</div>
	);
}

export default CreateProfileForm;
