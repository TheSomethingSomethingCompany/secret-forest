import {} from "@testing-library/react";
import fetchMock from "jest-fetch-mock" ;
import {render, waitFor, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../app/components/Navbar/Navbar'


describe("Navbar", ()=>{
    it("Ensure Navbar renders", () =>{
        render(<Navbar/>);
    });
});

describe("Navbar", ()=>{
    it("Ensure Home link returns to home page", async () => {
        const { queryByTestId } = render(<Navbar />);
        const homeButton1 = queryByTestId(/home1/);
        const homeButton2 = queryByTestId(/home2/);
    
        await waitFor(() => { 
            expect(homeButton1?.getAttribute('href')).toEqual("/")
            expect(homeButton2?.getAttribute('href')).toEqual("/"); 

        });
    });
});

describe("Navbar", ()=>{
    it("Ensure Login button is showed when logged out", async () => {
        const { queryByTestId } = render(<Navbar />);
        const login = queryByTestId(/login/); 
        const localstorage = window.localStorage.getItem("loggedIn")
    
        await waitFor(() => {
            expect(login?.textContent).toEqual("Login"); 
            expect(localstorage).toBeNull();
        });
    });
});

describe('Navbar', () => {
    beforeEach(() => {
        // Set the item in localStorage
        window.localStorage.setItem('loggedIn', 'test');
      });

    it('Ensure logout button is shown when logged in', async () => {
        const { queryByTestId } = render(<Navbar />);
  
  
      // Wait for the component to re-render after the page reloads
      await waitFor(
        () => {
          const logout = screen.queryByTestId(/logout/);
          const localstorage = window.localStorage.getItem('loggedIn');
  
          // Add conditions to check if the element is present
          return logout && localstorage === 'test';
        },
        { timeout: 5000 } // Increase the timeout if needed
      );
  
      // assert the expected state of the DOM
      const logout = queryByTestId(/logout/);
      expect(logout?.textContent).toEqual('Logout');
    });
  });








