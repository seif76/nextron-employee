"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const [cookies, setCookie] = useCookies(["jwt"]);
  const router = useRouter();

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setErrorMessage("");

    axios
      .post("http://localhost:3000/api/auth/login", { email, password })
      .then((response) => {
        const token = response.data.token;
        if (typeof window !== "undefined" && window.localStorage) {
            localStorage.setItem("jwt", token);
          }
        console.log("Login Successful:", response.data.message);
        setCookie("jwt", token);
        router.push("/employees"); // Navigate to dashboard or home page
      })
      .catch((error) => {
        console.error("Login Error:", error);
        setErrorMessage("Invalid email or password. Please try again.");
      });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="relative w-full max-w-4xl rounded-lg shadow-md bg-white flex flex-col lg:flex-row overflow-hidden">
        {/* Left Section - Moves to top on small screens */}
        <div
          className="relative w-full lg:w-1/2 bg-blue-500 p-6 lg:p-10 flex flex-col justify-center items-center text-center rounded-b-[80px] lg:rounded-b-none lg:rounded-r-[80px]"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">Welcome to Your LMS </h2>
          
        </div>
  
        {/* Right Section */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 p-6 lg:p-10">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="mt-4 lg:mt-6 text-2xl lg:text-3xl font-bold text-gray-900">
              Sign in to your account
            </h2>
          </div>
  
          <form onSubmit={handleLogin} className="space-y-4 lg:space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={handleEmail}
                required
                className="mt-1 lg:mt-2 block w-full rounded-md border border-gray-300 p-2 lg:p-3 focus:border-blue-500 focus:ring-blue-500 sm:text-base"
              />
            </div>
  
            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                onChange={handlePassword}
                required
                className="mt-1 lg:mt-2 block w-full rounded-md border border-gray-300 p-2 lg:p-3 focus:border-yellow-500 focus:ring-yellow-500 sm:text-base"
              />
            </div>
  
            {/* Error Message */}
            {errorMessage && (
              <p className="text-center text-sm text-red-500">{errorMessage}</p>
            )}
  
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-md bg-blue-500 py-2 lg:py-3 px-4 text-base font-semibold text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
