import Image from "next/image";
import UserAuthentication from "./components/user-auth/UserAuthentication";
import LandingPage from "./components/landing-page/LandingPage";
import Navbar from "./components/Navbar/Navbar3";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    {/* <main> */}
      {/* <Navbar/> */}
      <LandingPage />
    </main>
  );
}
