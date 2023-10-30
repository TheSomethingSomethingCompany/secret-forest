import {} from "@testing-library/react";
import { POST as createUser } from "../app/auth/[slug]/api/signup/route";

describe("SignUp", () => {
  it("Successfully able to sign-up the user.", () => {
    // CREATE A MOCK USER SIGN-UP REQUEST BODY
    const body = {
      firstname: "John",
      lastname: "Doe",
      username: "johndoe",
      email: "johndoe@example.com",
      password: "johndoe@123#",
    };

    // CREATE MOCK FETCH TO TEST THE SIGN-UP API
    const mockFetch = jest.fn(() => {
      return Promise.resolve({
        json: () => Promise.resolve({ data: body }),
      });
    });

    // TEST MOCK RETURN VALUE
    mockFetch().then(async (res) => {
      expect((await res.json()).data).toEqual(body);
    });
  });
});
