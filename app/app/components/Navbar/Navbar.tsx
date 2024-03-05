"use client";

import React, { useState, useEffect } from "react";
import "remixicon/fonts/remixicon.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import DropMenu from "./DropMenu";

import Logo from "../../images/TheSomethingSomethingCompanyLogoV3.svg";
import Penguin from "../../images/ExamplePenguin.jpeg";

import { useWebSocket } from "@/app/contexts/WebSocketContext";


export default function Navbar() {
	const router = useRouter();
	const { userStatus } = useWebSocket();
	const [isOpen, setIsOpen] = useState(false);
	const [isNavbarHidden, setIsNavbarHidden] = useState(false);
	
	let lastScrollY = 0; 

	useEffect(() => {
		let ticking = false;

		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					const scrollY = window.scrollY;
					const scrollDirection = scrollY > lastScrollY;
					setIsNavbarHidden(scrollDirection);
					lastScrollY = scrollY;
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navbarVariants = {
		visible: { opacity: 1, y: 0 },
		hidden: { opacity: 0, y: "-100%" },
	};

	return (
		<motion.nav
			className="sticky top-0 left-0 z-50 w-screen px-12 py-[8px] flex flex-row justify-between items-center text-[16px] shadow-lg bg-white"
			initial="visible" // Set the initial state
			animate={isNavbarHidden ? "hidden" : "visible"}
			variants={navbarVariants}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
		>
			{/* LOGO SECTION (LEFT) */}
			<section>
				<a
					className="hover:cursor-pointer"
					href="/"
				>
					<Image
						src={Logo}
						alt={"TheSomethingSomethingCompany"}
						width={190}
					></Image>
				</a>
			</section>
			{userStatus === "signedOut" && (
				<section>
					<section className="flex flex-row justify-end items-center text-[16px]">
						<div
							className="font-bold my-4 mx-8 border-b-4 border-transparent translate-y-1 hover:border-black transition-all duration-200 ease-in-out hover:cursor-pointer"
							onClick={() => router.push("/auth?signin=true")}
						>
							Log In
						</div>
						<div
							className="font-bold text-[#006FD5] hover:text-white border-[2px] border-[#006FD5] hover:border-[#0250bb] hover:bg-[#0250bb] px-2 py-1 rounded-sm transition-all duration-200 ease-in-out hover:cursor-pointer"
							onClick={() => router.push("./auth?signin=false")}
						>
							Get Started
						</div>
					</section>
				</section>
			)}
			{userStatus === "signedIn" && (
				<section>
					<section className="flex flex-row justify-end items-center text-[16px]">
						<div
							className="font-bold my-4 mx-[8px] px-[5.5px] py-[2px] shadow-sm border-[#d0d7de] text-[#57606a] hover:bg-[#eaedf1] translate-y-1 border-[1px] rounded-sm transition-all duration-200 ease-in-out hover:cursor-pointer"
							onClick={() => router.push("/search")}
						>
							 < i className="ri-search-2-fill text-[22px]"></i> 
						</div>
						<div
							className="font-bold my-4 mx-[8px] px-[5.5px] py-[2px] shadow-sm border-[#d0d7de] text-[#57606a] hover:bg-[#eaedf1] translate-y-1 border-[1px] rounded-sm transition-all duration-200 ease-in-out hover:cursor-pointer"
							onClick={() => router.push("/chats")}
						>
							 < i className="ri-at-line text-[22px]"></i> 
						</div>
						<section
							onMouseEnter={() => setIsOpen(true)}
							onMouseLeave={() => setIsOpen(false)}

						>
							<div className="font-normal my-2 mx-[8px] border-b-4 border-transparent translate-y-1 transition-all duration-200 ease-in-out hover:cursor-pointer flex flex-row items-center justify-center">
								<i className="ri-corner-left-down-line text-2xl translate-y-2 text-[#57606a]" />
								<Image
									src={Penguin}
									alt={"Profile Picture"}
									className="w-12 h-12 rounded-full"
								></Image>
							</div>
							{(
								<div className="relative">
									<DropMenu isOpen={isOpen} />
								</div>
							)}
						</section>
					</section>
				</section>
			)}
		</motion.nav>
	);
}
