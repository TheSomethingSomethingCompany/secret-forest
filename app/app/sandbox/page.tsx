import React from "react";
import PenguinC from "@/app/images/PenguinC.jpeg";

function page() {
  return (
	<div className="flex flex-row w-screen chat-height justify-center items-start px-8 py-4">
		<section className="rounded-lg shadow w-[25rem] min-w-[25rem] max-w-[25rem] h-full mr-2">
			<p>Hello World</p>
		</section>
		<section className="flex-1 rounded-lg shadow h-full ml-2">
			<p>Hi World</p>
		</section>
	</div>
  );
}

export default page;
