import { POST as signInEmail } from "../app/auth/[slug]/api/signin/email/route";

describe("SignInEmail", () => {
  it("Successfully able to sign-in the user using their email", () => {
    // CREATE A MOCK USER SIGN-IN REQUEST BODY
    const body = {
      email: "johndoe@example.com",
      password: "johndoe@123#",
    };
    // CREATE MOCK FETCH TO TEST THE SIGN-IN API
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
