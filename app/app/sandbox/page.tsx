import React from "react";
import PenguinC from "@/app/images/PenguinC.jpeg";

function page() {
  return (
	<div className="flex flex-row w-screen chat-height justify-center items-start px-8 py-4">
		<section className="rounded-lg shadow w-[25rem] min-w-[25rem] max-w-[25rem] h-full mr-2">
			<div className="flex flex-row justify-between items-center p-4 border-2 border-transparent rounded-lg h-full max-h-[8rem] m-4 shadow">
				<div className="flex flex-row justify-start items-center mr-1">
					<img
						src={PenguinC.src}
						alt="ProfilePicture"
						className="relative z-10 max-h-[6rem] max-w-[6rem] min-w-[6rem] min-h-[6rem] h-24 w-24 mr-2 rounded-full object-cover"
					/>
					<div className="ml-1 flex flex-col justify-between items-start">
						<div>
							<p className="text-xl font-bold">Thuppahiralalage Eranga De Saa</p>
							<p className="text-[1rem] font-light">@SatanshuMishradfwdnkafqwbfdlwquebflqwf</p>
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
		<section className="flex-1 rounded-lg shadow h-full ml-2">
			<p>Hi World</p>
		</section>
	</div>
  );
}

export default page;
