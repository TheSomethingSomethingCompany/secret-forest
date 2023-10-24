import Image from "next/image";
import UserAuthentication from "./components/user-auth/UserAuthentication";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UserAuthentication />
    </main>
  );
}
