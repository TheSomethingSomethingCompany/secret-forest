import {} from "@testing-library/react";
import fetchMock from "jest-fetch-mock" ;
import createAProfile from "../app/createProfile/api/createAProfile.js";


beforeEach(() =>{
    fetchMock.resetMocks();
});

describe("CreateProfile", () =>{
it("Receive proper data given successful body and response", async()=>{
    let mockResponse = { 
        success: true,
         message: 'Profile created successfully' 
        };

        fetchMock.mockResponse(JSON.stringify(mockResponse));

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

    describe("CreateProfile", )

});

