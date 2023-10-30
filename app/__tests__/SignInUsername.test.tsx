import fetch from "node-fetch";

describe("SignInUsername", () => {
  it("should return a successful response with correct credentials", async () => {
    const body = {
      identifier: "johndoe",
      password: "johndoe@123#",
    };

    // SEND A REAL POST REQUEST TO THE SIGN-IN API
    const response = await fetch("/api/signin/username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // TEST THE SIGN-IN API RESPONSE
    const responseData = await response.json();
    console.log(first);
    expect(response.status).toEqual(201);
    expect(responseData).toEqual({
      success: true,
      message: "User signed in successfully",
      data: {
        username: "johndoe",
        // add any other expected data here
      },
    });
  });
});
