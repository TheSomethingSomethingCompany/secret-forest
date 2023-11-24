import {} from "@testing-library/react";
import fetchMock from "jest-fetch-mock" ;
import createAProfile from "../app/createProfile/api/createAProfile.js";
import {render, waitFor, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';



describe("ChatsPage", ()=>{
    it("Ensure chats can be created", async () => {
        
        async function createChat(data){
            const response = await fetch('http://localhost:6969/createChat/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        
            let resBody = await response.json(); // Retrieve body and turn into JSON object
            
            if(resBody.status == 201)
                return true
            else if(resBody.status == 409 || resBody.status == 500 || resBody.status == 404) return false;
           }

            const data = {username: "janedoe123"}; 
            await createChat(data).then((result)=>{
                expect(result).toBe(true);
            });
          
    });

});






describe("ChatsPage", ()=>{
    it("Ensure chats can be received", async () => {
        

        async function retrieveChats(){
            const response = await fetch('http://localhost:6969/retrieveChats/api', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
        
            let resBody = await response.json(); // Retrieve body and turn into JSON object
            if(resBody.status == 201)
                return true
            else if(resBody.status == 422 || resBody.status == 500) return false;
           }

            await retrieveChats().then((result)=>{
                expect(result).toBe(true);
            });
          

    });


});

/*

describe("ChatsPage", ()=>{
    it("Ensure messages can be received", async () => {
        

        async function retrieveMessagesGivenChatID(data){
            const response = await fetch('http://localhost:6969/retrieveMessages/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)

            });
        
            let resBody = await response.json(); // Retrieve body and turn into JSON object
            if(resBody.status == 201)
                return true;
            else if(resBody.status == 422 || resBody.status == 500 || resBody.status == 401) return false;
           }
        
            const data = {chatID: 2}; // Hard coded chatID, will be replaced with dynamic chatID later.
            await retrieveMessagesGivenChatID(data).then((result)=>{
                expect(result).toBe(true);
            });
          
    });


});

describe("ChatsPage", ()=>{
    it("Ensure messages can be sent", async () => {
        

        async function sendMessage(data){
            const response = await fetch('http://localhost:6969/sendMessage/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)

            });
        
            let resBody = await response.json(); // Retrieve body and turn into JSON object
            if(resBody.status == 201)
                return true;
            else if(resBody.status == 422 || resBody.status == 500 || resBody.status == 401) return false;
           }
        
            const data = {chatID: 2, message: "I am a message"}; // Hard coded chatID and message, will be replaced with dynamic values later.
            await sendMessage(data).then((result)=>{
                expect(result).toBe(true);
            });
          
    });


});

describe("ChatsPage", ()=>{
    it("Ensure message can be deleted", async () => {
        

        async function deleteMessage(data){
            const response = await fetch('http://localhost:6969/deleteMessage/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)

            });
        
            let resBody = await response.json(); // Retrieve body and turn into JSON object
            if(resBody.status == 201)
                return true;
            else if(resBody.status == 500 || resBody.status == 401) return false;
           }
        
            const data = {chatID:2, messageID: 35}; // Hardcoded messageID and chatID, will be replaced with dynamic messageID later.
                                                    // chatID coonfirms that the user is a member of the chat, and messageID confirms that the message belongs to the chat and can be deleted.
            await deleteMessage(data).then((result)=>{
                expect(result).toBe(true);
            });
          
    });


});

describe("ChatsPage", ()=>{
    it("Ensure message can be edited", async () => {
        

        async function editMessage(data){
            const response = await fetch('http://localhost:6969/editMessage/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)

            });
        
            let resBody = await response.json(); // Retrieve body and turn into JSON object
            if(resBody.status == 201)
                return true;
            else if(resBody.status == 500 || resBody.status == 401) return false;
           }
        
            const data = {chatID:2, messageID: 27, message: "I am an edited message"}; // Hardcoded messageID and chatID, will be replaced with dynamic messageID later.
                                                    // chatID coonfirms that the user is a member of the chat, and messageID confirms that the message belongs to the chat and can be deleted.
            await editMessage(data).then((result)=>{
                expect(result).toBe(true);
            });
          
    });


});


/*
describe("ChatsPage", ()=>{
    it("Ensure chat can be deleted", async () => {
        

        async function deleteChat(data){
            const response = await fetch('http://localhost:6969/deleteChat/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)

            });
        
            let resBody = await response.json(); // Retrieve body and turn into JSON object
            console.log(resBody.message);
            console.log(resBody.status)
            if(resBody.status == 201)
                return true;
            else if(resBody.status == 500 || resBody.status == 401) return false;
           }
        
            const data = {chatID: 2}; // Hardcoded chatID, will be replaced with dynamic chatID later.
            await deleteChat(data).then((result)=>{
                expect(result).toBe(true);
            });
          
    });


});
*/
