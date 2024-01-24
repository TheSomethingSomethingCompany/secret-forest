"use client";
import React from "react";
import PenguinC from "@/app/images/PenguinC.jpeg";
import { useEffect, useRef } from "react";

function page() {
    const inputRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event:any) => {
			event.preventDefault();
            if (event.code === 'KeyK') { 
                inputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
  return (
	<div className="flex flex-row w-screen chat-height justify-center items-start px-8 py-4 z-50">
		<section className="rounded-lg shadow w-[30rem] min-w-[30rem] max-w-[30rem] h-full mr-2 bg-white">
			<div className="flex flex-row outline-black shadow rounded-lg h-fit w-full px-4 py-2 m-4 max-w-[28rem] items-center justify-center">
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
		<section className="flex-1 rounded-lg shadow h-full bg-white ml-2">
			<p>Hi World</p>
		</section>
	</div>
  );
}

export default page;
