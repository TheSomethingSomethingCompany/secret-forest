"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "remixicon/fonts/remixicon.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

import DropMenu from "./DropMenu";

import Logo from "../../images/TheSomethingSomethingCompanyLogoV3.svg";
import Penguin from "../../images/ExamplePenguin.jpeg";

import { useWebSocket } from "@/app/contexts/WebSocketContext";

type NavBarProps = {
	isLoggedIn?: boolean;
};

export default function Navbar({ isLoggedIn }: NavBarProps) {
	const router = useRouter();
	const { userStatus } = useWebSocket();

	const [isOpen, setIsOpen] = useState(false);
	const [disableDropdown, setDisableDropdown] = useState(false);

	return (
		<nav className="sticky top-0 left-0 z-50 w-screen px-8 py-4 flex flex-row justify-between items-center text-[1rem]">
			{/* LOGO SECTION (LEFT) */}
			<section>
				<div
					className="hover:cursor-pointer"
					onClick={() => router.push("./")}
				>
					<Image
						src={Logo}
						alt={"TheSomethingSomethingCompany"}
					></Image>
				</div>
			</section>
			{userStatus === "signedOut" && (
				<section>
					<section className="flex flex-row justify-end items-center">
						<div
							className="font-bold my-4 mx-8 border-b-4 border-transparent translate-y-1 hover:border-black transition-all duration-200 ease-in-out hover:cursor-pointer"
							onClick={() => router.push("/auth?signin=true")}
						>
							LOG IN
						</div>
						<div
							className="font-bold text-white bg-[#0085FF] hover:bg-[#006FD5] p-4 rounded-xl transition-all duration-200 ease-in-out hover:cursor-pointer"
							onClick={() => router.push("./auth?signin=false")}
						>
							GET STARTED FOR FREE
						</div>
					</section>
				</section>
			)}
			{userStatus === "signedIn" && (
				<section>
					<section className="flex flex-row justify-end items-center">
						<div
							className="font-bold my-4 mx-8 border-b-4 border-transparent translate-y-1 hover:border-blue-600 transition-all duration-200 ease-in-out"
							onClick={() => router.push("/sandbox")}
						>
							SANDBOX
						</div>
						<Link
							className="font-bold my-4 mx-8 border-b-4 border-transparent translate-y-1 hover:border-blue-600 transition-all duration-200 ease-in-out"
							href={"./"}
						>
							CHATS
						</Link>
						<section
							onMouseEnter={() => setIsOpen(true)}
							onMouseLeave={() => setIsOpen(false)}
							style={
								{
									hoverColor: disableDropdown
										? "transparent"
										: "#f7f7f7",
								} as any
							}
						>
							<div className="hover:bg-[hoverColor] px-4 py-2 rounded-xl transition-all duration-200 ease-in-out cursor-pointer">
								<section className="flex flex-row items-center justify-center">
									{!disableDropdown && (
										<i className="ri-arrow-drop-down-line text-4xl"></i>
									)}
									<p className="px-4">
										<span className="font-bold">
											WELCOME,
											<br />
										</span>
										SATANSHU
									</p>
									<Image
										src={Penguin}
										alt={"Profile Picture"}
										className="w-14 h-1w-14 rounded-full"
									></Image>
								</section>
							</div>
							{!disableDropdown && (
								<div className="relative">
									<DropMenu isOpen={isOpen} />
								</div>
							)}
						</section>
					</section>
				</section>
			)}
		</nav>
	);
}
