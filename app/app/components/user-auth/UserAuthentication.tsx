"use client";

import React, { useState } from "react";

export default function UserAuthentication() {
  const [showSignIn, setShowSignIn] = useState(true);
  return showSignIn ? (
    <section className="grid grid-cols-2 p-0 m-0 w-screen h-screen">
      <div className="flex flex-col justify-center items-start p-20 w-full h-full">
        <h1 className="font-bold text-6xl mb-4">Sign In</h1>
        <form className="flex flex-col items-start mb-4" action="#">
          <label className="text-3xl font-semibold pb-2" htmlFor="username">
            Username:
          </label>
          <input
            className="mb-4 p-2 rounded-lg border-2 border-transparent selection:border-blue-400"
            type="text"
            name="username"
            id="username"
          />
          <label className="text-3xl font-semibold pb-2" htmlFor="password">
            Password:
          </label>
          <input
            className="mb-8 p-2 rounded-lg border-2 border-transparent selection:border-blue-400"
            type="password"
            name="password"
            id="password"
          />
          <button
            className="p-2 font-semibold rounded-lg bg-black border-2 border-black hover:bg-white text-white hover:text-black transition-all duration-300 ease-in-out cursor-not-allowed"
            type="button"
          >
            Sign In
          </button>
        </form>
      </div>
      <div className="flex flex-col justify-center items-start p-20 w-full h-full bg-blue-600">
        <h1 className="text-6xl text-white font-black pb-4">
          New to our website?
        </h1>
        <p className="text-3xl text-white font-normal pb-8">
          Start your journey with us today!
        </p>
        <button
          className="p-2 font-semibold rounded-lg bg-white border-2 border-white hover:border-black text-black transition-all duration-300 ease-in-out"
          onClick={() => setShowSignIn(!showSignIn)}
        >
          Sign Up
        </button>
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
