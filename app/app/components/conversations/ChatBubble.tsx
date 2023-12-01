"use client";
import React, { useState } from "react";
import Cat from "@/app/images/CuteClef.png";
import Penguin from "@/app/images/ExamplePenguin.jpeg";
import Image from "next/image";
import "remixicon/fonts/remixicon.css";

type props = {
  id: string;
  name: string;
  message: string;
  profilePicture: string;
  hasAttachment: boolean;
  attachment?: string;
  attachmentType?: string;
};

function ChatBubble() {
  const [mouseOver, setMouseOver] = useState(false);
  console.log(mouseOver);
  return (
    <section className="mt-40 bg-gray-50">
      <div
        className="p-2 text-xl max-w-md"
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
        style={
          {
            "--translateAmt": mouseOver ? "0" : "100%",
          } as any
        }
      >
        <div className="flex flex-row items-end">
          <img
            src={Penguin.src}
            alt="ProfilePicture"
            className="absolute w-24 h-2w-24 rounded-full object-scale-down"
          />
          <div className="ml-8 p-2 w-[14rem] flex flex-row justify-end bg-blue-600 text-white rounded-xl">
            <p id="name">Satanshu Mishra</p>
          </div>
        </div>
        <div className="relative z-10 ml-8 mt-2 shadow-md drop-shadow-md rounded-xl bg-white w-full p-4">
          <p id="message">
            Hello, I am Satanshu Mishra! Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Modi rem error suscipit, optio quia quam facere
            dignissimos eligendi dolore provident blanditiis voluptates saepe.
            Recusandae, deserunt molestias repudiandae nemo hic mollitia?
          </p>
        </div>
        <div className="ml-8 -z-10 w-full flex flex-row justify-end -translate-y-[--translateAmt] transition-transform duration-300">
          <div
            className="p-2 bg-blue-600 rounded-b-lg mx-[0.3rem] text-white cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(
                document.getElementById("message")?.textContent ?? ""
              );
            }}
          >
            <i className="ri-clipboard-fill"></i>
          </div>
          <div className="p-2 bg-blue-600 rounded-b-lg mx-[0.3rem] mr-4 text-white cursor-not-allowed">
            <i className="ri-edit-fill"></i>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChatBubble;
