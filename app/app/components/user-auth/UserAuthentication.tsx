"use client";

import React, { useState } from "react";

export default function UserAuthentication() {
  const [showSignIn, setShowSignIn] = useState(true);
  return showSignIn ? (
    <section className="flex justify-evenly">
      <div>
        <h1 className="font-bold text-2xl">Sign In</h1>
        <form className="flex flex-col items-start" action="#">
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" id="username" />
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" id="password" />
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div>
        <h1>New to our website?</h1>
        <p>Start your journey with us today!</p>
        <button onClick={() => setShowSignIn(!showSignIn)}>Sign Up</button>
      </div>
    </section>
  ) : (
    <section className="flex flex-row-reverse justify-evenly">
      <div>
        <h1 className="font-bold text-2xl">Sign Up</h1>
        <form className="flex flex-col items-start" action="#">
          <label htmlFor="firstname">Firstname:</label>
          <input type="text" name="firstname" id="firstname" />
          <label htmlFor="lastname">Lastname:</label>
          <input type="text" name="lastname" id="lastname" />
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" id="username" />
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" id="password" />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div>
        <h1>Already have an account?</h1>
        <p>Sign in to your account here!</p>
        <button onClick={() => setShowSignIn(!showSignIn)}>Sign In</button>
      </div>
    </section>
  );
}
