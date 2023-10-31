import {} from "@testing-library/react";
import fetchMock from "jest-fetch-mock" ;
import createAProfile from "../app/createProfile/api/createAProfile.js";


beforeEach(() =>{
    fetchMock.resetMocks();
});

describe("CreateProfile", () =>{
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


describe("CreateProfile", () =>{
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

