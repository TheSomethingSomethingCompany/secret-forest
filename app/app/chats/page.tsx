"use client"
import Image from "next/image";
import ChatBubble from "../components/conversations/ChatBubble";
import Img from "../images/ExamplePenguin.jpeg";
import retrieveChats from "./api/retrieveChatsFromServer";
import retrieveMessageGivenChatID from "./api/retrieveMessagesGivenChatIDFromServer";
import { get } from "http";
import { use, useEffect, useState } from "react";

export default function Chats() {
  
  
  const [response, setResponse] = useState([]);
  const [messages, setMessages] = useState([]);
  async function getChats() {
    let res = await retrieveChats();
    console.log("RESPONSE FROM SERVER:")
    console.log(res);
    setResponse(res.data);
    }

  async function getMessages(chatID) {
    let res = await retrieveMessageGivenChatID({chatID: chatID});
    console.log("RESPONSE FOR MESSAGES:")
    console.log(res);
    setMessages(res.data);
  }

  useEffect(() => {
    getChats();
  }, []);

  function onChatClick(e) {
    console.log("Clicked on chat with id: " + e.currentTarget.dataset.chatId); // currentTarget specifies that even if you click a child element, the event is triggered for the parent element for which it is defined, not the child element directly.
    let chatID = e.currentTarget.dataset.chatId;
    getMessages(chatID);

  }


  return (
    <section className="m-4 mt-40 grid grid-cols-4 grid-rows-1 rounded-lg shadow-md drop-shadow-md w-screen h-[50rem] bg-purple-100">
      {/* First, we need to make an api call to the RetrieveChats route */}
      <div className = "flex flex-col itmes-center col-span-1">

        {
        response.map((chat) => {
          return (
            <div onClick = {onChatClick} data-chat-id = {chat.chatID} className="m-2 rounded-lg shadow-md drop-shadow-md flex flex-row justify-evenly bg-white h-fit w-full"> {/* A single chat */}
              <div className="flex flex-row justify-between flex-1 p-4">
                <div className="p-2">
                  <img
                    src={Img.src}
                    alt="Example"
                    className="w-24 rounded-full object-scale-down"
                  />
                </div>
                <div className="flex flex-col flex-1 w-full items-start justify-center p-2"> 
                  <span className="text-center">{chat.name}</span>
                  <span className="text-center">@{chat.username}</span>
                  <span className="text-center">@{chat.chatID}</span>
                </div>
              </div>
              <div className="flex flex-col justify-between p-2">
                <span className="p-1 rounded-full bg-pink-600 w-8 h-8 text-center text-white font-normal">
                  2
                </span>
              </div>
            </div>
          )
        })
        
      }
      </div>
     
  
  
      <section className="m-2 rounded-lg shadow-md drop-shadow-md col-span-3 flex flex-col justify-evenly">
        <div id = "list-messages-div" className="flex-1 p-2 overflow-y-scroll">
          {
            messages.map((message) => {
              return (
                <ChatBubble
                  id={message.messageID}
                  name={message.name}
                  message={message.message}
                  profilePicture={""}
                  hasAttachment={false}
                  isYou={message.isYou}
                />
              )
            })
          }

          <ChatBubble
            id={"2"}
            name={"Satanshu Mishra"}
            message={"Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
            profilePicture={""}
            hasAttachment={true}
            isYou={false}
          />
            <ChatBubble
            id={"2"}
            name={"Satanshu Mishra"}
            message={"Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
            profilePicture={""}
            hasAttachment={true}
            isYou={false}
          />
         
        </div>
        <div className="p-2">
          <div className="flex flex-row justify-between items-center p-2">
            <input
              type="text"
              className="w-full h-12 rounded-lg shadow-md drop-shadow-md p-2 m-2"
              placeholder="Type a message..."
            />
            <button className="w-12 h-12 rounded-lg shadow-md drop-shadow-md bg-blue-600 text-white m-2">
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}

