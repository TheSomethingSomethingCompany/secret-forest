"use client";
import React, { useState, useRef } from "react";
import Cat from "@/app/images/CuteClef.png";
import Penguin from "@/app/images/ExamplePenguin.jpeg";
import PenguinB from "@/app/images/PenguinB.jpeg";
import PenguinC from "@/app/images/PenguinC.jpeg";
import Image from "next/image";
import "remixicon/fonts/remixicon.css";

type props = {
	id: string;
	name: string;
	message: string;
	signedURL: string;
	profilePictureYou: string;
	profilePictureThem: string;
	hasAttachment: boolean;
	attachment?: string;
	attachmentExt?: string;
	isYou: boolean;
	onDeleteButtonClick: (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => void;
	saveToDatabaseHandler: (editedMessage: string, messageID: string) => void;
	mode: string;
};

function ChatBubble({
	id,
	name,
	message,
	signedURL,
	profilePictureYou,
	profilePictureThem,
	hasAttachment,
	attachment,
	attachmentExt,
	isYou,
	onDeleteButtonClick,
	saveToDatabaseHandler,
	mode = "normal",
}: props) {
	const [mouseOver, setMouseOver] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [messageText, setMessageText] = useState(message);
	const referenceToMessageBox = useRef(null);
	const referenceToEditBox = useRef<HTMLInputElement>(null); // Can't use useState otherwise a rerender will be forced on every keystroke of the input field when editing.

	/* We need to use the reference to replace its innerHTML with an input box when the edit button is clicked. */
	function onEditButtonClick(
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) {
		setIsEditing(true);
	}

	console.log(mouseOver);
	return (
		<section
			className="w-full"
			style={
				{
					"--margin-bottom": mode === "normal" ? "4.5rem" : "0rem",
				} as any
			}
		>
			{isYou ? (
				<div className="flex flex-row justify-end w-full relative mb-[--margin-bottom]">
					<div
						className="p-2 text-xl max-w-md w-full"
						onMouseEnter={() => setMouseOver(true)}
						onMouseLeave={() => setMouseOver(false)}
						style={
							{
								"--translateAmt": mouseOver
									? mode === "normal"
										? "11rem"
										: "1.2rem"
									: mode === "normal"
										? "7rem"
										: "1.2rem",
								"--translateAmtHor": mouseOver
									? mode === "normal"
										? "18.5rem"
										: "27rem"
									: "18.5rem",
							} as any
						}
					>
						{mode === "normal" && (
							<div className="flex flex-row justify-end items-end w-full">
								<div className="relative z-0 p-2 mr-1 w-fit max-w-[14rem] flex flex-row justify-start bg-[#102E51] text-white rounded-lg text-start">
									<p id="name">{name}</p>
								</div>
								<img
									src={profilePictureYou}
									alt="ProfilePicture"
									className="relative z-10 min-w-[6rem] min-h-[6rem] max-w-[6rem] max-h-[6rem] h-24 w-24 rounded-full object-cover"
								/>
							</div>
						)}
						<div
							ref={referenceToMessageBox}
							className="relative z-10 mt-2 shadow-md drop-shadow-md rounded-lg w-full p-4 MESSAGEBOXISHERE bg-white"
						>
							{isEditing ? ( // Since the key of the ChatBubble does not change, we do not have to worry about the input field being cancelled as a result of Chats Page recreating the ChatBubble for every new message, since the corresponding ChatBubble will be recreated with the same key, and thus React will use the existing ChatBubble instead of creating a new one.
								<input
									ref={referenceToEditBox}
									type="text"
									defaultValue={messageText}
									className="w-full h-full"
								/>
							) : (
								<p id="message">{messageText}</p>
							)}

							{signedURL &&
								// THERE NEEDS TO BE A CHECK HERE IF THE FILE IS AN IMAGE OR A VIDEO

								(attachmentExt === "PNG" ||
								attachmentExt === "png" ||
								attachmentExt === "jpg" ||
								attachmentExt === "JPG" ||
								attachmentExt === "jpeg" ||
								attachmentExt === "JPEG" ||
								attachmentExt === "GIF" ||
								attachmentExt === "gif" ? (
									<img src={signedURL} alt="Signed Image" />
								) : (
									<video src={signedURL} controls />
								))}
						</div>

						{/* This is the div that contains the buttons. It is hidden by default, and is shown when the mouse hovers over the chat bubble. */}
						<div
							className={`absolute w-fit flex flex-row justify-start mx-4 top-[--translateAmt] bg-white shadow-lg right-[--translateAmtHor] rounded-lg transition-all duration-300`}
						>
							{isEditing ? (
								// If the user is editing the message, show the save button, and the cancel button.
								<div
									className={`${mode === "small" ? "bg-white shadow-lg" : ""}  rounded-lg flex flex-row p-1.5`}
								>
									{" "}
									{/* DUE TO THIS, THE STYLES ARE NOT BEING APPLIED TO THESE INNER DIVS MOST LIKELY */}
									<div
										className="p-2 hover:bg-[#1e5696] bg-[#102E51] rounded-lg mx-[0.1rem] text-white hover:cursor-pointer"
										onClick={() => {
											setIsEditing(false);
											setMessageText(
												referenceToEditBox?.current
													?.value || ""
											);
											saveToDatabaseHandler(
												referenceToEditBox?.current
													?.value || "",
												id
											);
										}}
									>
										<i className="ri-save-fill"></i>
									</div>
									<div
										className="p-2 hover:bg-[#1e5696] bg-[#102E51] rounded-lg mx-[0.1rem] text-white hover:cursor-pointer"
										onClick={() => {
											setIsEditing(false);
										}}
									>
										<i className="ri-close-fill"></i>
									</div>
								</div>
							) : (
								<div
									className={`${mode === "small" ? "bg-white shadow-lg" : ""}  rounded-lg flex flex-row p-1.5`}
								>
									<div
										className="p-1.5 bg-[#102E51] rounded-lg mx-[0.1rem] text-white hover:cursor-pointer"
										onClick={onDeleteButtonClick}
										data-message-id={id}
									>
										<i className="ri-delete-bin-2-fill"></i>
									</div>
									<div
										className="p-1.5 bg-[#102E51] rounded-lg mx-[0.1rem] text-white cursor-pointer"
										onClick={() => {
											navigator.clipboard.writeText(
												document.getElementById(
													"message"
												)?.textContent ?? ""
											);
										}}
									>
										<i className="ri-clipboard-fill"></i>
									</div>
									<div
										className="p-1.5 bg-[#102E51] rounded-lg mx-[0.1rem] text-white hover:cursor-pointer"
										onClick={onEditButtonClick}
									>
										<i className="ri-edit-fill"></i>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			) : (
				<div
					className="relative p-2 text-xl max-w-md mb-[--margin-bottom]"
					onMouseEnter={() => setMouseOver(true)}
					onMouseLeave={() => setMouseOver(false)}
					style={
						{
							"--translateAmt": mouseOver
								? mode === "normal"
									? "11rem"
									: "1.4rem"
								: mode === "normal"
									? "7rem"
									: "1.4rem",
							"--translateAmtHor": mouseOver
								? mode === "normal"
									? "1.5rem"
									: "-3rem"
								: "1.5rem",
						} as any
					}
				>
					{mode === "normal" && (
						<div className="flex flex-row items-end">
							<img
								src={profilePictureThem}
								alt="ProfilePicture"
								className="relative w-24 h-2w-24 rounded-full object-scale-down z-10"
							/>
							<div className="relative ml-1 p-2 flex flex-row justify-start w-fit max-w-[14rem] bg-blue-600 text-white rounded-lg z-0 TAGHERE">
								<p id="name">{name}</p>
							</div>
						</div>
					)}
					<div className="relative z-10 mt-2 shadow-md drop-shadow-md rounded-lg bg-white w-full p-4">
						<p id="message">{messageText}</p>
						{signedURL &&
							// THERE NEEDS TO BE A CHECK HERE IF THE FILE IS AN IMAGE OR A VIDEO

							(attachmentExt === "png" ||
							attachmentExt === "jpg" ||
							attachmentExt === "jpeg" ||
							attachmentExt === "gif" ? (
								<img src={signedURL} alt="Signed Image" />
							) : (
								<video src={signedURL} controls />
							))}
					</div>
					<div
						className={`absolute w-fit flex flex-row justify-end top-[--translateAmt] bg-white p-1 shadow-lg right-[--translateAmtHor] rounded-lg transition-all duration-300`}
					>
						<div
							className="p-2 bg-blue-600 rounded-lg mx-[0.1rem] text-white cursor-pointer"
							onClick={() => {
								navigator.clipboard.writeText(
									document.getElementById("message")
										?.textContent ?? ""
								);
							}}
						>
							<i className="ri-clipboard-fill"></i>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}

export default ChatBubble;
