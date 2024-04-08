import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

const metropolis = localFont({
	src: [
		{
			path: "./fonts/metropolis/Metropolis-Black.woff2",
			weight: "900",
			style: "normal",
		},
		{
			path: "./fonts/metropolis/Metropolis-BlackItalic.woff2",
			weight: "900",
			style: "italic",
		},
		{
			path: "./fonts/metropolis/Metropolis-ExtraBold.woff2",
			weight: "800",
			style: "normal",
		},
		{
			path: "./fonts/metropolis/Metropolis-ExtraBoldItalic.woff2",
			weight: "800",
			style: "italic",
		},
		{
			path: "./fonts/metropolis/Metropolis-Bold.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "./fonts/metropolis/Metropolis-BoldItalic.woff2",
			weight: "700",
			style: "italic",
		},
		{
			path: "./fonts/metropolis/Metropolis-SemiBold.woff2",
			weight: "600",
			style: "normal",
		},
		{
			path: "./fonts/metropolis/Metropolis-SemiBoldItalic.woff2",
			weight: "600",
			style: "italic",
		},
		{
			path: "./fonts/metropolis/Metropolis-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "./fonts/metropolis/Metropolis-MediumItalic.woff2",
			weight: "500",
			style: "italic",
		},
		{
			path: "./fonts/metropolis/Metropolis-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "./fonts/metropolis/Metropolis-RegularItalic.woff2",
			weight: "400",
			style: "italic",
		},
		{
			path: "./fonts/metropolis/Metropolis-Light.woff2",
			weight: "300",
			style: "normal",
		},
		{
			path: "./fonts/metropolis/Metropolis-LightItalic.woff2",
			weight: "300",
			style: "italic",
		},
		{
			path: "./fonts/metropolis/Metropolis-ExtraLight.woff2",
			weight: "200",
			style: "normal",
		},
		{
			path: "./fonts/metropolis/Metropolis-ExtraLightItalic.woff2",
			weight: "200",
			style: "italic",
		},
		{
			path: "./fonts/metropolis/Metropolis-Thin.woff2",
			weight: "100",
			style: "normal",
		},
		{
			path: "./fonts/metropolis/Metropolis-ThinItalic.woff2",
			weight: "100",
			style: "italic",
		},
	],
});

export const metadata: Metadata = {
	title: "SomethingSomethingCompany",
	description: "A system for your secure communication needs.",
};

interface LayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
	return (
		<html lang="en">
			<body
				className={`${metropolis.className} relative h-screen max-h-screen overflow-hidden`}
			>
				<WebSocketProvider>
					{children}
					<Toaster />
				</WebSocketProvider>
			</body>
		</html>
	);
}
