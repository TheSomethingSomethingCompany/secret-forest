import "../globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

interface LayoutProps {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
	return <>{ children }</>;
}
