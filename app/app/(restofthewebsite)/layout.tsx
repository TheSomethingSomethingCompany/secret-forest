import { WebSocketProvider } from "@/app/contexts/WebSocketContext";
import Navbar from "@/app/components/Navbar/Navbar";

interface LayoutProps {
	children: React.ReactNode;
}

export default function ROWLayout({ children }: LayoutProps) {
	return (
		<WebSocketProvider>
			<Navbar />
			{children}
		</WebSocketProvider>
	);
}
