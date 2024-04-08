"use client"
import LandingPage from "@/app/components/landing-page/LandingPage";
import {useRouter} from "next/navigation"
import { useWebSocket } from "../../contexts/WebSocketContext";
import { useEffect } from "react";

export default function Home() {
	const { userStatus, sendMessage} = useWebSocket();

	useEffect(() => {
		console.log("SENDING MESSAGE FROM HOME");
		sendMessage("sessionCheck");
	}, []);
	

	return (
		<main>
			<LandingPage />
		</main>
	);
}
