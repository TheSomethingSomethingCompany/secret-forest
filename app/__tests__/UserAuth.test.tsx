import fetchMock from "jest-fetch-mock";
import SignUp from "../app/auth/api/signup";
import SignIn from "../app/auth/api/signin";
import AuthResponse from "@/app/types/AuthResponse";
import Member from "@/app/types/Member";
import DeleteUser from "@/app/auth/api/deleteuser";

beforeEach(() => {
  fetchMock.resetMocks();
});

describe("User Authentication Action", () => {
  it("Ensure profile can be created given the correct credentials", async () => {
    const request: Member = {
      name: "John Murphy Doe",
      username: "JMurphyDoe",
      email: "j.murphy.doe@email.com",
      password: "ThisIsTheSafestPasswordEver@123456#",
      isorganization: false,
    };
    const response: AuthResponse = await SignUp(request);
    expect(response.status).toEqual(201);
    expect(response.message).toEqual("User SignUp Successful");
    expect(response.pgErrorObject).toBeFalsy();
    expect(response.data).toBeTruthy();
  });
  it("Ensure profile cannot be created if profile with similar credentials already exists", async () => {
    const request: Member = {
      name: "John Murphy Doe",
      username: "JMurphyDoe",
      email: "j.murphy.doe@email.com",
      password: "ThisIsTheSafestPasswordEver@123456#",
      isorganization: false,
    };
    const response: AuthResponse = await SignUp(request);
    expect(response.status).toEqual(500);
    expect(response.message).toEqual("User SignUp Failed");
    expect(response.data).toBeFalsy();
    expect(response.pgErrorObject).toBeTruthy();
  });
  it("Ensure user can sign in using email given the correct credentials", async () => {
    const request = {
      identifier: "j.murphy.doe@email.com",
      password: "ThisIsTheSafestPasswordEver@123456#",
      isEmail: true,
    };
    const response: AuthResponse = await SignIn(request);
    expect(response.status).toEqual(201);
    expect(response.message).toEqual("User SignIn Successful");
    expect(response.pgErrorObject).toBeFalsy();
    expect(response.data).toBeTruthy();
  });
  it("Ensure user can sign in using username given the correct credentials", async () => {
    const request = {
      identifier: "JMurphyDoe",
      password: "ThisIsTheSafestPasswordEver@123456#",
      isEmail: false,
    };
    const response: AuthResponse = await SignIn(request);
    expect(response.status).toEqual(201);
    expect(response.message).toEqual("User SignIn Successful");
    expect(response.pgErrorObject).toBeFalsy();
    expect(response.data).toBeTruthy();
  });
  it("Ensure user cannot sign in using username given the incorrect credentials", async () => {
    const request = {
      identifier: "NOTJMurphyDoe",
      password: "ThisIsNOTTheSafestPasswordEver@123456#",
      isEmail: false,
    };
    const response: AuthResponse = await SignIn(request);
    expect(response.status).toEqual(404);
    expect(response.message).toEqual("Invalid Credentials");
    expect(response.pgErrorObject).toBeTruthy();
    expect(response.data).toBeFalsy();
  });
  it("Ensure user cannot sign in using email given the incorrect credentials", async () => {
    const request = {
      identifier: "not.j.murphy.doe@email.com",
      password: "ThisIsNOTTheSafestPasswordEver@123456#",
      isEmail: true,
    };
    const response: AuthResponse = await SignIn(request);
    expect(response.status).toEqual(404);
    expect(response.message).toEqual("Invalid Credentials");
    expect(response.pgErrorObject).toBeTruthy();
    expect(response.data).toBeFalsy();
  });

  it("Delete Test User", async () => {
    const request = {
      username: "JMurphyDoe",
    };
    const response = await DeleteUser(request);
  });
});
