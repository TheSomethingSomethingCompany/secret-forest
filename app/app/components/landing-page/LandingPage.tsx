"use client";

import React from "react";
import Link from "next/link";
import Navbar from "../Navbar/Navbar";

export default function LandingPage() {
  return (
    <>
      {/* <Navbar/> */}
      <div className="w-screen h-[2550px] relative bg-white">
        <div className="w-full h-[630px] top-[184px] absolute">
          <div className="w-full h-[550px] top-[400px] md:top-[300px] tablet:top-[177px] relative bg-yellow-200" />
          <div className="w-1/4 tablet:w-3/4 h-[182px] ml-5 top-0 absolute text-left text-black text-4xl font-bold">
            The Safest Way to connect with the professionals online.
          </div>
          <div className="w-[100px] sm:w-auto h-9 right-0 mr-10 top-[91px] absolute text-center text-black text-2xl font-bold  hover:text-teal-300">
            <a href="/signin">Get Started Here</a>
          </div>
        </div>

        <div className="w-full h-[800px] top-[900px] absolute">
          <div className="w-full h-[800px] relative bg-sky-300" />
          <div className="w-1/8 h-[74px] ml-10 md:right-12 mr-20 top-[121px] absolute text-black text-4xl text-center font-normal font-['Inter']">
            Verified Professionals
          </div>
          <div className="w-3/4 md:w-1/2 tablet:w-[494px] ml-10 md:right-12 top-[210px] absolute text-left text-black text-2xl font-light font-['Inter']">
            Want expert consultation on your figertips? Be assured with our
            foolproof, ID verification check.
          </div>
          <div className="w-[300px] h-9 md:right-12 md:mr-7 ml-10 top-[450px] absolute text-left text-black text-2xl font-bold font-['Inter'] hover:text-purple-600">
            <a href="/signin">Find Experts Now</a>
          </div>
        </div>

        <div className="w-full h-[800px] top-[1700px] absolute">
          <div className="w-full h-[800px] left-0 top-0 absolute bg-black" />
          <div className="w-1/8 tablet:w-1/2 h-[74px] left-10 top-[106px] absolute text-white text-4xl font-normal font-['Inter']">
            Facial Blurring
          </div>
          <div className="w-1/2 md:w-3/4 tablet:w-1/2 md:w-1/4 left-10 top-[195px] absolute text-white text-2xl font-light font-['Inter']">
            Want to keep things private? Hide your face with our trademark,
            Anonymous Mode
          </div>
          <div className="hidden md:block w-[200px] h-[200px] tablet:w-[567px] tablet:h-[567px] ml-5 right-5 top-[250px] tablet:top-[121px] absolute bg-white" />
        </div>

        {/* <div className="w-[1512px] h-[800px] left-0 top-[2500px] absolute">
                <div className="w-[1512px] h-[800px] left-0 top-0 absolute bg-fuchsia-600" />
                <div className="w-[665px] h-[74px] left-[784px] top-[121px] absolute text-white text-6xl font-normal font-['Inter']">Data Encryption</div>
                <div className="w-[494px] left-[817px] top-[210px] absolute text-white text-[40px] font-light font-['Inter']">Want to keep your chats secure? We got you with our unique data encryption system. </div>
                <div className="w-[205px] h-9 left-[894px] top-[514px] absolute text-center text-black text-2xl font-normal font-['Inter']">Start Now</div>
                <div className="w-[567px] h-[558px] left-[126px] top-[123px] absolute bg-green-400" />
            </div> */}
      </div>
    </>
  );
}
