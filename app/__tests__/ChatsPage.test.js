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