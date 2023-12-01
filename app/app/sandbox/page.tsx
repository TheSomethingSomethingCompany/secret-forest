import React from "react";
import ChatBubble from "../components/conversations/ChatBubble";
ChatBubble;

function page() {
  return (
    <>
      <ChatBubble
        id={"1"}
        name={"Satanshu Mishra"}
        message={"Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
        profilePicture={""}
        hasAttachment={false}
        isYou={true}
      />
      <ChatBubble
        id={"2"}
        name={"Satanshu Mishra"}
        message={"Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
        profilePicture={""}
        hasAttachment={true}
        isYou={false}
      />
    </>
  );
}

export default page;
