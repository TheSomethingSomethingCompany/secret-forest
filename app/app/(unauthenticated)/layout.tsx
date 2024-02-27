interface LayoutProps {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
	return <>{ children }</>;
}
