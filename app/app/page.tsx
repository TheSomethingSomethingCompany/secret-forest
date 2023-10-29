import Image from "next/image";
import UserAuthentication from "./components/user-auth/UserAuthentication";
import LandingPage from "./components/landing-page/LandingPage";

export default function Home() {
  return (
    <main className="">
    {/* <main> */}
      {/* <Navbar/> */}
      <LandingPage />
    </main>
  );
}
