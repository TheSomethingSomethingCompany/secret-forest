"use client"
import CreateProfileForm from "../components/createProfileForm/createProfileForm";
import React, { useEffect } from 'react';

export default function Home() {
   
    useEffect(() => {
      document.body.classList.add('h-full');
      
      // Clean up function
      return () => {
        document.body.classList.remove('your-class-name');
      };
    }, []);

  return (

    <main className = "w-full h-full flex justify-center items-center bg-blue-500">
      <CreateProfileForm />
    </main>
    
  );
}
