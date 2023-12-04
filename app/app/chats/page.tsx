"use client";
import Image from "next/image";
import ChatBubble from "../components/conversations/ChatBubble";
import Img from "../images/ExamplePenguin.jpeg";
import retrieveChats from "./api/retrieveChatsFromServer";
import retrieveMessageGivenChatID from "./api/retrieveMessagesGivenChatIDFromServer";
import sendMessage from "./api/sendMessageToServer";
import deleteMessage from "./api/deleteMessageFromServer";
import editMessage from "./api/editMessageOnServer";
import { get } from "http";
import { useRef, useEffect, useState } from "react";

export default function Chats() {
  
  const [chatsList, setChatsList] = useState([]);
  const [messagesList, setMessagesList] = useState([]);
  const [message, setMessage] = useState("");
  const [chatID, setChatID] = useState("");

  
  console.log("chatID: " + chatID);

  async function getChats() {
    let res = await retrieveChats();
    console.log("RESPONSE FROM SERVER:");
    console.log(res);
    if(res.data)
      setChatsList(res.data);
    else setChatsList([]);

  }

  async function getMessages(chatID) {
    let res = await retrieveMessageGivenChatID({ chatID: chatID });
    console.log("RESPONSE FOR MESSAGES:");
    console.log(res);
    if(res.data)
      setMessagesList(res.data);
    else setMessagesList([]);
  }

  async function onSendMessage() {
    console.log("SENDING MESSAGE: " + message);
    console.log("CHAT ID: " + chatID);
    let res = await sendMessage({ chatID: chatID, message: message });
    console.log("RESPONSE FROM SERVER:");
    console.log(res);
    setMessage("");
    getMessages(chatID); // Refresh messages
  }

  useEffect(() => {
    getChats();
  }, []);

  useEffect(() => {
    // Refresh messages every 5 seconds. This is temporary, we will use websockets later.
    const intervalId = setInterval(() => {
      getMessages(chatID);
    }, 3000); // Runs every 5 seconds

    return () => {
      clearInterval(intervalId); // Clears the interval when the component unmounts
    };
  }, [chatID]); // Runs whenever chatID changes

  function onChatClick(e) {
    console.log("Clicked on chat with id: " + e.currentTarget.dataset.chatId); // currentTarget specifies that even if you click a child element, the event is triggered for the parent element for which it is defined, not the child element directly.
    let chatID = e.currentTarget.dataset.chatId;
    setChatID(chatID);
    getMessages(chatID);
  }

  function onSendingMessage(e) {
    setMessage(e.target.value);
    console.log("MESSAGE: " + message);
  }

  function onDeleteButtonClick(e) {
    console.log(
      "Clicked on delete button with id: " + e.currentTarget.dataset.messageId
    );
    // Now, we need to remove the message from the message list
    let messageId = e.currentTarget.dataset.messageId;
    let newMessagesList = messagesList.filter(
      (message) => message.messageID != messageId
    );
    console.log("New messages list: ");
    console.log(newMessagesList);
    setMessagesList(newMessagesList);
    // Next, we need to make an api call to delete the message from the server
    deleteMessage({ messageID: messageId });
  }

  function saveToDatabaseHandler(editedMessage: string, messageID: string) {
    console.log("Saving message to database: " + editedMessage);
    // Now, we need to make an api call to edit the message on the server
    editMessage({ messageID: messageID, message: editedMessage });
  }

  const prevMessagesListLength = useRef(messagesList.length);
  useEffect(() => {
    if (messagesList.length > prevMessagesListLength.current) {
      const messagesDiv = document.getElementById("list-messages-div");
      if (messagesDiv) {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
    }
    prevMessagesListLength.current = messagesList.length;
  }, [messagesList]);

  return (
    <section className="m-4 grid grid-cols-4 grid-rows-1 rounded-lg shadow-md drop-shadow-md w-screen h-[50rem] bg-gray-100">
      {/* First, we need to make an api call to the RetrieveChats route */}

      <div className = "flex flex-col itmes-center col-span-1 overflow-y-scroll">

        {
            chatsList.length == 0 ? 
            (<div className = "flex flex-col items-center justify-center h-full"> 
              <h1 className = "text-2xl font-bold"> No chats yet! </h1> 
              <h2 className = "text-xl font-normal"> Start a conversation with someone! </h2> 
            </div>)
            : 
            (chatsList.map((chat) => {
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
                  </div>
                </div>
                <div className="flex flex-col justify-between p-2">
                  <span className="p-1 rounded-full bg-pink-600 w-8 h-8 text-center text-white font-normal">
                    2
                  </span>
                </div>
              </div>
            )
          }))

        }

      </div>

      <section className="m-2 rounded-lg shadow-md drop-shadow-md col-span-3 flex flex-col justify-evenly ">
        <div id = "list-messages-div" className="flex-1 p-2 overflow-y-auto">
          {
            messagesList.length == 0 ? 
            (<div className = "flex flex-col items-center justify-center h-full"> 
              <h1 className = "text-2xl font-bold"> No messages yet! </h1> 
              <h2 className = "text-xl font-normal"> Start a conversation! </h2>
              <h2 className = "text-xl font-normal"> Or, select a chat from the left! </h2>
            </div>)
            :(messagesList.map((message) => {
              return (
                <ChatBubble
                key = {message.messageID}
                  id={message.messageID}
                  name={message.name}
                  message={message.message}
                  profilePicture={""}
                  hasAttachment={false}
                  isYou={message.isYou}
                  onDeleteButtonClick = {onDeleteButtonClick}
                  saveToDatabaseHandler={saveToDatabaseHandler}
                />
              )
            }))
          }
         
        </div>
        <div className="p-2">
          <div className="flex flex-row justify-between items-center p-2">
            <input
              type="text"
              className="w-full h-12 rounded-lg shadow-md drop-shadow-md p-2 m-2"
              placeholder="Type a message..."
              onChange={onSendingMessage}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  e.preventDefault();
                  onSendMessage();
                }
              }}
              value={message}
            />
            <button
              id="sendButton"
              className="w-12 h-12 rounded-lg shadow-md drop-shadow-md bg-blue-600 text-white m-2"
              onClick={onSendMessage}
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}
