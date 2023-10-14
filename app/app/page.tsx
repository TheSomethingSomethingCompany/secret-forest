import Image from "next/image";
import UserAuthentication from "./components/user-auth/UserAuthentication";

export default function Home() {
  return (
    <main className="">
      <UserAuthentication />
    </main>
  );
}
