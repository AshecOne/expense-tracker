"use client";
import * as React from "react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { setUser } from "@/lib/features/userSlice";
import Link from "next/link";
import GuestRoute from "@/components/GuestRoute";

interface ISignUpProps {}

const SignUp: React.FunctionComponent<ISignUpProps> = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting to submit form with data:", {
      name,
      email,
      password,
    });
    try {
      const response = await axios.post("http://localhost:3400/users/signup", {
        name,
        email,
        password,
      });
      console.log(response.data);
      dispatch(setUser(response.data.user));
      router.push("/signin");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error response data:", error.response?.data);
        console.error("Error response status:", error.response?.status);
      } else {
        const e = error as Error;
        console.error("Error message:", e.message);
      }
    }
  };

  return (
    <GuestRoute>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500">
        <h1 className="text-4xl font-bold text-white mb-8">Sign Up</h1>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block mb-2 text-purple-600 font-bold"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-purple-600 font-bold"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-purple-600 font-bold"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
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
            className="w-full px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-white">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-white hover:text-black hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </GuestRoute>
  );
};

export default SignUp;