"use client"

import React from "react"
import Link from "next/link"

export default function LandingPage(){

    return (
        <>
            <h1>Welcome to the team 10 project!</h1>
            <h1>Please sign up, or if you have an account, sign in</h1>

            <div className="flex flex-row"> 
                <button>
                <Link href="/signup" className="bg-gray-400 rounded m-3 p-4">SIGN UP</Link>
                </button>
                
                <button>
                <Link href="/signin" className="bg-gray-400 rounded m-3 p-4">SIGN IN</Link>
                </button>
            </div>
        </>
      );

   
}


