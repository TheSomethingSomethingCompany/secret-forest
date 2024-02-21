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

export default function UserAuthentication() {
	const { isConnected, sendMessage } = useWebSocket();
	sendMessage("hideNavigation", {});

	const router = useRouter();
	const searchParams = useSearchParams();

	const [showSignIn, setShowSignIn] = useState(true);
	const [terms, setTerms] = useState(false);
	const [highlightTerms, setHighlightTerms] = useState(false);

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

	// FORMIK LOGIC

	const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
	const usernameRegex = /^[a-zA-Z0-9]+$/;

	const formik = useFormik({
		initialValues: {
			username: "e.g., johndoe",
			email: "e.g., example@email.com",
			password: "",
			confirmpassword: "",
		},
		onSubmit: (values: {
			username: string;
			email: string;
			password: string;
			confirmpassword: string;
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
			confirmpassword: Yup.string().required("You cannot leave this field empty! Please confirm your password.")
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
			};
			const response = await SignUp(body);
			console.log(response);
		} catch (error) {
			console.log(error);
		}
	};

	const submitSignInData = async (values: {
		identifier: string;
		password: string;
	}) => {
		try {
			const body = {
				identifier: values.identifier,
				password: values.password,
				isEmail: emailRegex.test(values.identifier),
			};
			const response = await SignIn(body);
			console.log("Logged In Successfully!");
			console.log(response);
			if (response.status == 205) {
				sendMessage("signedIn", {});
			} else {
				sendMessage("signedIn", {});
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<section className="z-50 w-screen p-10 flex flex-row justify-between items-center text-[1rem]">
				<div onClick={() => router.push("./")}>
					<Image src={Logo} alt={"TheSomethingSomethingCompany"} />
				</div>
			</section>
			{showSignIn === true && (
				<section className="grid grid-cols-1 tablet:grid-cols-2 p-0 m-0 w-full h-[40rem]">
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
							<div className="w-full flex flex-row-reverse justify-between items-end my-4">
								<button
									className="h-fit my-2 p-2 text-lg font-normal rounded-lg bg-black border-2 border-black hover:bg-white text-white hover:text-black transition-all duration-300 ease-in-out"
									type="submit"
								>
									Sign In
								</button>
								<div className="flex flex-col items-start">
									<p className="text-lg font-normal pb-2">
										Not a member?
									</p>
									<button
										className="h-fit p-2 my-2 text-lg font-normal rounded-lg bg-black border-2 border-black hover:bg-white text-white hover:text-black transition-all duration-300 ease-in-out"
										onClick={() =>
											setShowSignIn(!showSignIn)
										}
									>
										Sign Up
									</button>
								</div>
							</div>
						</form>
					</div>
					<div className="hidden tablet:flex flex-col justify-center items-center p-20 w-full h-full bg-blue-600">
						<div className="w-full">
							<h1 className="text-6xl text-white font-black pb-4">
								Welcome Back!
							</h1>
							<p className="text-3xl text-white font-normal pb-8">
								Sign in to start connecting with people around
								the world.
							</p>
						</div>
						<Image
							className="my-10"
							src="/signinundraw.svg"
							width={500}
							height={500}
							alt="signup"
						/>
					</div>
				</section>
			)}
			{showSignIn === false && (
				<section className="grid grid-cols-1 tablet:grid-cols-2 p-0 m-0 h-fit w-full">
					<div className="hidden tablet:flex flex-col justify-center items-center p-20 w-fit h-full bg-green-600">
						<div className="w-full">
							<h1 className="text-6xl text-white font-black pb-4">
								Join our Community!
							</h1>
							<p className="text-3xl text-white font-normal pb-8">
								Connect with people around the world without
								worrying about your privacy.
							</p>
						</div>
						<Image
							className="my-10"
							src="/signupundraw.svg"
							width={600}
							height={600}
							alt="signup"
						/>
					</div>
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
							<div className="w-full flex flex-row-reverse justify-between items-end">
								<button
									className="h-fit my-2 p-2 text-lg font-normal rounded-lg bg-black border-2 border-black hover:bg-white text-white hover:text-black transition-all duration-300 ease-in-out"
									type="submit"
									onClick={() => {
										console.log("Submitted Clocked!");
									}}
								>
									Sign Up
								</button>
								<div className="flex flex-col items-start">
									<p className="text-lg font-normal pb-2">
										Have an account? Sign-In below!
									</p>
									<button
										className="h-fit p-2 my-2 text-lg font-normal rounded-lg bg-black border-2 border-black hover:bg-white text-white hover:text-black transition-all duration-300 ease-in-out"
										type="button"
										onClick={() =>
											setShowSignIn(!showSignIn)
										}
									>
										Sign In
									</button>
								</div>
							</div>
						</form>
					</div>
				</section>
			)}
		</>
	);
}
