"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "@/app/components/formComponents/Input";
import { useWebSocket } from "../../contexts/WebSocketContext";
import getQuestion from "../forgotPassword/api/getQuestion";
import updatePassword from "../forgotPassword/api/updatePassword";
import checkAnswer from "../forgotPassword/api/checkAnswer";



export default function ForgotPassword() {
	const { isConnected, sendMessage } = useWebSocket();
	sendMessage("hideNavigation", {});

    const router = useRouter();

	const [question, SetQuestion] = useState("");
	const [userInfo, SetUserInfo] = useState("");

	const [showSigninForm, setShowSignIn] = useState(true);
	const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

	const [showErrorMessage, setShowErrorMessage] = useState(false)

    

	const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
	const usernameRegex = /^[a-zA-Z0-9]+$/;

	// FORMIK: SIGN IN FORM

	const formikSignIn = useFormik({
		initialValues: {
			identifier: "",
		},
		onSubmit: (values: { identifier: string;}) => {
			
			submitSignInData(values);
		},

		// SCHEMA VALIDATION
		validationSchema: Yup.object({
			identifier: Yup.string()
				.required(
					"This field cannot be empty! Please enter your valid username or email address."
				)
				.test(
					"is-username-or-email",
					"Please enter your username or email address",
					(value) => {
						if (!value) return false;
						return (
							emailRegex.test(value) || usernameRegex.test(value)
						);
					}
				),

		}),
	});

	// Sign in form submit handler

    const submitSignInData = async (values: {
		identifier: string;
	}) => {
		try {
			const body = {
				identifier: values.identifier,
				isEmail: emailRegex.test(values.identifier),
			};
			const response = await getQuestion(body);
			console.log("Retrieved Security Question Successfully!");
			console.log(response);

			//Set the question accordingly with response data
			if (response.data.question == "childhoodPet") {
				SetQuestion("What was the name of your first pet?");
			} 
			else if (response.data.question == "childhoodCareer") {
				SetQuestion("When you were a kid, what did you want to be when you grew up?");
			} 
			else if (response.data.question == "childhoodHero") {
				SetQuestion("Who was your childhood hero?");
			}
			SetUserInfo(response.data.username);

			//Transition to the next stage if successful
			if (response.status === 201) {
				setShowSignIn(false);
				formikSignIn.resetForm();
				formikChangePassword.resetForm(); 
				formikCheckSecurityAnswer.resetForm();
			}

		} catch (error) {
			console.log(error);
		}
	};

	// FORMIK: SECURITY QUESTION FORM

	const formikCheckSecurityAnswer = useFormik({
		initialValues: {
			securityAnswer: "",
		},
		onSubmit: (values: { securityAnswer: string;}) => {
			checkSecurityAnswer(values);

		},

		// SCHEMA VALIDATION
		validationSchema: Yup.object({
			securityAnswer: Yup.string()
				.required(
					"This field cannot be empty! Please enter your answer."
				)
		}),
	});

	// Check answer form submit handler

	const checkSecurityAnswer = async (values: {
		securityAnswer: string;
	
	}) => {
		try {

			const body = {
				username: userInfo,
				securityAnswer: values.securityAnswer	
			};
			console.log(body);
			const response = await checkAnswer(body);
			console.log(response)

			if(response.status === 201) {
				setShowChangePasswordForm(true);
				setShowErrorMessage(false);
			} 
			else if (response.status === 401) {
				setShowErrorMessage(true);
			} 


		} catch (error) {
			console.log(error);
		}
	};

	// FORMIK: CHANGE PASSWORD FORM

	const formikChangePassword = useFormik({
		initialValues: {
			password: "",
			confirmpassword: "",
		},
		onSubmit: (values: {
			password: string;
			confirmpassword: string;
		}) => {
			submitNewPassword(values);
		},
		// SCHEMA VALIDATION
		validationSchema: Yup.object({
			password: Yup.string()
				.matches(
					/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
					"Must contain at least one uppercase, one lowercase, one number and one special character and be 8 characters or more in total"
				)
				.required(
					"You cannot leave this field empty! Please enter your password."
				),
			confirmpassword: Yup.string().required("You cannot leave this field empty! Please confirm your password."),
		}),

	});

	// Change password form submit handler

	const submitNewPassword = async (values: {
		password: string;
		confirmpassword: string;
	}) => {
		try {

			if (values.password !== values.confirmpassword) {
				throw new Error("Passwords do not match! Please try again!");
			}
			const body = {
				username: userInfo,
				password: values.password,	
			};
			console.log(body);
			const response = await updatePassword(body);
			console.log(response)
			if(response.status === 201) {
				router.push("/auth?signin=true");
				setShowChangePasswordForm(false);
			}


		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => { // Trying to reset the change password form values so that the form is empty when user first sees it
		if (showChangePasswordForm) {
		  formikChangePassword.resetForm();
		}
	  }, [showChangePasswordForm]);


    return (
		<section className="container mx-auto">
			<div className="w-4/5 mx-auto p-4 rounded-lg shadow-lg">
			{showChangePasswordForm ? (
				<div className="flex flex-col justify-center items-start py-0 px-20 w-full h-full">
					<form
						className="flex flex-col items-start my-4 w-full"
						onSubmit={formikChangePassword.handleSubmit}
						>
							<Input
								label={
									formikChangePassword.touched.password &&
									formikChangePassword.errors.password
										? formikChangePassword.errors.password
										: "Password"
								}
								type="password"
								id="password"
								name="password"
								placeholder={formikChangePassword.values.password}
								onChange={formikChangePassword.handleChange}
								onBlur={formikChangePassword.handleBlur}
							/>
							<Input
								label={
									formikChangePassword.touched.confirmpassword &&
									formikChangePassword.values.password
										? formikChangePassword.values.password !==
											formikChangePassword.values.confirmpassword
											? "Passwords do not match"
											: "Passwords Match"
										: "Confirm Password"
								}
								type="password"
								id="confirmpassword"
								name="confirmpassword"
								placeholder={formikChangePassword.values.confirmpassword}
								onChange={formikChangePassword.handleChange}
								onBlur={formikChangePassword.handleBlur}
							/>
							<div className="w-full flex flex-row justify-end items-center my-4">
								<button
									className="h-fit my-2 p-2 text-lg font-normal rounded-lg bg-black border-2 border-black hover:bg-white text-white hover:text-black transition-all duration-300 ease-in-out"
									type="submit"
								>
									Change Password
								</button>
							</div>


						</form>
				</div>
			) : (
				
				<div className="flex flex-col justify-center items-start py-0 px-20 w-full h-full">
				{showSigninForm ? (
					<form
						className="flex flex-col items-start my-4 w-full"
						onSubmit={formikSignIn.handleSubmit}
						>
						<Input
							label="Enter Username or Email"
							type="text"
							id="identifier"
							name="identifier"
							placeholder={formikSignIn.values.identifier}
							onChange={formikSignIn.handleChange}
							onBlur={formikSignIn.handleBlur}
						/>
						<div className="w-full flex flex-row justify-end items-center my-4">
							<button
								className="h-fit my-2 p-2 text-lg font-normal rounded-lg bg-black border-2 border-black hover:bg-white text-white hover:text-black transition-all duration-300 ease-in-out"
								type="submit"
							>
								Submit
							</button>
						</div>
					</form>
				) : (
					<form
						className="flex flex-col items-start my-4 w-full"
						onSubmit={formikCheckSecurityAnswer.handleSubmit}
					>
						<p className="mb-2"> {question} </p>
						<Input
							label={
								formikCheckSecurityAnswer.touched.securityAnswer && formikCheckSecurityAnswer.errors.securityAnswer 
									? formikCheckSecurityAnswer.errors.securityAnswer 
									: "Enter Answer" 
							}
							type="text"
							id="securityAnswer"
							name="securityAnswer"
							placeholder={formikCheckSecurityAnswer.values.securityAnswer}
							onChange={formikCheckSecurityAnswer.handleChange}
							onBlur={formikCheckSecurityAnswer.handleBlur}
						/>
						{showErrorMessage && (
    						<div className="text-red-500 mt-2">Incorrect Answer</div>
  						)}
						<div className="w-full flex flex-row justify-end items-center my-4">
							<button
								className="h-fit my-2 p-2 text-lg font-normal rounded-lg bg-black border-2 border-black hover:bg-white text-white hover:text-black transition-all duration-300 ease-in-out"
								type="submit"
							>
								Submit Answer
							</button>
						</div>

					</form>

				)}
			
			</div>

			)}
			</div>
		</section>
		
		
    );
}