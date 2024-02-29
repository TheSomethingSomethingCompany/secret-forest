"use client";
import React from "react";
import PenguinC from "@/app/images/PenguinC.jpeg";
import { useEffect, useRef } from "react";
import ChatBubble from "../../components/conversations/ChatBubble";

function page() {
    const inputRef = useRef(null);

    useEffect(() => {
        const handleKeyDownConv = (event:any) => {
			if (event.code === 'KeyK') {
				event.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDownConv);

        return () => {
            window.removeEventListener('keydown', handleKeyDownConv);
        };
    }, []);



  return (
	<div className="flex flex-row w-screen chat-height justify-center items-start px-8 py-4 z-50">
		<section className="rounded-lg shadow w-full lg:w-[30rem] min-w-[30rem] lg:max-w-[30rem] h-full mr-2 bg-white">
			<div className="flex flex-row outline-black w-auto shadow rounded-lg h-fit px-4 py-2 m-4 lg:max-w-[28rem] items-center justify-center">
				<i className="ri-search-eye-fill text-[1.7rem] mr-1"></i>
				<form className="flex-1 h-auto ml-1">
					<input ref={inputRef} className="w-full h-full px-2 outline-none" placeholder="Search for user"/>
				</form>
				<kbd>k</kbd>
			</div>
			<div className="flex flex-row justify-between items-center p-4 border-2 border-transparent rounded-lg h-full max-h-[8rem] m-4 shadow">
				<div className="flex flex-row justify-start items-center mr-1 max-w-[25rem] overflow-hidden">
					<img
						src={PenguinC.src}
						alt="ProfilePicture"
						className="relative z-10 max-h-[6rem] max-w-[6rem] min-w-[6rem] min-h-[6rem] h-24 w-24 mr-2 rounded-full object-cover"
					/>
					<div className="ml-2 flex flex-col justify-between items-start">
						<div>
							<p className="text-[1.35rem] font-bold break-words w-[20rem]">Satanshu Mishra</p>
							<p className="text-[1.1rem] font-light">@SatanshuMishra</p>
						</div>
						<div>
							<i className="ri-check-double-fill text-3xl text-gray-400 text-green-600"></i>
						</div>
					</div>
				</div>
				<div className="flex flex-col justify-between items-center h-full">
					<i className="ri-pushpin-fill text-[1.7rem]"></i>
					<span className="relative inline-block">
						<i className="ri-chat-3-fill text-4xl"></i>
						<p className="absolute top-[50%] left-[50%] text-white translate-x-[-50%] translate-y-[-50%] font-bold text-[0.9rem]">1</p>
					</span>
				</div>
			</div>
		</section>
		<section className="hidden lg:flex flex-col items-start w-full rounded-lg shadow h-full bg-white ml-2">
			<div className="flex-1 px-4 py-2 m-4 mb-0 w-full overflow-y-scroll">
				<ChatBubble id='ID' name="Satanshu Mishra" message="This is amazing! ☃️" profilePicture="Smth" hasAttachment={false} isYou={true} />
				<ChatBubble id='ID' name="Trevor Fox" message="Indeed, this is amazing! 🐳" profilePicture="Smth" hasAttachment={false} isYou={false} />
			</div>
			<div className="px-4 py-2 my-2 w-full bg-transparent">
				<div className="flex flex-row outline-black shadow rounded-lg h-fit w-full px-4 py-2 items-center justify-center">
					<i className="ri-search-eye-fill text-[1.7rem] mr-1"></i>
					<form className="flex-1 flex flex-row h-auto ml-1">
						<input className="w-full h-auto px-2 outline-none flex-1" placeholder="Search for user"/>
						<button type="button" className="hover:cursor-pointer bg-white p-1 rounded-lg">
							<i className="ri-send-plane-2-fill text-[1.7rem] ml-1 text-black"></i>
						</button>
					</form>
					{
						//<kbd>o</kbd>
					}
				</div>
			</div>
		</section>
	</div>
  );
}

export default page;
