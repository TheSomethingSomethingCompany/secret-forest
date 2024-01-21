import React from "react";
import PenguinC from "@/app/images/PenguinC.jpeg";

function page() {
  return (
	<section className="grid grid-cols-12 gap-4 m-4 h-full grid-rows-[1fr] min-h-full">
		<div className="w-full h-full col-span-5 shadow min-h-full p-4 rounded-lg">
			<div className="flex flex-row justify-between items-center p-4 border-2 border-transparent rounded-lg shadow h-full">
				<div className="flex flex-row justify-start">
					<img
						src={PenguinC.src}
						alt="ProfilePicture"
						className="relative z-10 h-24 w-24 mr-2 rounded-full object-cover"
					/>
					<div>
						<p className="text-lg">Satanshu Mishra</p>
						<p className="text-sm">@SatanshuMishra</p>
					</div>
				</div>
				<div className="flex flex-col justify-between items-start h-full">
					<i className="ri-pushpin-fill"></i>
					<i className="ri-chat-3-fill">4</i>
				</div>
			</div>
		</div>
		<div className="w-full h-full col-span-7 shadow min-h-full rounded-lg">
			<p>HelloWorl</p>
		</div>
	</section>
  );
}

export default page;
