"use client";
import React from "react";
import retrieveChats from "./api/retrieveChatsFromServer";
import { get } from "http";
import { useRef, useEffect, useState, use } from "react";
import GetProfilePicture from "../profile/api/getPFP";

import PenguinC from "@/app/images/PenguinC.jpeg";
import ChatBubble from "../../components/conversations/ChatBubble";
import { useWebSocket } from "../../contexts/WebSocketContext";
import NoChatSelectedSVG from "@/public/noconversationSelected.svg";
import NoMessagesSVG from "@/public/nomessages.svg";
import UserConversation from "@/app/components/conversations/UserConversation";
import ImageCard from "@/app/components/conversations/ImageCard";
import Image from "next/image";
import { Router } from "lucide-react";
import {useRouter} from "next/navigation";

const dotenv = require("dotenv");
dotenv.config();

export default function Chats() {
	
	const {userStatus, sendMessage } = useWebSocket();
	const router = useRouter();
	const [chatsList, setChatsList] = useState<
		{
			chatID: string;
			profilePicture: string;
			name: string;
			username: string;
		}[]
	>([]);
	const [messagesList, setMessagesList] = useState<
		{
			messageID: string;
			message: string;
			name: string;
			fileExtension: string;
			isYou: boolean;
			signedURL: string;
		}[]
	>([]);
	const [message, setMessage] = useState("");
	const [file, setFile] = useState<any>(null);
	const [shouldBlur, setShouldBlur] = useState(false);
	const [showOptions, setShowOptions] = useState(false);

	const [loggedInPfp, setLoggedInPfp] = useState(``);
	const [chatsProfilePictures, setChatsProfilePictures] = useState(new Map());


	// Create a WebSocket connection to the server

	const ws = useRef(null);
	const inputRef = useRef(null);
	const uploadRef = useRef(null);
	const chatID = useRef("");

	

	//  INFORMATION: QUICK NAVIGATE TO INPUT

	useEffect(() => {
		const handleKeyDownConv = (event: any) => {
			if (event.code === "KeyK") {
				event.preventDefault();
				inputRef.current?.focus();
			}
		};

		window.addEventListener("keydown", handleKeyDownConv);

		return () => {
			window.removeEventListener("keydown", handleKeyDownConv);
		};
	}, []);

	//  INFORMATION: WEBSOCKETS

	useEffect(() => {
		ws.current = new WebSocket(`ws://${process.env.NEXT_PUBLIC_DNS}:7979`);
		ws.current.onopen = () => {
			console.log("WebSocket connection opened");
		};
		ws.current.onmessage = (event: any) => {
			const response = JSON.parse(event.data);
			console.log("Message from server: ", response);
			if (response.broadcast) {
				if (response.chatID == chatID.current)
					getMessages(chatID.current);
			} else {
				switch (response.action) {
					case "retrieveMessages":
						switch(response.status)
						{
							case 200:
								response.chatMessages.sort((a: any, b: any) =>
								a.messageID > b.messageID ? 1 : -1
								);
								setMessagesList(response.chatMessages);
								break;
							case 404:
								setMessagesList([]);
								break;
							case 500:
								alert("Error in fetching messages. Please try again later.");
								setMessagesList([]);
								break;
						}
						break;
					case "insertMessage":
						switch(response.status)
						{
							case 201:
								console.log("Message sent successfully!");
								break;
							case 401:
								console.log("Unauthorized: Sending message to a chat logged in user is not a part of.");
								alert("Unauthorized to send message to this chat.");
								break;
							case 500:
								console.log("Error in sending message.");
								alert("Error in sending message. Please try again later.");
								break;
						}
						break;
					case "deleteMessage":
						switch(response.status)
						{
							case 201:
								console.log("Message deleted successfully!");
								break;
							case 401:
								console.log("Unauthorized: Deleting message logged in user is not a part of.");
								alert("Unauthorized to delete a message in this chat.");
								break;
							case 403:
								console.log("Forbidden: Deleting message that is not sent by the logged in user.");
								alert("Forbidden to delete this message, as it is not sent by you.");
								break;
							case 500:
								console.log("Error in deleting message.");
								alert("Error in deleting message. Please try again later.");
								break;
						}
						break;
					case "editMessage":
						switch(response.status)
						{
							case 201:
								console.log("Message edited successfully!");
								break;
							case 401:
								console.log("Unauthorized: Editing message logged in user is not a part of.");
								alert("Unauthorized to edit a message in this chat.");
								break;
							case 403:
								console.log("Forbidden: Editing message that is not sent by the logged in user.");
								alert("Forbidden to edit this message, as it is not sent by you.");
								break;
							case 500:
								console.log("Error in editing message.");
								alert("Error in editing message. Please try again later.");
								break;
						}
						break;
				}
			}
			sendMessage("signedIn", {});
		};

		ws.current.onclose = () => {
			console.log("WebSocket connection closed");
		};

		ws.current.onerror = (event) => {
			console.error("WebSocket error: ", event);
		};

		// Clean up the WebSocket connection when the component unmounts
		return () => {
			if (ws.current) {
				ws.current.close();
			}
		};
	}, []);

	async function getChats(searchQuery: string) {
		let res = await retrieveChats(searchQuery);
		console.log("RESPONSE FROM SERVER FOR CHATS:");
		console.log(res);

		switch(res.status)
		{
			case 200:
				setChatsList(res.data);
				const loggedInUsername = res.data[0].loggedInUsername;
				const pfpPath1 = await GetProfilePicture({
					username: loggedInUsername,
				});
				setLoggedInPfp(pfpPath1.data);
	
				const chatsProfilePicturesContainer = new Map();
				for (let i = 0; i < res.data.length; i++) {
					console.log("Username: " + res.data[i].username);
					const pfpPath = await GetProfilePicture({
						username: res.data[i].username,
					});
					console.log("PFP: " + pfpPath.data);
					chatsProfilePicturesContainer.set(
						res.data[i].chatID,
						pfpPath.data
					);
				}
	
				setChatsProfilePictures(chatsProfilePicturesContainer);
				console.log("Chats Images: " + chatsProfilePicturesContainer);
				break;
			case 404:
				setChatsList([]);
				break;
			case 500:
				alert("Error in fetching chats. Please try again later.");
				setChatsList([]);
				break;

		}

	}

	async function getMessages(chatID: string) {
		const dataToSendToWSS = JSON.stringify({
			action: "retrieveMessages",
			body: { chatID: chatID },
		});
		ws.current.send(dataToSendToWSS);
	}

	async function onSendMessage() {
		console.log("SENDING MESSAGE: " + message);
		console.log("CURRENT CHAT ID: " + chatID.current);
		const body = {
			chatID: chatID.current,
			message: message,
			file: file,
			shouldBlur: shouldBlur,
		};
		const dataToSendToWSS = JSON.stringify({
			action: "insertMessage",
			body: body,
		});
		ws.current.send(dataToSendToWSS);
		setMessage("");
	}

	// On mount, get the chats
	useEffect(() => {
		getChats("");
	}, []);



	// INFORMATION: CHAT FUNCTIONALITY
	function onChatClick(e: any) {
		console.log(
			"Clicked on chat with id: " + e.currentTarget.dataset.chatId
		); // currentTarget specifies that even if you click a child element, the event is triggered for the parent element which has the event attached, not the child element directly.
		chatID.current = e.currentTarget.dataset.chatId;
		getMessages(chatID.current);
	}

	function onSendingMessage(e: any) {
		setMessage(e.target.value);
		console.log("MESSAGE: " + message);
	}

	function onDeleteButtonClick(e: any) {
		console.log(
			"Clicked on delete button with message id: " +
				e.currentTarget.dataset.messageId
		);
		// Now, we need to remove the message from the message list
		let messageId = e.currentTarget.dataset.messageId;
		/*
		let newMessagesList = messagesList.filter(
		  (message) => message.messageID != messageId
		);
		*/
		// Next, we need to make an api call to delete the message from the server
		const dataToSendToWSS = JSON.stringify({
			action: "deleteMessage",
			body: { messageID: messageId, chatID: chatID.current },
		});
		ws.current.send(dataToSendToWSS);
	}

	function saveToDatabaseHandler(editedMessage: string, messageID: string) {
		console.log("Saving message to database: " + editedMessage);
		// Now, we need to make an api call to edit the message on the server
		const dataToSendToWSS = JSON.stringify({
			action: "editMessage",
			body: {
				messageID: messageID,
				message: editedMessage,
				chatID: chatID.current,
			},
		});
		ws.current.send(dataToSendToWSS);
	}

	const prevMessagesListLength = useRef(messagesList.length);
	useEffect(() => {
		if (messagesList.length > prevMessagesListLength.current) {
			const messagesDiv = document.getElementById("list-messages-div");
			if (messagesDiv) {
				messagesDiv.scrollTop = messagesDiv.scrollHeight;
			}
		}
		prevMessagesListLength.current = messagesList.length;
	}, [messagesList]);


	//  INFORMATION: FILE UPLOAD VIA WEBSOCKETS
	function onFileChange(e: any) {
		const file = e.target.files[0];
		toBase64(file).then((base64File) => {
			const fileObject = {
				originalName: file.name,
				mimetype: file.type,
				fileData: base64File,
			};
			setFile(fileObject);
			console.log(fileObject);
		});
	}

	function toBase64(file: any) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	}

	return (
		<>
			<section className="hidden lg:flex flex-row w-full h-full chat-height justify-center items-start px-8 py-4 z-50">
				<section className="flex flex-col rounded-lg shadow w-full lg:w-[30rem] min-w-[30rem] lg:max-w-[30rem] h-full mr-2 bg-white">
					<div className="flex flex-row outline-black w-auto shadow rounded-lg h-fit px-4 py-2 m-4 lg:max-w-[28rem] items-center justify-center">
						<i className="ri-search-eye-fill text-[1.7rem] mr-1"></i>
						<form className="flex-1 h-auto ml-1">
							<input
								ref={inputRef}
								className="w-full h-full px-2 outline-none"
								placeholder="Search for user..."
								onKeyDown={(e) => {
										if(e.key=== "Enter")
										{
											e.preventDefault();
											getChats(e.currentTarget.value);
										}
								
									}
								}
							/>
						</form>
						<kbd className="bg-black text-white p-2 rounded-lg">
							k
						</kbd>
					</div>
					<div className="flex-1 overflow-y-scroll overflow-x-hidden">
						{chatsList.length == 0 && (
							<div className="flex flex-row justify-between items-center p-4 border-2 border-transparent rounded-lg h-full max-h-[8rem] m-4 shadow">
								<p className="text-[1rem] font-normal break-words w-[20rem]">
									You don't have any chats yet! Start a new
									chat today!
								</p>
							</div>
						)}
						{chatsList.length != 0 &&
							chatsList.map((chat) => {
								return (
									<UserConversation
										onChatClick={onChatClick}
										chatID={chat.chatID}
										profilePicture={chatsProfilePictures.get(
											chat.chatID
										)}
										name={chat.name}
										username={chat.username}
										isPinned={false}
										newMessages={0}
									/>
								);
							})}
					</div>
				</section>
				<section className="hidden lg:flex flex-col items-start w-full rounded-lg shadow h-full bg-white ml-2">
					<div className="max-h-[88%] px-4 py-2 p-4 h-full mb-0 w-full overflow-scroll">
						{chatID.current === "" && (
							<ImageCard
								imageSource={NoChatSelectedSVG}
								alt="No Chats Selected"
								title="No conversation selected"
								description="Looks like you haven’t selected a conversation yet. Select one to start talking."
							/>
						)}
						{chatID.current !== "" && messagesList.length === 0 && (
							<ImageCard
								imageSource={NoMessagesSVG}
								alt="No messages"
								title="No messages yet"
								description="Looks like you haven’t started a conversation with Satanshu yet. Be the first to say hello 👋!"
							/>
						)}
						{messagesList.map((message) => {
							return (
								<ChatBubble
									key={message.messageID + message.message}
									id={message.messageID}
									name={message.name}
									message={message.message}
									profilePictureYou={loggedInPfp}
									profilePictureThem={chatsProfilePictures.get(
										parseInt(chatID.current)
									)}
									hasAttachment={false}
									attachmentExt={
										message.fileExtension
											? message.fileExtension
											: null
									}
									isYou={message.isYou}
									onDeleteButtonClick={onDeleteButtonClick}
									saveToDatabaseHandler={
										saveToDatabaseHandler
									}
									signedURL={
										message.signedURL
											? message.signedURL
											: null
									}
								/>
							);
						})}
					</div>
					{chatID.current !== "" && (
						<div className="px-4 py-2 my-2 w-full bg-transparent">
							<div className="flex flex-row outline-black shadow rounded-lg h-fit w-full px-4 py-2 items-center justify-center">
								<div className="flex-1 flex flex-row h-auto ml-1 items-center">
									<div
										className="relative"
										onMouseEnter={() => {
											setShowOptions(true);
										}}
										onMouseLeave={() => {
											setShowOptions(false);
										}}
									>
										{showOptions && (
											<div className="absolute p-4 shadow bg-white bottom-full rounded-lg right-[-100%]">
												<div className="shadow rounded-lg bg-pink-500 hover:bg-pink-600 hover:cursor-pointer">
													<label htmlFor="fileInput">
														<i className="ri-file-upload-fill text-[1.7rem] mr-1 text-white p-4 hover:cursor-pointer"></i>
													</label>
													<input
														type="file"
														onChange={onFileChange}
														className="hidden"
														ref={uploadRef}
														id="fileInput"
													/>
												</div>
											</div>
										)}
										<i className="ri-layout-grid-fill text-[1.7rem] mr-1 hover:cursor-pointer"></i>
									</div>
									<div className="flex flex-col justify-start items-start px-4">
										<p className="font-bold text-[1rem]">
											Blur Video
										</p>
										<input
											type="checkbox"
											onChange={(e) =>
												setShouldBlur(e.target.checked)
											}
										/>
									</div>
									<input
										className="w-full h-auto px-2 outline-none flex-1"
										placeholder="Send a message"
										onChange={onSendingMessage}
										onKeyDown={(e) => {
											if (e.key == "Enter") {
												e.preventDefault();
												onSendMessage();
											}
										}}
										value={message}
									/>
									<button
										type="button"
										className="hover:cursor-pointer bg-white p-1 rounded-lg"
										onClick={onSendMessage}
									>
										<i className="ri-send-plane-2-fill text-[1.7rem] ml-1 text-black"></i>
									</button>
								</div>
								{
									//<kbd>o</kbd>
								}
							</div>
						</div>
					)}
				</section>
			</section>
			<section className="flex lg:hidden flex-row w-full h-full max-h-screen overflow-hidden chat-height justify-center items-start px-8 py-4 z-50 bg-white">
				{chatID.current === "" && (
					<section className="flex-1 flex flex-col rounded-lg shadow-lg w-full lg:w-[30rem] min-w-[30rem] lg:max-w-[30rem] h-full mr-2 bg-white">
						<div className="flex flex-row outline-black w-auto shadow rounded-lg h-fit px-4 py-2 m-4 lg:max-w-[28rem] items-center justify-center">
							<i className="ri-search-eye-fill text-[1.7rem] mr-1"></i>
							<form className="flex-1 h-auto ml-1">
								<input
									ref={inputRef}
									className="w-full h-full px-2 outline-none"
									placeholder="Search for user..."
								/>
							</form>
							<kbd className="bg-black text-white p-2 rounded-lg">
								k
							</kbd>
						</div>
						<div className="flex-1 overflow-y-scroll overflow-x-hidden">
							{chatsList.length == 0 && (
								<div className="flex flex-row justify-between items-center p-4 border-2 border-transparent rounded-lg h-full max-h-[8rem] m-4 shadow">
									<p className="text-[1rem] font-normal break-words w-[20rem]">
										You don't have any chats yet! Start a
										new chat today!
									</p>
								</div>
							)}
							{chatsList.length != 0 &&
								chatsList.map((chat) => {
									return (
										<UserConversation
											onChatClick={onChatClick}
											chatID={chat.chatID}
											profilePicture={chatsProfilePictures.get(
												chat.chatID
											)}
											name={chat.name}
											username={chat.username}
											isPinned={false}
											newMessages={0}
										/>
									);
								})}
						</div>
					</section>
				)}
				{chatID.current !== "" && (
					<section className="flex flex-col rounded-lg shadow w-full lg:w-[30rem] min-w-[30rem] lg:max-w-[30rem] h-full max-h-full mr-2 bg-white">
						<div className="flex-grow-0 flex-shrink-0 flex flex-row outline-black w-auto shadow rounded-lg px-4 py-2 m-4 lg:max-w-[28rem] items-center justify-center bg-white">
							<div
								className="p-2 shadow bg-black h-8 w-8 rounded flex flex-col justify-center items-center hover:cursor-pointer"
								onClick={() => {
									chatID.current = "";
									setMessagesList([]);
								}}
							>
								<i className="ri-arrow-left-line text-[1.2rem] text-white"></i>
							</div>
							<div className="flex-1 flex flex-row justify-center items-center">
								<Image
									src={chatsProfilePictures.get(
										parseInt(chatID.current)
									)}
									alt="Profile Picture"
									width={30}
									height={30}
								/>
								<p className="text-lg font-normal text-black ml-2">
									{
										chatsList.find(
											(chat) =>
												chat.chatID === parseInt(chatID.current)
										)?.name
									}
								</p>
							</div>
						</div>
						<div className="flex-1  overflow-scroll px-2">
							{chatID.current !== "" &&
								messagesList.length === 0 && (
									<ImageCard
										imageSource={NoMessagesSVG}
										alt="No messages"
										title="No messages yet"
										description="Looks like you haven’t started a conversation with Satanshu yet. Be the first to say hello 👋!"
										mode="small"
									/>
								)}
							{messagesList.map((message) => {
								return (
									<ChatBubble
										key={
											message.messageID + message.message
										}
										id={message.messageID}
										name={message.name}
										message={message.message}
										profilePictureYou={loggedInPfp}
										profilePictureThem={chatsProfilePictures.get(
											parseInt(chatID.current)
										)}
										hasAttachment={false}
										attachmentExt={
											message.fileExtension
												? message.fileExtension
												: null
										}
										isYou={message.isYou}
										onDeleteButtonClick={
											onDeleteButtonClick
										}
										saveToDatabaseHandler={
											saveToDatabaseHandler
										}
										signedURL={
											message.signedURL
												? message.signedURL
												: null
										}
										mode="small"
									/>
								);
							})}
						</div>
						<div className="flex-grow-0 flex-shrink-0 flex flex-row outline-black shadow rounded-lg w-auto px-4 py-2 m-4 items-center justify-center bg-white">
							<div className="flex-1 flex flex-row h-auto ml-1 items-center">
								<div
									className="relative"
									onMouseEnter={() => {
										setShowOptions(true);
									}}
									onMouseLeave={() => {
										setShowOptions(false);
									}}
								>
									{showOptions && (
										<div className="absolute p-4 shadow bg-white bottom-full rounded-lg right-[-100%]">
											<div className="shadow rounded-lg bg-pink-500 hover:bg-pink-600 hover:cursor-pointer">
												<label htmlFor="fileInput">
													<i className="ri-file-upload-fill text-[1.7rem] mr-1 text-white p-4 hover:cursor-pointer"></i>
												</label>
												<input
													type="file"
													onChange={onFileChange}
													className="hidden"
													ref={uploadRef}
													id="fileInput"
												/>
											</div>
										</div>
									)}
									<i className="ri-layout-grid-fill text-[1.7rem] mr-1 hover:cursor-pointer"></i>
								</div>
								<div className="flex flex-col justify-start items-start px-4">
									<p className="font-bold text-[1rem]">
										Blur
									</p>
									<input
										type="checkbox"
										onChange={(e) =>
											setShouldBlur(e.target.checked)
										}
									/>
								</div>
								<input
									className="w-full h-auto outline-none flex-1 mr-2 border-[1px] border-black p-2 rounded-lg"
									placeholder="Send a message"
									onChange={onSendingMessage}
									onKeyDown={(e) => {
										if (e.key == "Enter") {
											e.preventDefault();
											onSendMessage();
										}
									}}
									value={message}
								/>
								<button
									type="button"
									className="hover:cursor-pointer bg-white p-1 rounded-lg"
									onClick={onSendMessage}
								>
									<i className="ri-send-plane-2-fill text-[1.7rem] ml-1 text-black"></i>
								</button>
							</div>
							{
								//<kbd>o</kbd>
							}
						</div>
					</section>
				)}
			</section>
		</>
	);
}
