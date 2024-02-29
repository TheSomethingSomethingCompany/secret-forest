import { useState } from "react";
function OccupationTags({
	id,
	inputName,
	currentTags,
	setTags,
	inputFieldStyles,
	textSize,
	placeHolder,
}) {
	/* receive currentTags and setTags as props from CreateProfileForm */

	const [inputValue, setInputValue] = useState("");

	const addTag = (event) => {
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
		setTags((prevTags) => prevTags.filter((tag) => tag !== tagValue));
	};

	const onInputChange = function (event) {
		setInputValue(event.target.value);
	};

	return (
		<>
			<input
				id={id}
				type="text"
				className={`w-full border-[1px] border-black text-black ${inputFieldStyles}`}
				onKeyDown={addTag}
				value={inputValue}
				onInput={onInputChange}
				name={inputName}
				placeholder={placeHolder}
			></input>{" "}
			<div id="tags-container" className="flex flex-wrap mt-2">
				{currentTags.map((tag) => (
					<div
						key={tag}
						className={`p-2 m-2 bg-blue-500 rounded-lg flex justify-center items-center flex-nowrap bg-white border-[1px] border-black`}
					>
						<p
							id={tag.replace(/\s+/g, "")}
							className={`whitespace-pre-wrap break-words ${textSize}`}
						>
							{tag}
						</p>{" "}
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
		</>
	);
}

export default OccupationTags;
