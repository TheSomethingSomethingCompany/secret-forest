"use client"
import CreateProfileForm from "@/app/components/createProfileForm/createProfileForm";
import Image from "next/image";
import React, { useEffect } from 'react';
import Penguin from "../../../public/profile-pictures/1.svg";
import getRandomProfilePicture from "@/app/scripts/getRandomProfilePicture";
import Input from "../../components/formComponents/Input";
import 'remixicon/fonts/remixicon.css';

export default function CreateProfile() {
	//<Image src={getRandomProfilePicture()} alt="Picture" width={250} height={250} />
      useEffect(() => {
      document.body.classList.add('h-full');
      
      // Clean up function
      return () => {
        document.body.classList.remove('your-class-name');
      };
    }, []);


return (
    <main className="bg-[#fbfcff] p-10"> 
			<CreateProfileForm />
	</main>
  );
}
