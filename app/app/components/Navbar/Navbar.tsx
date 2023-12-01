"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "remixicon/fonts/remixicon.css";
import Image from "next/image";

import DropMenu from "./DropMenu";

import Logo from "../../images/TheSomethingSomethingCompanyLogoV2.svg";
import Penguin from "../../images/ExamplePenguin.jpeg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [disableDropdown, setDisableDropdown] = useState(false);
  var [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem("loggedIn")) {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (!loggedIn) window.localStorage.removeItem("loggedIn");
  }, [loggedIn]);

  return (
    <nav className="fixed top-0 left-0 z-50 w-screen px-8 py-4 flex flex-row justify-between items-center text-[1rem]">
      <section>
        <Link href={"./"}>
          <Image src={Logo} alt={"TheSomethingSomethingCompany"}></Image>
        </Link>
      </section>
      {true && (
        <section>
          <section className="flex flex-row justify-end items-center">
            <Link
              className="font-bold my-4 mx-8 border-b-4 border-transparent translate-y-1 hover:border-blue-600 transition-all duration-200 ease-in-out"
              href={"./auth?signin=true"}
            >
              LOG IN
            </Link>
            <Link
              className="font-bold text-white bg-[#009C93] hover:bg-[#00877f] p-4 rounded-xl transition-all duration-200 ease-in-out"
              href={"./auth?signin=false"}
            >
              GET STARTED FOR FREE
            </Link>
          </section>
        </section>
      )}
      {false && (
        <section>
          <section className="flex flex-row justify-end items-center">
            <Link
              className="font-bold my-4 mx-8 border-b-4 border-transparent translate-y-1 hover:border-blue-600 transition-all duration-200 ease-in-out"
              href={"./"}
            >
              CHATS
            </Link>
            <section
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
              style={
                {
                  hoverColor: disableDropdown ? "transparent" : "#f7f7f7",
                } as any
              }
            >
              <div className="hover:bg-[hoverColor] px-4 py-2 rounded-xl transition-all duration-200 ease-in-out cursor-pointer">
                <section className="flex flex-row items-center justify-center">
                  {!disableDropdown && (
                    <i className="ri-arrow-drop-down-line text-4xl"></i>
                  )}
                  <p className="px-4">
                    <span className="font-bold">
                      WELCOME,
                      <br />
                    </span>
                    SATANSHU
                  </p>
                  <Image
                    src={Penguin}
                    alt={"Profile Picture"}
                    className="w-14 h-1w-14 rounded-full"
                  ></Image>
                </section>
              </div>
              {!disableDropdown && (
                <div className="relative">
                  <DropMenu isOpen={isOpen} />
                </div>
              )}
            </section>
          </section>
        </section>
      )}
    </nav>
  );
}
