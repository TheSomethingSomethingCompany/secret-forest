import Logo from "@/app/images/TheSomethingSomethingCompanyLogoV3.svg";
import Image from "next/image";

interface LayoutProps {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
	return (
		<main className="flex flex-col h-full">
			<section className="bg-white z-50 w-screen p-10 flex flex-row justify-between items-center text-[1rem]">
				<a href="/">
					<Image src={Logo} alt={"TheSomethingSomethingCompany"} />
				</a>
			</section>
			<div className="flex-1">{children}</div>
		</main>
	);
}
