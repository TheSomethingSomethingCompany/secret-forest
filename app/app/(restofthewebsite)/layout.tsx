import Navbar from "@/app/components/Navbar/Navbar";

interface LayoutProps {
	children: React.ReactNode;
}

export default function ROWLayout({ children }: LayoutProps) {
	return (
		<>
			<Navbar />
			{children}
		</>
	);
}
