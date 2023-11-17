import {} from "@testing-library/react";
import fetchMock from "jest-fetch-mock" ;
import createAProfile from "../app/createProfile/api/createAProfile.js";
import {render, waitFor, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';


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
            console.log(resBody.message);
            console.log(resBody.status)
            if(resBody.status == 201)
                return true;
            else if(resBody.status == 422 || resBody.status == 500) return false;
           }
        

       

            await retrieveChats().then((result)=>{
                expect(result).toBe(true);
            });
          

    });


});

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
            console.log(resBody.message);
            console.log(resBody.status)
            if(resBody.status == 201)
                return true;
            else if(resBody.status == 422 || resBody.status == 500 || resBody.status == 401) return false;
           }
        
            const data = {chatID: 1};
            await retrieveMessagesGivenChatID(data).then((result)=>{
                expect(result).toBe(true);
            });
          
    });


});

describe("ChatsPage", ()=>{
    it("Ensure messages can be sent", async () => {
        

        async function retrieveMessagesGivenChatID(data){
            const response = await fetch('http://localhost:6969/sendMessage/api', {
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
            else if(resBody.status == 422 || resBody.status == 500 || resBody.status == 401) return false;
           }
        
            const data = {chatID: 1, senderID: '61109528-7c05-4683-9fe5-e4c282ac7d2e', message: "I am a message"};
            await retrieveMessagesGivenChatID(data).then((result)=>{
                expect(result).toBe(true);
            });
          
    });


});