import Navbar from "@/app/components/Navbar/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function ROWLayout({ children }: LayoutProps) {
  return (
    <main className="h-full flex flex-col max-h-screen">
      <Navbar />
      <div className="h-full max-h-full overflow-y-auto">{children}</div>
    </main>
  );
}
