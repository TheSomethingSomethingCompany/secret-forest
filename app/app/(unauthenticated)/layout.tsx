import Logo from "@/app/images/TheSomethingSomethingCompanyLogoV3.svg";
import Image from "next/image";

interface LayoutProps {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
	return <>
			<section className="bg-white z-50 w-screen p-10 flex flex-row justify-between items-center text-[1rem]">
				<a href="/">
					<Image src={Logo} alt={"TheSomethingSomethingCompany"} />
				</a>
			</section>
		{ children }
	</>;
}
