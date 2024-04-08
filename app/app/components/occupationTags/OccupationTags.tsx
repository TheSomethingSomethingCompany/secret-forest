import { Dispatch, SetStateAction, useState } from "react";

type Props = {
	id: string;
	inputName: string;
	currentTags: string[];
	setTags: Dispatch<SetStateAction<never[]>>;
}

function OccupationTags({
	id,
	inputName,
	currentTags,
	setTags,
}: Props) {
	/* receive currentTags and setTags as props from CreateProfileForm */

	const [inputValue, setInputValue] = useState("");

	const addTag = (event: any) => {
		if (event.key === "Enter") {
			event.preventDefault();
			const value = inputValue.trim();
			if (!currentTags.includes(value) && value !== "") {
				setTags((prevTags) => {
					const updatedTags = [...prevTags, value];
					return updatedTags;
				});
				console.log(currentTags);
				setInputValue("");
			}
		}
	};

	const removeTag = function (event) {
		let tagValue = event.target.getAttribute("tag-association");
		setTags((prevTags) => prevTags.filter((tag: string) => tag !== tagValue));
	};

	const onInputChange = function (event) {
		setInputValue(event.target.value);
	};

	return (
		<section className="flex flex-col w-full">
			<p className="pb-2">Please remember to hit <span className="bg-black text-white p-1.5 text-sm rounded-md">ENTER</span> each tag to add it.</p>

			<input
				id={id}
				type="text"
				className={`w-full outline-none border-[1px] border-gray-800 rounded-lg font-normal text-lg p-1.5 block focus:outline-none focus:border-[#0085ff] focus:ring-1 focus:ring-[#0085ff]`}
				onKeyDown={addTag}
				value={inputValue}
				onInput={onInputChange}
				name={inputName}
				placeholder={`Add new tags...`}
			></input>

			<div
				id="tags-container"
				className="tag flex flex-row justify-start item-center flex-wrap w-full my-1"
			>
				{currentTags.map((tag) => (
					<div
						key={tag}
						className="mr-2 my-1 p-2 rounded-lg flex justify-center items-center flex-nowrap bg-blue-500 text-white w-fit"
					>
						<p
							id={tag.replace(/\s+/g, "")}
							className={`whitespace-pre-wrap break-words pr-2 text-lg`}
						>
							{tag}
						</p>
						<button
							tag-association={tag}
							onClick={removeTag}
							className="ml-1 text-red-500"
						>
							x
						</button>
					</div>
				))}
			</div>
		</section>
	);
}

export default OccupationTags;
