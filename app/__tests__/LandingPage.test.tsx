import {} from "@testing-library/react";
import fetchMock from "jest-fetch-mock" ;
import {render, waitFor, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingPage from "../app/components/landing-page/LandingPage";

describe("Landing Page", ()=>{
    it("Ensure Landing Page renders", () =>{
        render(<LandingPage/>);
    });
});
