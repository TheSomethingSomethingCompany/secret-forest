"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import PlaceHolderWebsite from "@/public/PlaceholderWebsite.svg";
import Greetings from "@/public/Greetings.svg";

export default function LandingPage() {
	const imageRef = useRef(null);
	const imageRefB = useRef(null);
	const imageRefC = useRef(null);
	const textContainerRefS = useRef(null);
	const textContainerRef = useRef(null);
	const textContainerRefB = useRef(null);
	const textContainerRefC = useRef(null);

	useEffect(() => {
		const tlInitial = gsap.timeline();
		tlInitial.to(
			textContainerRefS.current,
			{
				y: "10%",
				opacity: 1,
				duration: 1.5,
			},
			"-=0.7"
		);

		gsap.registerPlugin(ScrollTrigger);

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: imageRef.current, // Target the image section
				start: "top 500px", // Start animation when image is ~70% in view
				end: "bottom 500px", // End when the image leaves the viewport
				scrub: true, // Link animation progress to scroll
				markers: false,
				pin: false, // Pin the image
				pinSpacing: false, // Prevent extra space at the bottom
			},
		});

		const tl2 = gsap.timeline({
			scrollTrigger: {
				trigger: imageRefB.current, // Target second image
				start: "top 80%", // Adjust start percentage
				end: "bottom 500px",
				scrub: true,
				markers: false,
				pin: false, // Pin the image
				pinSpacing: false, // Prevent extra space at the bottom
			},
		});

		const tl3 = gsap.timeline({
			scrollTrigger: {
				trigger: imageRefC.current, // Assuming you add this class to your section
				start: "top bottom", // Start when the top of the section hits the bottom of the viewport
				end: "bottom top", // End when the bottom of the section hits the top of the viewport
				scrub: true,
				markers: false,
				pin: false, // Pin the image
				pinSpacing: false, // Prevent extra space at the bottom
			},
		});

		//  NOTE: ANIMATION FOR SECTION 1 IMAGE
		tl.to(
			imageRef.current,
			{
				scale: 1.05,
				y: "25%",
				duration: 20,
			},
			"+=1"
		)
			.to(
				imageRef.current,
				{
					scale: 1.1,
					y: "40%",
					x: "50%",
					duration: 20,
				},
				"+=5"
			)
			.to(
				textContainerRef.current,
				{
					opacity: 1,
					x: "0",
					y: "-200%",
					duration: 10,
				},
				"-=10"
			);

		//  NOTE: ANIMATION FOR SECTION 2 IMAGE

		tl2.to(
			imageRefB.current,
			{
				x: "-20%",
				duration: 20,
			},
			"+=1"
		).to(
			textContainerRefB.current,
			{
				opacity: 1,
				x: "0",
				y: "20%",
				duration: 10,
			},
			"-=4"
		);

		tl3.to(imageRefC.current, {
			y: "-100%",
			duration: 3.5,
		}).to(
			textContainerRefC.current,
			{
				y: "-50%",
				duration: 2,
			},
			"-=1"
		);
	}, []);

	return (
		<main className="flex flex-col justify-start items-center border-[1px] border-transparent w-full">
			{/*  NOTE: OPENING SECTION */}
			<section
				ref={textContainerRefS}
				className="relative w-full flex flex-col justify-center items-center py-20 px-40 opacity-0"
			>
				<div className="w-full mb-10">
					<h1 className="text-[80px] font-bold text-[#111B21] leading-tight">
						Secure Communication,
						<br />
						Without Compromise
					</h1>
					<p className="text-[40px] font-light text-black leading-snug max-w-[1000px]">
						Experience the freedom of truly secure communication.
						Your conversations are yours alone.
					</p>
				</div>
				<div
					ref={imageRef}
					className="w-full flex flex-row justify-center items-center border-[2px] border-transparent"
				>
					<img
						src={PlaceHolderWebsite.src}
						className="w-[80%] h-auto"
						alt="Placeholder Website"
					/>
				</div>
			</section>
			{/*  NOTE: MODERN DESIGN */}
			<section className="relative w-full flex flex-col justify-center items-start py-10 px-40 h-screen">
				<div ref={textContainerRef} className="w-[60%] opacity-0">
					<h2 className="bg-gradient-to-r from-cyan-500 to-blue-500 font-bold text-[22px] text-transparent inline-block bg-clip-text">
						Modern Design
					</h2>
					<h1 className="text-[40px] font-bold text-[#111B21]">
						Communication, Elevated
					</h1>
					<p className="text-3xl font-normal text-black leading-10 max-w-[800px]">
						Ditch the clunky interfaces and experience the future of
						secure communication. Powerful protection meets
						effortless design, making it easy to connect and
						collaborate without sacrificing privacy.
					</p>
				</div>
			</section>
			{/*  NOTE: SECURITY & PRIVACY */}
			<section className="relative w-full flex flex-row-reverse justify-start items-center py-10 px-40 h-screen -translate-y-[50%]">
				<div
					ref={textContainerRefB}
					className="flex flex-col justify-center items-start opacity-0"
				>
					<h2 className="bg-gradient-to-r from-blue-500 to-pink-500 font-bold text-[22px] text-transparent inline-block bg-clip-text">
						Security & Privacy
					</h2>
					<h1 className="text-[40px] font-bold text-[#111B21]">
						Speak freely
					</h1>
					<p className="text-3xl font-normal text-black leading-10 max-w-[800px]">
						Your secrets are safe with us. Top-notch encryption
						means your messages stay between you and your friends
						(and maybe some penguins 😉).
					</p>
				</div>
				<div
					ref={imageRefB}
					className="w-full flex flex-row justify-center items-center border-[1px] scale-y-150 -translate-x-[120%] border-transparent"
				>
					<img
						src={PlaceHolderWebsite.src}
						className="w-[80%] h-auto"
						alt="Placeholder Website"
					/>
				</div>
			</section>
			{/*  NOTE: STAYING CONNECTED */}
			<section className="relative flex flex-col justify-center items-center align-middle py-20 px-40 h-screen -translate-y-[50%]">
				<div ref={textContainerRefC} className="translate-y-10 z-50">
					<h1 className="text-[40px] font-bold text-[#111B21]">
						Stay Connected, Wherever You Go
					</h1>
					<p className="text-3xl font-normal text-black leading-10 max-w-[800px]">
						Anytime, Anywhere. Your Messages, Always Yours.
					</p>
				</div>
				<div>
					<img
						src={Greetings.src}
						className="absolute bottom-0 left-0 w-full h-auto transition-transform translate-y-8 z-0"
						alt="Placeholder Website"
						ref={imageRefC}
					/>
				</div>
			</section>
			{/*  NOTE: FOOTER */}
			<footer></footer>
		</main>
	);
}
