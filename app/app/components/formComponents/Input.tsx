import React from "react";

type props = {
	label: string;
	type: string;
	id: string;
	name: string;
	placeholder: string;
	onChange: any;
	onBlur: any;
	dsh?: any;
};

function Input({
	label,
	dsh,
	type,
	id,
	name,
	placeholder,
	onChange,
	onBlur,
}: props) {
	return (
		<div
			className="bg-[#f4f4f5] hover:bg-[#e4e4e7] py-2 px-3 flex flex-col w-full rounded-xl hover:cursor-text my-2 text-md"
			onClick={() => {
				const input = document.querySelector(`#in`) as HTMLInputElement;
				if (input) {
					input.focus();
				}
			}}
		>
			{dsh ? (
				<label
					htmlFor={id}
					className="font-light text-gray-600 hover:cursor-text"
					dangerouslySetInnerHTML={dsh}
				>
				</label>
			) : (
				<label
					htmlFor={id}
					className="font-light text-gray-600 hover:cursor-text"
				>
					{label}
				</label>
			)}
			<input
				className="bg-transparent outline-none hover:cursor-text"
				type={type}
				name={name}
				id={id}
				placeholder={placeholder}
				onChange={onChange}
				onBlur={onBlur}
			/>
		</div>
	);
}

export default Input;
