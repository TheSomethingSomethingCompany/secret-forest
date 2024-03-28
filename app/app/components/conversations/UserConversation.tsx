import React from "react";

type Props = {
	onChatClick: (e: any) => void;
	chatID: string;
	profilePicture: string;
	name: string;
	username: string;
	newMessages: number;
	isPinned: boolean;
};

export default function UserConversation({
	onChatClick,
	chatID,
	profilePicture,
	name,
	username,
	newMessages,
	isPinned,
}: Props) {
	return (
		<div
			className="flex flex-row justify-between items-center p-4 border-2 border-transparent rounded-lg h-full max-h-[8rem] m-4 shadow hover:cursor-pointer"
			onClick={onChatClick}
			data-chat-id={chatID}
		>
			<div className="flex flex-row justify-start items-center mr-1 max-w-[25rem] overflow-hidden">
				<img
					src={profilePicture}
					alt="ProfilePicture"
					className="relative z-10 max-h-[6rem] max-w-[6rem] min-w-[6rem] min-h-[6rem] h-24 w-24 mr-2 rounded-full object-cover"
				/>
				<div className="ml-2 flex flex-col justify-between items-start">
					<div>
						<p className="text-[1.35rem] font-bold break-words w-[20rem]">
							{name}
						</p>
						<p className="text-[1.1rem] font-light">@{username}</p>
					</div>
					{/*<div>
						<i className="ri-check-double-fill text-3xl text-green-600"></i>
					</div>
					*/}
				</div>
			</div>
			<div className="flex flex-col justify-between items-center h-full">
				{isPinned && <i className="ri-pushpin-fill text-[1.7rem]"></i>}
				{newMessages !== 0 && (
					<span className="relative inline-block">
						<i className="ri-chat-3-fill text-4xl"></i>
						<p className="absolute top-[50%] left-[50%] text-white translate-x-[-50%] translate-y-[-50%] font-bold text-[0.9rem]">
							{newMessages}
						</p>
					</span>
				)}
			</div>
		</div>
	);
}
