import {} from "@testing-library/react";
import fetchMock from "jest-fetch-mock" ;
import createAProfile from "../app/createProfile/api/createAProfile.js";
import {render, waitFor, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateProfileForm from '../app/components/CreateProfileForm/CreateProfileForm.jsx';



beforeEach(() =>{
    fetchMock.resetMocks();
});

describe("CreateProfileForm", ()=>{
    it("Ensure CreateProfileForm renders", () =>{
        render(<CreateProfileForm/>);
    });
});

describe("CreateProfileForm", ()=>{
    it("Ensure fullName input can be updated", async () => {
        const { getByLabelText, getByText } = render(<CreateProfileForm />);
        const fullNameInput = getByLabelText(/Full Name/); // Returns input field with the associated label as DOM object
        userEvent.type(fullNameInput, "John Doe");
    
        await waitFor(() => { //Virtual DOM updates are asynchronous. Thereforem we need to wait until the value is updated
            expect(fullNameInput.value).toEqual("John Doe"); 
        });
    });
    
});

describe("CreateProfileForm", ()=>{
    it("Ensure country input can be updated", async () => {
        const { getByLabelText, getByText } = render(<CreateProfileForm />);
        const countryInput = getByLabelText(/Country Of Residence/);
        userEvent.type(countryInput, "Canada");
    
        await waitFor(() => { //Virtual DOM updates are asynchronous. Thereforem we need to wait until the value is updated
            expect(countryInput.value).toEqual("Canada"); 
        });
    });

});

describe("CreateProfileForm", ()=>{
    it("Ensure country input can be updated", async () => {
        const { getByLabelText, getByText } = render(<CreateProfileForm />);
        const countryInput = getByLabelText(/Country Of Residence/);
        userEvent.type(countryInput, "Canada");
    
        await waitFor(() => { //Virtual DOM updates are asynchronous. Thereforem we need to wait until the value is updated
            expect(countryInput.value).toEqual("Canada"); 
        });
    });

});

describe("CreateProfileForm", ()=>{
    it("Ensure address input can be updated", async () => {
        const { getByLabelText, getByText } = render(<CreateProfileForm />);
        const addrInput = getByLabelText(/Address/);
        userEvent.type(addrInput, "Wellington St, Ottawa");
    
        await waitFor(() => { //Virtual DOM updates are asynchronous. Thereforem we need to wait until the value is updated
            expect(addrInput.value).toEqual("Wellington St, Ottawa"); 
        });
    });

});

describe("OccupationTags", ()=>{
    it("Ensure an occupationTag input can be updated", async () => {
        const { getByLabelText, getByText } = render(<CreateProfileForm />);
        const occupationTagsInput = getByLabelText(/Occupation Tags/);
        userEvent.type(occupationTagsInput, "Software Engineer");
    
        await waitFor(() => { //Virtual DOM updates are asynchronous. Thereforem we need to wait until the value is updated
            expect(occupationTagsInput.value).toEqual("Software Engineer"); 
        });
    });

});

describe("CreateProfileForm", ()=>{
    it("Ensure bio input can be updated", async () => {
        const { getByLabelText, getByText } = render(<CreateProfileForm />);
        const bioInput = getByLabelText(/Bio/);
        userEvent.type(bioInput, "Something");
    
        await waitFor(() => { //Virtual DOM updates are asynchronous. Therefore we need to wait until the value is updated
            expect(bioInput.value).toEqual("Something"); 
        });
    });

});

describe("OccupationTags", ()=>{
    it("Ensure an occupationTag can be created", async () => {
        const { getByLabelText, getByText, container } = render(<CreateProfileForm />);
        const occupationTagsInput = getByLabelText(/Occupation Tags/);
        await userEvent.type(occupationTagsInput, "Software Engineer{enter}");
        const expectedOccupationTagValue = container.querySelector("#SoftwareEngineer").textContent;
        expect(expectedOccupationTagValue).toEqual("Software Engineer");
    });

});

describe("OccupationTags", ()=>{
    it("Ensure an occupationTag can be deleted after creation by clicking 'x' button", async () => {
        const { getByLabelText, getByText, container } = render(<CreateProfileForm />);
        const occupationTagsInput = getByLabelText(/Occupation Tags/);
        await userEvent.type(occupationTagsInput, "Software Engineer{enter}");
        const deleteButton = container.querySelector("#SoftwareEngineer").nextElementSibling; // Assuming "x" is unique enough in this context
        await userEvent.click(deleteButton);
        const occupationTag = container.querySelector("#SoftwareEngineer");
        expect(occupationTag).toEqual(null);
    });

});

describe("createAProfile", () => {
    it("Ensure empty input fields are emphasized to user when form submitted and required fields are not filled out", async ()=>{
        const {getByLabelText, getByText, queryByText} = render(<CreateProfileForm/>);

        /** Type in "Full Name" and "Country" input fields, but do not fill out address field */
        const fullNameInput = getByLabelText(/Full Name/);
        await userEvent.type(fullNameInput, "John Doe");
        const countryInput = getByLabelText(/Country Of Residence/);
        await userEvent.type(countryInput, "Canada");

        const submitButton = getByText(/SUBMIT/); 
        await submitButton.click();

        const addrErrorMsgElement = queryByText(/You cannot leave this field empty! Please enter your address/);
        expect(addrErrorMsgElement).not.toEqual(null);

    });

});




describe("createAProfile", () =>{
it("Ensure profile can be created given correct fields", async()=>{
    
        const mockRequest = {
            fullName: "John Doe",
            country: "Canada",
            address: "Some Test Address 123",
            bio: "Some Test Bio",
            occupationTags: ["test1", "test2"]
        };

        const response = await createAProfile(mockRequest);

        expect(response).toEqual(true);
    
    });

});


describe("createAProfile", () =>{
    it("Ensure profile can't be created given incorrect fields", async()=>{
        
            const mockRequest = {
                fullName: "John Doe",
                country: "",
                address: "",
                bio: "Some Test Bio",
                occupationTags: ["test1", "test2"]
            };
    
            const response = await createAProfile(mockRequest);
    
            expect(response).toEqual(false);
        
        });
    
    });

