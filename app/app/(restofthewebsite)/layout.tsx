import Navbar from "@/app/components/Navbar/Navbar";

interface LayoutProps {
	children: React.ReactNode;
}

export default function ROWLayout({ children }: LayoutProps) {
	return (
		<main className="h-full flex flex-col">
			<Navbar />
			<div className="flex-1">{children}</div>
		</main>
	);
}
