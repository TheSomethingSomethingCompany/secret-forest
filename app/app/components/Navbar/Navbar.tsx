"use client"

import React from "react"
import Link from "next/link"

export default function Navbar(){

    return (
        <>
         <nav className="bg-slate-300">
            <div className="mx-auto px-4">
                <div className="flex items-center justify-between h-15">
                <div>
                    <Link href="/" className="hover:bg-orange-400 py-6 rounded px-5">Home Page</Link>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                    <Link href="/" className="hover:bg-orange-400 py-6 rounded px-5">Requests</Link>
                    <Link href="/" className="hover:bg-orange-400 py-6 rounded px-5">Chats</Link>
                    <Link href="/" className="hover:bg-orange-400 py-6 rounded px-5">Profile</Link>
                </div>
                </div>
            </div>
         </nav>

    </>
      );

   
}


