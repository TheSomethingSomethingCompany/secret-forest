"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import fetchUserInfo from "./api/getUserInfo";
import logout from "./api/logout";

type DropMenuProps = {
	isOpen: boolean;
};

/* font-normal my-4 mx-[8px] border-b-4 border-transparent translate-y-1 transition-all duration-200 ease-in-out hover:cursor-pointer flex flex-row items-center justify-center */

function DropMenu({ isOpen }: DropMenuProps) {

	const router = useRouter();
	const [username, setUsername] = useState([]);
	const [name, setName] = useState([]);

	async function getUser() {
		const res = await fetchUserInfo();
		console.log("RESPONSE FROM SERVER FOR User:");
		console.log(res);
		setUsername(res.data.username);
		setName(res.data.name);

	  }

	  useEffect(() => {
		getUser();
	  }, []);
	  
	  async function handleLogout() {
		const res = await logout();
		console.log(res);
		window.location.reload();
		
	  };



	return (
		<>
			{isOpen && (
				<div className=" text-[16px] leading-[1.8rem] p-2 absolute top-0 bg-white shadow-xl right-0 flex flex-col justify-center items-center w-60 rounded-xl transition-all duration-200 ease-in-out font-normal">
					<div className="p-2 pb-3 rounded-sm flex flex-col justify-center items-start w-full border-b-[1px] border-[#57606a] rounded-b-none">
						<h4 className="font-bold w-fit">{name}</h4>
						<p className="text-[14px] leading-normal">
							@{username}
						</p>
					</div>
					<div 
					onClick={() => router.push(`/profile/${username}`)}
					className="flex flex-row justify-between items-start hover:bg-gray-50 p-2 rounded-sm select-none hover:cursor-pointer">
						<i className="ri-account-box-line text-2xl m-0 p-0"></i>
						<div className="flex-1 mx-1">
							<h4 className="font-bold w-fit">Who are You?</h4>
							<p className="text-[12px] leading-normal">
								Visit your profile to let others know who you
								are.
							</p>
						</div>
					</div>
					<div
						onClick={() => router.push("/requests")}
						className="flex flex-row justify-between items-start hover:bg-gray-50 p-2 rounded-sm select-none hover:cursor-pointer"
					>
						<i className="ri-rfid-line text-2xl m-0 p-0"></i>
						<div className="flex-1 mx-1">
							<h4 className="font-bold w-fit">Requests</h4>
							<p className="text-[12px] leading-normal">
								Visit your profile to let others know who you
								are.
							</p>
						</div>
					</div>
					<div className="flex flex-row justify-between items-start hover:bg-gray-50 p-2 rounded-sm select-none hover:cursor-pointer">
						<i className="ri-settings-line text-2xl m-0 p-0"></i>
						<div className="flex-1 mx-1">
							<h4 className="font-bold w-fit">Customization</h4>
							<p className="text-[12px] leading-normal">
								Customize your account and app to work the way
								you want.
							</p>
						</div>
					</div>
					<div 
						onClick = {async () => {
							await handleLogout(); 
							router.push("/");
						  }}
						className="flex flex-row justify-between items-start hover:bg-gray-50 p-2 rounded-sm select-none hover:cursor-pointer"
						>
							<i className="ri-logout-circle-r-line text-2xl m-0 p-0"></i> 
            				<div className="flex-1 mx-1">
              					<h4 className="font-bold w-fit">Logout</h4> 
            				</div>
					</div>

				</div>
			)}
		</>
	);

}

export default DropMenu;
