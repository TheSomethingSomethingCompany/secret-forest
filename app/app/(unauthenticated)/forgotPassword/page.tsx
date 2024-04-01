"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "@/app/components/formComponents/Input";
import Member from "@/app/types/Member";
import { useWebSocket } from "../../contexts/WebSocketContext";
import getQuestion from "../forgotPassword/api/getQuestion";



export default function ForgotPassword() {
	const { isConnected, sendMessage } = useWebSocket();
	sendMessage("hideNavigation", {});

    const router = useRouter();

    const securityQuestions = [
		{value: "childhoodPet", label: "What was the name of your first pet?"},
		{value: "childhoodCareer", label: "When you were a kid, what did you want to be when you grew up?"},
		{value: "childhoodHero", label: "Who was your childhood hero?"},
	];

    // FORMIK LOGIC

	const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
	const usernameRegex = /^[a-zA-Z0-9]+$/;

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
		} catch (error) {
			console.log(error);
		}
	};

    return (

    );
}