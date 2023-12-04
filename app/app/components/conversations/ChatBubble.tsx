"use client";
import React, { useState, useRef } from "react";
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
  isYou: boolean;
  onDeleteButtonClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  saveToDatabaseHandler: (editedMessage: string, messageID: string) => void;
};

function ChatBubble({
  id,
  name,
  message,
  profilePicture,
  hasAttachment,
  attachment,
  attachmentType,
  isYou,
  onDeleteButtonClick,
  saveToDatabaseHandler
}: props) {
  const [mouseOver, setMouseOver] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [messageText, setMessageText] = useState(message);
  const referenceToMessageBox = useRef(null);
  const referenceToEditBox = useRef<HTMLInputElement>(null); // Can't use useState otherwise a rerender will be forced on every keystroke of the input field when editing. 

  /* We need to use the reference to replace its innerHTML with an input box when the edit button is clicked. */
  function onEditButtonClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setIsEditing(true);
  }
  
  console.log(mouseOver);
  return (
    <section className="mt-40 bg-gray-50">
      {isYou ? (
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
          <div className="flex flex-row-reverse -mr-16 items-end">
            <img
              src={Penguin.src}
              alt="ProfilePicture"
              className="relative z-10 w-24 rounded-full object-scale-down"
            />
            <div className="relative z-0 mr-[-4rem] p-2 w-[14rem] flex flex-row justify-start bg-blue-600 text-white rounded-xl text-start">
              <p id="name">{name}</p>
            </div>
          </div>
          <div ref = {referenceToMessageBox} className="relative z-10 ml-8 mt-2 shadow-md drop-shadow-md rounded-xl w-full p-4 MESSAGEBOXISHERE bg-white" >
            { isEditing ? ( // Since the key of the ChatBubble does not change, we do not have to worry about the input field being cancelled as a result of Chats Page recreating the ChatBubble for every new message, since the corresponding ChatBubble will be recreated with the same key, and thus React will use the existing ChatBubble instead of creating a new one.
              <input ref = {referenceToEditBox} type = "text" defaultValue = {messageText} className = "w-full h-full" />
            ) : (
              <p id="message">{messageText + " "+id}</p>
            )}

          </div>

          {/* This is the div that contains the buttons. It is hidden by default, and is shown when the mouse hovers over the chat bubble. */}
          <div className="ml-8 -z-10 w-full flex flex-row justify-end -translate-y-[--translateAmt] transition-transform duration-300">
            {
              isEditing ?  
              (
                // If the user is editing the message, show the save button, and the cancel button.
                <> {/* DUE TO THIS, THE STYLES ARE NOT BEING APPLIED TO THESE INNER DIVS MOST LIKELY */}
                  <div className="p-2 bg-blue-600 rounded-b-lg mx-[0.3rem] text-white hover:cursor-pointer" onClick = {() => { setIsEditing(false); setMessageText(referenceToEditBox?.current?.value || ''); saveToDatabaseHandler(referenceToEditBox?.current?.value || '', id); }} >
                    <i className="ri-save-fill"></i>
                  </div>
                  <div className="p-2 bg-blue-600 rounded-b-lg mx-[0.3rem] mr-4 text-white hover:cursor-pointer" onClick = {() => { setIsEditing(false); }} >
                    <i className="ri-close-fill"></i>
                  </div>
                  </>
              ):(
                <>
                  <div className="p-2 bg-blue-600 rounded-b-lg mx-[0.3rem] text-white hover:cursor-pointer" onClick = {onDeleteButtonClick} data-message-id = {id}>
                    <i className="ri-delete-bin-2-fill"></i>
                  </div>
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
                  <div className="p-2 bg-blue-600 rounded-b-lg mx-[0.3rem] mr-4 text-white hover:cursor-pointer" onClick = {onEditButtonClick}>
                    <i className="ri-edit-fill"></i>
                  </div>
                </>
              )
          }
          </div>
        </div>
      ) : (
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
              className="relative w-24 h-2w-24 rounded-full object-scale-down z-10"
            />
            <div className="relative p-2 ml-[-4rem] w-[14rem] flex flex-row justify-end bg-blue-600 text-white rounded-xl z-0 TAGHERE">
              <p id="name">{name}</p>
            </div>
          </div>
          <div className="relative z-10 ml-8 mt-2 shadow-md drop-shadow-md rounded-xl bg-white w-full p-4">
            <p id="message">{messageText + " "+id}</p>
          </div>
          <div className="ml-8 -z-10 w-full flex flex-row justify-end -translate-y-[--translateAmt] transition-transform duration-300">
            <div className="p-2 bg-blue-600 rounded-b-lg mx-[0.3rem] text-white cursor-not-allowed">
              <i className="ri-delete-bin-2-fill"></i>
            </div>
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
            {/* <div className="p-2 bg-blue-600 rounded-b-lg mx-[0.3rem] mr-4 text-white cursor-not-allowed">
            <i className="ri-edit-fill"></i>
          </div> */}
          </div>
        </div>
      )}
    </section>
  );
}

export default ChatBubble;
