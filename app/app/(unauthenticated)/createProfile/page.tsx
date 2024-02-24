"use client"
import CreateProfileForm from "@/app/components/createProfileForm/createProfileForm";
import Image from "next/image";
import React, { useEffect } from 'react';
import Penguin from "../../../public/profile-pictures/1.svg";
import getRandomProfilePicture from "@/app/scripts/getRandomProfilePicture";
import Input from "../../components/formComponents/Input";
import 'remixicon/fonts/remixicon.css';

export default function CreateProfile() {
	//<Image src={getRandomProfilePicture()} alt="Picture" width={250} height={250} />
      useEffect(() => {
      document.body.classList.add('h-full');
      
      // Clean up function
      return () => {
        document.body.classList.remove('your-class-name');
      };
    }, []);


return (
    <main className="bg-[#fbfcff] p-10"> 
		<section className="w-full flex flex-col items-start">
			<h1 className="font-bold text-6xl pb-4 text-[#343a40]">
				Tell Others About Yourself	
			</h1>
			<p className="text-xl font-light pb-8 text-[#343a40]">
				Complete your profile to let others know who you are.	
			</p>
		</section>	
			<form className="mx-6">
				<section className="rounded-lg shadow-lg p-6">
					<div className="flex flex-col items-start w-full">
					<h4 className="font-bold font-xl py-4 text-[#343a40]">PERSONAL DETAILS</h4>
					<Input
								label={"Full Name"}
								type="text"
								id="fullname"
								name="fullname"
								placeholder={"e.g., John Doe"}
								onChange={null}
								onBlur={null}
							/>
					<div className="flex flex-row justify-evenly w-full">
						<div className="pr-2 w-full">
							<Input
								label={"Country"}
								type="text"
								id="Country"
								name="Country"
								placeholder={"e.g., Canada"}
								onChange={null}
								onBlur={null}
							/>
						</div>
						<div className="pl-2 w-full">
							<Input
								label={"Address"}
								type="text"
								id="address"
								name="address"
								placeholder={"e.g., 111 Something St."}
								onChange={null}
								onBlur={null}
							/>
						</div>
					</div>
					<h4 className="font-bold font-xl py-4 text-[#343a40]">PROFILE PICTURE</h4>
					<div className="flex flex-row w-full items-center">
						<div className="pr-2">
							<Image src={getRandomProfilePicture()} alt="Picture" width={100} height={100} />
						</div>
						<div className="ml-4 flex flex-row flex-1 items-center">
							<div className="pr-1">
								<input type="file" id="actual-btn" hidden/>
								<label htmlFor="actual-btn" className="inline-block bg-green-200 text-green-800 border-green-200 border-[1px] p-2 cursor-pointer rounded-sm hover:bg-green-300 transition-all ease-in-out duration-300">Upload New Picture</label>
							</div>
							<div className="pl-1 pr-1">
								<button type="button" className="h-full bg-red-200 text-red-800 border-red-200 border-[1px] p-2 cursor-pointer rounded-sm hover:bg-red-300 transition-all ease-in-out duration-300">Remove</button>
							</div>
							<div className="pl-1">
								<button type="button" className="h-full bg-blue-200 text-blue-800 border-blue-200 border-[1px] p-2 cursor-pointer rounded-sm hover:bg-blue-300 transition-all ease-in-out duration-300"><i className="ri-restart-line"></i></button>
							</div>
						</div>
					</div>
					</div>
				</section>
					<div className="flex flex-row-reverse w-full py-4">
						<button type="submit" className="h-full bg-white text-black border-black border-[1px] p-2 cursor-pointer rounded-sm hover:bg-[#343a40] transition-all ease-in-out duration-300 hover:text-white hover:border-[#343a40]">Create Profile</button>
					</div>
			</form>
	</main>
  );
}
