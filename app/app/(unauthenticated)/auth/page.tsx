"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { Checkbox } from "@/app/components/ui/checkbox";
import * as Yup from "yup";
import SignUp from "./api/signup";
import SignIn from "./api/signin";
import Input from "@/app/components/formComponents/Input";
import Member from "@/app/types/Member";
import { useSearchParams } from "next/navigation";
import Logo from "@/app/images/TheSomethingSomethingCompanyLogoV3.svg";
import { useWebSocket } from "../../contexts/WebSocketContext";
import { send } from "process";

export default function UserAuthentication() {

	const { isConnected, sendMessage } = useWebSocket();
	sendMessage("hideNavigation", {});


	const router = useRouter();
	const searchParams = useSearchParams();

	const [showSignIn, setShowSignIn] = useState(true);
	const [terms, setTerms] = useState(false);
	const [highlightTerms, setHighlightTerms] = useState(false);

	// It checks if the user is logged in on entering the page


	// USE EFFECT TO DETERMINE IF SIGN-IN OR SIGN-UP IS SHOWN

	useEffect(() => {
		if (searchParams.has("signin")) {
			searchParams.get("signin") === "true"
				? setShowSignIn(true)
				: setShowSignIn(false);
		} else {
			setShowSignIn(false);
		}
	}, []);

	// SECURITY QUESTIONS FOR IF USER FORGETS PASSWORD IN THE FUTURE

	const securityQuestions = [
		{value: "childhoodPet", label: "What was the name of your first pet?"},
		{value: "childhoodCareer", label: "When you were a kid, what did you want to be when you grew up?"},
		{value: "childhoodHero", label: "Who was your childhood hero?"},
	];

	// FORMIK LOGIC

	const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
	const usernameRegex = /^[a-zA-Z0-9]+$/;

	const formik = useFormik({
		initialValues: {
			username: "e.g., johndoe",
			email: "e.g., example@email.com",
			password: "",
			confirmpassword: "",
			securityQuestion: "",
			securityAnswer: "",
		},
		onSubmit: (values: {
			username: string;
			email: string;
			password: string;
			confirmpassword: string;
			securityQuestion: string;
			securityAnswer: string;
		}) => {
			submitSignUpData(values);
		},

		// SCHEMA VALIDATION
		validationSchema: Yup.object({
			username: Yup.string().required(
				"You cannot leave this field empty! Please enter a username"
			),
			email: Yup.string()
				.email("Please enter a valid email address")
				.required(
					"You cannot leave this field empty! Please enter your email address"
				),
			password: Yup.string()
				.matches(
					/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
					"Must contain at least one uppercase, one lowercase, one number and one special character and be 8 characters or more in total"
				)
				.required(
					"You cannot leave this field empty! Please enter your password."
				),
			confirmpassword: Yup.string().required("You cannot leave this field empty! Please confirm your password."),

			securityQuestion: Yup.string().required(
				"Please select a security question"
			  ),
			  securityAnswer: Yup.string().required(
				"Please provide an answer to your security question"
			  ),
		}),
	});

	const formikSignIn = useFormik({
		initialValues: {
			identifier: "",
			password: "",
		},
		onSubmit: (values: { identifier: string; password: string }) => {
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
			password: Yup.string().required(
				"You cannot leave this field empty! Please enter your password"
			),
		}),
	});

	const submitSignUpData = async (values: {
		username: string;
		email: string;
		password: string;
		confirmpassword: string;
		securityQuestion: string;
		securityAnswer: string;
	}) => {
		try {
			if (!terms) {
				setHighlightTerms(true);
				throw new Error("Please accept the terms and conditions");
			}
			if (values.password !== values.confirmpassword) {
				throw new Error("Passwords do not match! Please try again!");
			}
			const body: Member = {
				username: values.username,
				email: values.email,
				password: values.password,
				securityQuestion: values.securityQuestion,
				securityAnswer: values.securityAnswer,	
			};

			console.log("GOOD TO GO!");
      
			const response = await SignUp(body);
			console.log(response);
			switch(response.status){
				case 201:
					router.push("/createProfile");
					break;
				case 400:
					alert("Please fill in all required fields and try again.");
					break;
				case 422:
					alert(response.message);
					break;
				case 500:
					alert("An error occurred signing up. Please try again later.");
					break;
			}
			

		} catch (error) {
			console.log(error);
		}
	};

	const submitSignInData = async (values: {
		identifier: string;
		password: string;
	}) => {
		try {
			console.log("Signing In!");
			const body = {
				identifier: values.identifier,
				password: values.password,
				isEmail: emailRegex.test(values.identifier),
			};
			const response = await SignIn(body);
			console.log(response);
			switch(response.status){
				case 200:
					sendMessage("signedIn", {});
					router.push("/chats");
					break;
				case 205:
					sendMessage("signedIn", {});
					router.push("/createProfile");
					break;
				case 401:
					alert("Invalid username or password. Please try again.");
					break;
				case 500:
					alert("An error occurred signing in. Please try again later.");
					break;	
			}

		} catch (error) {
			console.log(error);
		}
	};


	return (
		<section style={{ "--translation": showSignIn ? "50%" : "0%", "--b-r": showSignIn ? "0" : "0.5rem", "--b-l": showSignIn ? "0.5rem" : "0" } as any} className="flex flex-col justify-center items-center mx-10">
			<section className="relative flex flex-row w-full justify-center items-center rounded-lg shadow-lg">	
				<section className="flex flex-col justify-center items-center p-0 m-0 w-full h-[40rem] overflow-hidden">
					<div className="flex flex-col justify-center items-start py-0 px-20 w-full h-full">
						<h1 className="font-bold text-6xl mb-4">Sign In</h1>
						<form
							className="flex flex-col items-start my-4 w-full"
							onSubmit={formikSignIn.handleSubmit}
						>
							<Input
								label="Username or Email"
								type="text"
								id="identifier"
								name="identifier"
								placeholder={formikSignIn.values.identifier}
								onChange={formikSignIn.handleChange}
								onBlur={formikSignIn.handleBlur}
							/>
							<Input
								label="Password"
								type="password"
								id="password"
								name="password"
								placeholder={formikSignIn.values.password}
								onChange={formikSignIn.handleChange}
								onBlur={formikSignIn.handleBlur}
							/>
							<div className="w-full flex justify-end items-center">
    							<a href="/forgotPassword" className="text-blue-500 underline text-sm mt-1">
        							Forgot password?
    							</a>
							</div>
							<div className="w-full flex flex-row justify-end items-center my-4">
								<button
									className="h-fit my-2 p-2 text-lg font-normal rounded-lg bg-black border-2 border-black hover:bg-white text-white hover:text-black transition-all duration-300 ease-in-out"
									type="submit"
								>
									Sign In
								</button>
							</div>
						</form>
					</div>
				</section>
			
				<section className="flex flex-row justify-center items-center p-0 m-0 h-fit w-full">
					<div className="flex flex-col justify-center items-start p-20 w-full h-full">
						<h1 className="font-bold text-6xl mb-4">Sign Up</h1>
						<form
							className="flex flex-col items-start my-4 w-full"
							onSubmit={formik.handleSubmit}
						>
							<Input
								label={
									formik.touched.username &&
									formik.errors.username
										? formik.errors.username
										: "Username"
								}
								type="text"
								id="username"
								name="username"
								placeholder={formik.values.username}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							<Input
								label={
									formik.touched.email && formik.errors.email
										? formik.errors.email
										: "Email"
								}
								type="email"
								id="email"
								name="email"
								placeholder={formik.values.email}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							<Input
								label={
									formik.touched.password &&
									formik.errors.password
										? formik.errors.password
										: "Password"
								}
								type="password"
								id="password"
								name="password"
								placeholder={formik.values.password}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							<Input
								label={
									formik.touched.confirmpassword &&
									formik.values.password
										? formik.values.password !==
											formik.values.confirmpassword
											? "Passwords do not match"
											: "Passwords Match"
										: "Confirm Password"
								}
								type="password"
								id="confirmpassword"
								name="confirmpassword"
								placeholder={formik.values.confirmpassword}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							<div>
								<label htmlFor="securityQuestion" className="block text-lg font-normal">
									Security Question
								</label>
								<select 
									name="securityQuestion" 
									id="securityQuestion"
									className="block p-2 rounded border border-gray-300"
									{...formik.getFieldProps("securityQuestion")}
									>
										<option value="">Select a question</option>
										{securityQuestions.map((question) => (
      									<option key={question.value} value={question.value}>
        								{question.label}
										</option>
										))}
								</select>
								{formik.touched.securityQuestion && formik.errors.securityQuestion ? (
									<div className="text-red-500">{formik.errors.securityQuestion}</div>
								) : null}
							</div>
							<Input
								label={
									formik.touched.securityAnswer && formik.errors.securityAnswer 
										? formik.errors.securityAnswer 
										: "Security Answer" 
								}
								type="text"
								id="securityAnswer"
								name="securityAnswer"
								placeholder={formik.values.securityAnswer}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
							
							<div className="my-4 items-top flex  space-x-2">
								<Checkbox
									id="terms"
									checked={terms}
									onCheckedChange={(e) => setTerms(!terms)}
								/>
								<div
									className="grid gap-1.5 leading-none"
									style={
										{
											"--highlightcolor": highlightTerms
												? "#FF0000"
												: "#000000",
										} as any
									}
								>
									<label
										htmlFor="terms"
										className="text-lg text-[--highlightcolor] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										Accept terms and conditions
										<sup className="text-red-600">*</sup>
									</label>
									<p className="text-lg text-muted-foreground">
										You agree to our{" "}
										<a className="cursor-not-allowed">
											Terms of Service
										</a>{" "}
										and{" "}
										<a className="cursor-not-allowed">
											Privacy Policy
										</a>
										.
									</p>
								</div>
							</div>
							<div className="w-full flex flex-row justify-end items-center">

									<button
										className="h-fit p-2 my-2 text-lg font-normal rounded-lg bg-black border-2 border-black hover:bg-white text-white hover:text-black transition-all duration-300 ease-in-out"
										type="submit"
									>
										Sign Up
									</button>
							</div>
						</form>
					</div>
				</section>
					<div className="flex flex-col items-center absolute p-20 text-white bg-[#1b2845] top-[0] rounded-r-[--b-l] rounded-l-[--b-r] left-[--translation] w-[50%] h-full overflow-hidden z-40 transition-all duration-1000 ease-in-out">
					{
						showSignIn ? (
							<>
						<div className="w-full my-10">
							<h1 className="text-6xl text-white font-black pb-4">
								Welcome Back!
							</h1>
							<p className="text-xl text-white font-normal pb-8">
								Sign in to start connecting with people around
								the world.
							</p>
						</div>
						<div className="flex justify-center items-center w-full">
							<hr className="flex-1 h-[1px] bg-black mx-[10px]"/>
							<span className="font-bold">OR</span> 
							<hr className="flex-1 h-[1px] bg-black mx-[10px]"/>
						</div>
						<div className="w-full my-10">
							<p className="text-xl text-white font-normal pb-8">	
								Don't have an account yet? Don't worry! You can sign up below:
							</p>
							<div className="w-full flex flex-row justify-center items-center">
								<button
										className="h-fit p-2 my-2 text-lg font-normal rounded-lg border-2 border-white hover:bg-white text-white hover:text-black transition-all duration-300 ease-in-out"
										onClick={() =>
											setShowSignIn(!showSignIn)
										}
									>
										Sign Up
									</button>
									</div>
						</div>
						</>

						) : (
						<>
						<div className="w-full my-10">
							<h1 className="text-6xl text-white font-black pb-4">
								Join our Community!	
							</h1>
							<p className="text-xl text-white font-normal pb-8">
								Connect with people around the world without
								worrying about your privacy.
							</p>
						</div>
						<div className="flex justify-center items-center w-full">
							<hr className="flex-1 h-[1px] bg-black mx-[10px]"/>
							<span className="font-bold">OR</span> 
							<hr className="flex-1 h-[1px] bg-black mx-[10px]"/>
						</div>
						<div className="w-full my-10">
							<p className="text-xl text-white font-normal pb-8">	
								Already have an account? Head over and sign in below!
							</p>
						
							<div className="w-full flex flex-row justify-center items-center">
								<button
										className="h-fit p-2 my-2 text-lg font-normal rounded-lg border-2 border-white hover:bg-white text-white hover:text-black transition-all duration-300 ease-in-out"
										onClick={() =>
											setShowSignIn(!showSignIn)
										}
									>
										Sign In
									</button>
									</div>
									</div>
						</>
						)
					}
					</div>
				</section>
		</section>
	);
}
