"use client";
import OccupationTags from "@/app/components/occupationTags/OccupationTags";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import fetchUserData from "../api/fetchUserData";
import MemberFetch from "@/app/types/MemberFetch";
import updateProfileInfo from "../api/saveProfileData";
import sendRequest from "../api/sendRequest";
import acceptRequest from "../../requests/api/acceptRequest";
import declineRequest from "../../requests/api/declineRequest";
import cancelRequest from "../../requests/api/cancelRequest";
import GetProfilePicture from "../api/getPFP";
import blockUser from "../api/blockUser";
import unblockUser from "../../requests/api/unblockUser";
import getRandomProfilePicture from "@/app/scripts/getRandomProfilePicture";
import "remixicon/fonts/remixicon.css";
import Image from "next/image";
import { useWebSocket } from "@/app/contexts/WebSocketContext";

function EditProfile({ params }: { params: { slug: string } }) {
	const {sendMessage} = useWebSocket();
	

	const router = useRouter();
	const [currentTags, setTags] = useState([]);
	

	const [profile, setProfile] = useState({
		fullName: "Loading",
		userName: "Loading",
		country: "Loading",
		address: "Loading",
		biography: "Loading",
		email: "Loadig",
		currentTags: [],
	});

	const [isUser, setIsUser] = useState(false);

	const [hasRequest, setHasRequest] = useState(-1);
	const [hasChat, setHasChat] = useState(-1);

	//pfp
	const [pfpInfo, setPfpInfo] = useState(``);
	const [tempPfp, setTempPfp] = useState(``);
	const [tempPfpFile, setTempPfpFile] = useState(``);

	useEffect(() => {
		sendMessage("sessionCheck");
	}, []);

	const fetchData = async () => {
		const memberData: MemberFetch = await fetchUserData({ ...params });
		console.log(memberData);

		if (memberData.status == 202) {
			console.log("User found, and is the logged in user.");
			setIsUser(true);
		} else if (memberData.status == 200) {
			console.log("User found, but not the logged in user.");
			setIsUser(false);
		} else if (memberData.status == 404) {
			console.log("User not found");
			router.push("/404");
			setIsUser(false);
		} else {
			console.log("Error");
			setIsUser(false);
			router.push("/404");
		}

		setHasChat(memberData.data.hasChat);
		setHasRequest(memberData.data.hasRequest);

		const pfpPath = await GetProfilePicture({
			username: memberData.data.username,
		});
		setPfpInfo(pfpPath.data);
		console.log("PFP PATH: " + pfpInfo + " " + pfpPath.data); //DEBUG LINE

		setProfile({
			fullName: memberData.data.name,
			userName: memberData.data.username,
			country: memberData.data.country,
			address: memberData.data.address,
			biography: memberData.data.bio,
			email: memberData.data.email,
			currentTags: memberData.data.tags || ([] as string[]), // Add a default value for tags
		});

		setTags(memberData.data.tags);
	};



	useEffect(() => {
		fetchData();
	}, []);
	useEffect(() => {
		setTempProfile({ ...profile });
	}, [profile]);
	useEffect(() => {
		setTempPfp(pfpInfo);
	}, [pfpInfo]);

	console.log("pfpInfo: " + pfpInfo + "|| tempPfp: " + tempPfp); //DEBUG LINE

	// Temporary state to hold changes while editing
	const [tempProfile, setTempProfile] = useState({ ...profile });

	// State to track whether we're currently editing
	const [isEditing, setIsEditing] = useState(false);

	// Handler for the Edit button
	const handleEdit = () => {
		setIsEditing(true);
	};

	// Handler for the Cancel button
	const handleCancel = () => {
		setIsEditing(false);
		setTempProfile({ ...profile });
		setTags(profile.currentTags);
		setTempPfp(pfpInfo);
		console.log("cancel changes");
	};

	function formDataAsJSON() {
		console.log("check data: ", tempProfile);
		console.log("PFP: ", tempPfpFile);
		const formData = new FormData();
		if (tempPfpFile) {
			formData.append("pfp", tempPfpFile);
		}
		else {
			formData.append("pfp", tempPfp);
		}
		formData.append("fullName", tempProfile.fullName);
		formData.append("country", tempProfile.country);
		formData.append("address", tempProfile.address);
		formData.append("bio", tempProfile.biography);
		formData.append("username", tempProfile.userName);
		formData.append("email", tempProfile.email);
		formData.append("tags", JSON.stringify(currentTags));
		return formData;
	}

	// Handler for the Save Changes button
	async function handleSave(e: { preventDefault: () => void }) {
		setIsEditing(false);
		tempProfile.currentTags = currentTags;
		console.log("PROFILE_IMAGE: ", tempPfpFile);
		if (
			tempProfile.fullName != "" &&
			tempProfile.country != "" &&
			tempProfile.address != "" &&
			tempProfile.userName != ""
		) {
			var response = await updateProfileInfo(formDataAsJSON());
			if (response.status == 202) {
				setProfile({ ...tempProfile });
				setPfpInfo(tempPfp);
				console.log("save changes: ", tempProfile);
			} else if (response.status == 404) {
				alert(
					"The username you selected is already taken. Please choose a different one."
				);
			} else {
				alert(
					"Sorry, we were unable to update your profile. Please try again."
				);
			}
		} else {
			alert(
				"Please ensure that the name, country, address, and username boxes are not left empty!"
			);
			console.log("Something went wrong");
		}
	}

	function handleSendRequest() {
		sendRequest({ username: profile.userName }).then((res) => {
			setHasRequest(1);
		});
	}

	function handleCancelRequest() {
		cancelRequest({ username: profile.userName }).then((res) => {
			setHasRequest(0);
		});
	}

	function handleAcceptRequest() {
		acceptRequest({ username: profile.userName }).then((res) => {
			setHasRequest(0);
			setHasChat(1);
		});
	}

	function handleDeclineRequest() {
		declineRequest({ username: profile.userName }).then((res) => {
			setHasRequest(0);
		});
	}

	function handleBlockUser() {
		blockUser({ username: profile.userName }).then((res) => {
			setHasRequest(3);
			setHasChat(0);
		});
	}

	function handleUnblockUser() {
		unblockUser({ username: profile.userName }).then((res) => {
			setHasRequest(0);
		});
	}

	// Create function handle going to chat, which just redirects to the chat page
	function handleGoToChat() {
		router.push("/chats");
	}

	const handlePfpChange = (e) => {
		const file = e.target.files[0];
		setTempPfpFile(file);
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setTempPfp(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<>
			<section className="flex flex-row h-full max-h-full p-8">
				{/*Div for the left box that displays how the user's profile will look like when people view their profile*/}
				<div className="flex-1 md:flex-shrink-0 flex flex-col justify-start md:max-w-sm bg-white shadow-xl p-10 rounded-lg h-auto md:h-full md:mr-4 overflow-y-scroll">
					<div>
						<div className="flex flex-row justify-between items-start">
							<Image
								className="rounded-full w-40 md:w-auto"
								src={tempPfp}
								width={300}
								height={300}
								alt={`${profile.fullName}'s Profile Picture`}
							/>
							{isUser && !isEditing && (
								<div className="md:hidden flex my-2 flex-row justify-center">
									<button
										className="bg-white border-[1px] border-black shadow-xl p-2 text-lg rounded-lg"
										onClick={handleEdit}
									>
										Edit Profile
									</button>
								</div>
							)}
						</div>
						{isUser && isEditing && (
							<div className="my-4 flex flex-row justify-center">
								<label
									htmlFor="edit-pfp"
									className="inline-block bg-green-200 text-green-800 border-green-200 border-[1px] p-2 cursor-pointer rounded-sm hover:bg-green-300 transition-all ease-in-out duration-300 mx-2"
								>
									Upload New Picture
								</label>
								<input
									type="file"
									id="edit-pfp"
									accept="image/jpeg, image/png, image/svg+xml"
									onChange={handlePfpChange}
									hidden
								/>
								<button
									type="button"
									className="h-full bg-blue-200 text-blue-800 border-blue-200 border-[1px] p-2 cursor-pointer rounded-sm hover:bg-blue-300 transition-all ease-in-out duration-300 mx-2"
									onClick={() =>
										setTempPfp(getRandomProfilePicture())
									}
								>
									<i className="ri-restart-line"></i>
								</button>
							</div>
						)}
						<div className="my-4">
							<h1 className="font-bold text-4xl py-1">
								{profile.fullName}
							</h1>
							<h2 className="font-normal text-xl py-1">
								@ {profile.userName}
							</h2>
							<h2 className="font-light text-lg py-1 flex flex-row">
								<i className="ri-map-pin-line"></i>
								<p className="px-2">{profile.country}</p>
							</h2>
							<h2 className="text-lg py-1 flex flex-row">
								<i className="ri-mail-line"></i>
								<p className="px-2 font-light">
									{profile.email}
								</p>
							</h2>
						</div>
					</div>
					{isUser && !isEditing && (
						<div className="hidden md:flex my-2 flex-row justify-center">
							<button
								className="bg-white border-[1px] border-black shadow-xl p-2 text-lg rounded-lg"
								onClick={handleEdit}
							>
								Edit Profile
							</button>
						</div>
					)}
					{isUser && isEditing && (
						<div className="hidden md:flex flex-row justify-between">
							<div className="my-2 flex flex-row justify-between">
								<button
									className="shadow-xl p-2 text-lg rounded-lg bg-gray-800 hover:bg-gray-900 text-white"
									onClick={handleSave}
								>
									Save Changes
								</button>
							</div>
							<div className="my-2 flex flex-row justify-between">
								<button
									className="shadow-xl p-2 text-lg rounded-lg bg-red-500 hover:bg-red-600 text-white"
									onClick={handleCancel}
								>
									Cancel
								</button>
							</div>
						</div>
					)}
					{!isUser && hasRequest === 4 && (
						<div className="p-2 bg-red-500 text-white font-normal mr-2 rounded-lg mb-4 flex flex-row">
							<i className="ri-information-2-line"></i>
							<p>This user has blocked you</p>
						</div>
					)}
					{!isUser && (
						<div className="flex flex-row flex-wrap mb-4">
							{hasRequest === 0 && !hasChat && (
								<button
									className="bg-sky-500 p-2 mr-2 rounded-lg text-white font-bold"
									onClick={handleSendRequest}
								>
									Send Request
								</button>
							)}
							{hasRequest === 1 && (
								<button
									className="bg-emerald-400 hover:bg-emerald-500 p-2 rounded-lg text-white font-bold mr-2"
									onClick={handleCancelRequest}
								>
									Cancel Request
								</button>
							)}
							{hasRequest === 2 && (
								<div>
									<button
										className="bg-green-500 hover:bg-green-600 p-2 rounded-lg text-white font-bold mr-2"
										onClick={handleAcceptRequest}
									>
										Accept Request
									</button>
									<button
										className="bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white font-bold mr-2"
										onClick={handleDeclineRequest}
									>
										Decline Request
									</button>
								</div>
							)}
							{hasRequest === 3 && (
								<div>
									<button
										className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg text-white font-bold mr-2"
										onClick={handleUnblockUser}
									>
										Unblock User
									</button>
								</div>
							)}
							{hasChat === 1 && (
								<div>
									<button
										className="bg-teal-500 hover:bg-teal-600 p-2 rounded-lg text-white font-bold mr-2"
										onClick={handleGoToChat}
									>
										Go To Chat
									</button>
								</div>
							)}
							{(hasRequest === 0 ||
								hasRequest == 1 ||
								hasRequest == 2 ||
								hasChat == 1) && (
								<div>
									<button
										className="bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white font-bold mr-2"
										onClick={handleBlockUser}
									>
										Block User
									</button>
								</div>
							)}
						</div>
					)}

					<div className="md:hidden">
						{!isEditing && (
							<>
								<div className="mb-4">
									<h1 className="font-bold text-4xl py-1">
										More about me
									</h1>
									<p className="text-lg my-2">
										{tempProfile.biography}
									</p>
								</div>
								<div>
									<h1 className="font-bold text-4xl py-1">
										My Tags
									</h1>
									<div className="flex flex-row flex-wrap">
										{profile.currentTags.map((tag) => {
											return (
												<div className="bg-[#0085ff] text-white rounded-lg px-4 py-2 my-2 mr-2 w-fit">
													{tag}
												</div>
											);
										})}
									</div>
								</div>
							</>
						)}
						{isUser && isEditing && (
							<>
								<div className="mb-4">
									<h1 className="font-bold text-4xl py-1">
										Edit your profile
									</h1>
								</div>
								<div className="mb-4">
									<label className="font-bold text-xl mt-2">
										Name:
									</label>
									<input
										className="w-full outline-none border-[1px] border-gray-800 rounded-lg font-normal text-xl p-1.5 block focus:outline-none focus:border-[#0085ff] focus:ring-1 focus:ring-[#0085ff]"
										type="text"
										value={tempProfile.fullName}
										required
										onChange={(e) =>
											setTempProfile({
												...tempProfile,
												fullName: e.target.value,
											})
										}
										readOnly={!isEditing}
									/>
								</div>
								<div className="mb-4">
									<label className="font-bold text-xl mt-2">
										User Name:
									</label>
									<input
										className="w-full outline-none border-[1px] border-gray-800 rounded-lg font-normal text-xl p-1.5 block focus:outline-none focus:border-[#0085ff] focus:ring-1 focus:ring-[#0085ff]"
										type="text"
										value={tempProfile.userName}
										onChange={(e) =>
											setTempProfile({
												...tempProfile,
												userName: e.target.value,
											})
										}
										readOnly={!isEditing}
									/>
								</div>
								<div className="mb-4">
									<label className="font-bold text-xl mt-2">
										Email:
									</label>
									<input
										className="w-full outline-none border-[1px] border-gray-800 rounded-lg font-normal text-xl p-1.5 block focus:outline-none focus:border-[#0085ff] focus:ring-1 focus:ring-[#0085ff]"
										type="email"
										value={tempProfile.email}
										onChange={(e) =>
											setTempProfile({
												...tempProfile,
												email: e.target.value,
											})
										}
										readOnly={!isEditing}
									/>
								</div>
								<div className="mb-4">
									<label className="font-bold text-xl mt-2">
										Country:
									</label>
									<input
										className="w-full outline-none border-[1px] border-gray-800 rounded-lg font-normal text-xl p-1.5 block focus:outline-none focus:border-[#0085ff] focus:ring-1 focus:ring-[#0085ff]"
										type="text"
										value={tempProfile.country}
										onChange={(e) =>
											setTempProfile({
												...tempProfile,
												country: e.target.value,
											})
										}
										readOnly={!isEditing}
									/>
								</div>
								<div className="mb-4">
									<label className="font-bold text-xl mt-2">
										Address:
									</label>
									<input
										className="w-full outline-none border-[1px] border-gray-800 rounded-lg font-normal text-xl p-1.5 block focus:outline-none focus:border-[#0085ff] focus:ring-1 focus:ring-[#0085ff]"
										type="text"
										value={tempProfile.address}
										onChange={(e) =>
											setTempProfile({
												...tempProfile,
												address: e.target.value,
											})
										}
										readOnly={!isEditing}
									/>
								</div>

								<div className="mb-4">
									<label className="font-bold text-xl mt-2">
										Tags:
									</label>
									<OccupationTags
										id="occupationTags"
										inputName="occupationTags"
										currentTags={currentTags}
										setTags={setTags}
									/>
								</div>
								<div className="mb-4">
									<label className="font-bold text-xl mt-2">
										Bio:
									</label>
									<textarea
										className="w-full outline-none border-[1px] border-gray-800 rounded-lg font-normal text-xl p-1.5 block focus:outline-none focus:border-[#0085ff] focus:ring-1 focus:ring-[#0085ff]"
										value={tempProfile.biography}
										onChange={(e) =>
											setTempProfile({
												...tempProfile,
												biography: e.target.value,
											})
										}
										readOnly={!isEditing}
										rows={5}
										cols={30}
									/>
								</div>
								{isUser && isEditing && (
									<div className="md:hidden flex flex-row justify-between">
										<div className="my-2 flex flex-row justify-between">
											<button
												className="shadow-xl p-2 text-lg rounded-lg bg-gray-800 hover:bg-gray-900 text-white"
												onClick={handleSave}
											>
												Save Changes
											</button>
										</div>
										<div className="my-2 flex flex-row justify-between">
											<button
												className="shadow-xl p-2 text-lg rounded-lg bg-red-500 hover:bg-red-600 text-white"
												onClick={handleCancel}
											>
												Cancel
											</button>
										</div>
									</div>
								)}
							</>
						)}
					</div>
				</div>
				<div className="hidden md:inline-block bg-white shadow-lg flex-1 ml-4 rounded-lg p-10 overflow-y-scroll">
					{!isEditing && (
						<>
							<div className="mb-4">
								<h1 className="font-bold text-4xl py-1">
									More about me
								</h1>
								<p className="text-lg my-2">
									{tempProfile.biography}
								</p>
							</div>
							<div>
								<h1 className="font-bold text-4xl py-1">
									My Tags
								</h1>
								<div className="flex flex-row flex-wrap">
									{profile.currentTags.map((tag) => {
										return (
											<div className="bg-[#0085ff] text-white rounded-lg px-4 py-2 my-2 mr-2 w-fit">
												{tag}
											</div>
										);
									})}
								</div>
							</div>
						</>
					)}
					{isUser && isEditing && (
						<>
							<div className="mb-4">
								<h1 className="font-bold text-4xl py-1">
									Edit your profile
								</h1>
							</div>
							<div className="mb-4">
								<label className="font-bold text-xl mt-2">
									Name:
								</label>
								<input
									className="w-full outline-none border-[1px] border-gray-800 rounded-lg font-normal text-xl p-1.5 block focus:outline-none focus:border-[#0085ff] focus:ring-1 focus:ring-[#0085ff]"
									type="text"
									value={tempProfile.fullName}
									required
									onChange={(e) =>
										setTempProfile({
											...tempProfile,
											fullName: e.target.value,
										})
									}
									readOnly={!isEditing}
								/>
							</div>
							<div className="mb-4">
								<label className="font-bold text-xl mt-2">
									User Name:
								</label>
								<input
									className="w-full outline-none border-[1px] border-gray-800 rounded-lg font-normal text-xl p-1.5 block focus:outline-none focus:border-[#0085ff] focus:ring-1 focus:ring-[#0085ff]"
									type="text"
									value={tempProfile.userName}
									onChange={(e) =>
										setTempProfile({
											...tempProfile,
											userName: e.target.value,
										})
									}
									readOnly={!isEditing}
								/>
							</div>
							<div className="mb-4">
								<label className="font-bold text-xl mt-2">
									Email:
								</label>
								<input
									className="w-full outline-none border-[1px] border-gray-800 rounded-lg font-normal text-xl p-1.5 block focus:outline-none focus:border-[#0085ff] focus:ring-1 focus:ring-[#0085ff]"
									type="email"
									value={tempProfile.email}
									onChange={(e) =>
										setTempProfile({
											...tempProfile,
											email: e.target.value,
										})
									}
									readOnly={!isEditing}
								/>
							</div>
							<div className="mb-4">
								<label className="font-bold text-xl mt-2">
									Country:
								</label>
								<input
									className="w-full outline-none border-[1px] border-gray-800 rounded-lg font-normal text-xl p-1.5 block focus:outline-none focus:border-[#0085ff] focus:ring-1 focus:ring-[#0085ff]"
									type="text"
									value={tempProfile.country}
									onChange={(e) =>
										setTempProfile({
											...tempProfile,
											country: e.target.value,
										})
									}
									readOnly={!isEditing}
								/>
							</div>
							<div className="mb-4">
								<label className="font-bold text-xl mt-2">
									Address:
								</label>
								<input
									className="w-full outline-none border-[1px] border-gray-800 rounded-lg font-normal text-xl p-1.5 block focus:outline-none focus:border-[#0085ff] focus:ring-1 focus:ring-[#0085ff]"
									type="text"
									value={tempProfile.address}
									onChange={(e) =>
										setTempProfile({
											...tempProfile,
											address: e.target.value,
										})
									}
									readOnly={!isEditing}
								/>
							</div>

							<div className="mb-4">
								<label className="font-bold text-xl mt-2">
									Tags:
								</label>
								<OccupationTags
									id="occupationTags"
									inputName="occupationTags"
									currentTags={currentTags}
									setTags={setTags}
								/>
							</div>
							<div className="mb-4">
								<label className="font-bold text-xl mt-2">
									Bio:
								</label>
								<textarea
									className="w-full outline-none border-[1px] border-gray-800 rounded-lg font-normal text-xl p-1.5 block focus:outline-none focus:border-[#0085ff] focus:ring-1 focus:ring-[#0085ff]"
									value={tempProfile.biography}
									onChange={(e) =>
										setTempProfile({
											...tempProfile,
											biography: e.target.value,
										})
									}
									readOnly={!isEditing}
									rows={5}
									cols={30}
								/>
							</div>
						</>
					)}
				</div>
			</section>
		</>
	);
}

export default EditProfile;
