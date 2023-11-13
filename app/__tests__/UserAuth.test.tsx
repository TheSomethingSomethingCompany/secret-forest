import fetchMock from "jest-fetch-mock";
import SignUp from "@/app/auth/[slug]/api/signup";
import SignIn from "@/app/auth/[slug]/api/signin";
beforeEach(() => {
  fetchMock.resetMocks();
});

describe("UserAuthentication", () => {
  it("SignUp | Receive proper data given succesful response", async () => {
    let body: {
      data: { id: string };
      status: number;
    } = {
      data: { id: "13450b43-5e5e-494e-9b0c-777eda5903bd" },
      status: 201,
    };

    fetchMock.mockResponse(JSON.stringify(body));
    const response = await SignUp({
      name: "John Doe",
      email: "johndoe@email.com",
      username: "JohnDoe",
      password: "Test@123456!",
      isorganization: false,
    });
    expect(response).toEqual("13450b43-5e5e-494e-9b0c-777eda5903bd");
  });
  it("SignUp | Receive proper data given succesful response", async () => {
    let body: {
      data: { id: string } | null;
      status: number;
    } = {
      data: null,
      status: 501,
    };

    fetchMock.mockResponse(JSON.stringify(body));
    const response = await SignUp({
      name: "John Doe",
      email: "johndoe@email.com",
      username: "JohnDoe",
      password: "Test@123456!",
      isorganization: false,
    });
    expect(response).toEqual(501);
  });
  it("Sign In Username | Receive proper data given succesful response", async () => {
    let body: {
      data: { username: string } | null;
      status: number;
    } = {
      data: { username: "JohnDoe" },
      status: 201,
    };

    fetchMock.mockResponse(JSON.stringify(body));
    const response = await SignIn({
      identifier: "JohnDoe",
      password: "Test@123456!",
      isEmail: false,
    });
    expect(response).toEqual("JohnDoe");
  });
  it("Sign In Username | Receive proper data given unsuccesful response", async () => {
    let body: {
      data: { username: string } | null;
      status: number;
    } = {
      data: null,
      status: 501,
    };

    fetchMock.mockResponse(JSON.stringify(body));
    const response = await SignIn({
      identifier: "JohnDoe",
      password: "Test@123456!",
      isEmail: false,
    });
    expect(response).toEqual(501);
  });
  it("Sign In Email | Receive proper data given succesful response", async () => {
    let body: {
      data: { username: string } | null;
      status: number;
    } = {
      data: { username: "JohnDoe" },
      status: 201,
    };

    fetchMock.mockResponse(JSON.stringify(body));
    const response = await SignIn({
      identifier: "johndoe@email.com",
      password: "Test@123456!",
      isEmail: true,
    });
    expect(response).toEqual("JohnDoe");
  });
  it("Sign In Email | Receive proper data given unsuccesful response", async () => {
    let body: {
      data: { username: string } | null;
      status: number;
    } = {
      data: null,
      status: 501,
    };

    fetchMock.mockResponse(JSON.stringify(body));
    const response = await SignIn({
      identifier: "johndoe@email.com",
      password: "Test@123456!",
      isEmail: true,
    });
    expect(response).toEqual(501);
  });
});
