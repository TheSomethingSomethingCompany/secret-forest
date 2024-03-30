import React from "react";
import Image from "next/image";

type Props = {
	imageSource: any;
	alt: string;
	title: string;
	description: string;
	mode: string;
};

function ImageCard({ imageSource, alt, title, description, mode = "normal" }: Props) {
	return (
		<div className="flex flex-col justify-center items-center p-4 border-2 border-transparent rounded-lg h-full">
			{ mode === "normal" ?? 
				<Image src={imageSource} width={mode === "small" ? 200 : 400} height={mode === "small" ? 200 : 400} alt={alt} />
			}
			<div className="max-w-[25rem] flex flex-col justify-center items-center py-10">
				<h2 className="text-3xl font-medium text-center">{title}</h2>
				<p className="text-xl font-light text-center">{description}</p>
			</div>
		</div>
	);
}

export default ImageCard;
