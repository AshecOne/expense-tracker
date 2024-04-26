"use client";
import * as React from "react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setUser } from "@/lib/features/userSlice";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GuestRouteSignIn from "@/components/GuestRouteSignIn";

interface ISignInProps {}

const SignIn: React.FunctionComponent<ISignInProps> = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting to sign in with email:", email);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/signin`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      console.log("Before dispatching setUser");
      dispatch(setUser(response.data.user));
      console.log("After dispatching setUser");
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      alert(`Welcome, ${response.data.user.name}`);
      setIsNavigating(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error response data:", error.response?.data);
        console.error("Error response status:", error.response?.status);
        if (error.response?.status === 401) {
          toast.error("Invalid email or password.");
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } else {
        const e = error as Error;
        console.error("Error message:", e.message);
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <GuestRouteSignIn
      isNavigating={isNavigating}
      setIsNavigating={setIsNavigating}
    >
      <div className="flex flex-col mx-auto items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-400">
        <h1 className="text-4xl font-bold text-black mb-8">Sign In</h1>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-black font-bold">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-black font-bold"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 font-medium hover:text-gray-700 hover:font-semibold focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-black">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-black hover:text-blue-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
      <ToastContainer />
    </GuestRouteSignIn>
  );
};
export default SignIn;
