"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { updateUser } from "@/lib/features/userSlice";
import axios from "axios";
import NavbarLayout from "../NavbarLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

interface ISettingProps {}

const Setting: React.FunctionComponent<ISettingProps> = (props) => {
  const user = useAppSelector((state: any) => state.user);
  const dispatch = useAppDispatch();
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    console.log("Setting user data on form:", {
      name: user.name,
      email: user.email,
    });
    setName(user.name || "");
    setEmail(user.email || "");
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending profile update with data:", { name, email });
    try {
      const response = await axios.put(
        `http://localhost:3400/users/${user.id}`,
        {
          name,
          email,
        }
      );
      // Pastikan respon server mengembalikan data pengguna yang diperbarui
      dispatch(
        updateUser({
          name: response.data.user.name,
          email: response.data.user.email,
        })
      );
      console.log("Profile updated successfully with response:", response.data);
      alert("Profile updated successfully");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error updating profile with response:",
          error.response?.data
        );
        console.error(
          "Error updating profile with status:",
          error.response?.status
        );
      } else {
        // If it's not an AxiosError, it's safe to assume it's a regular Error object
        console.error("Error updating profile:", (error as Error).message);
      }
      alert("Failed to update profile");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log("Password and confirm password do not match");
      alert("Passwords do not match");
      return;
    }
    console.log("Attempting to change password for user id:", user.id);
    try {
      await axios.put(
        `http://localhost:3400/users/${user.id}/change-password`,
        {
          password,
        }
      );
      console.log("Password changed successfully");
      alert("Password changed successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error changing password with response:",
          error.response?.data
        );
        console.error(
          "Error changing password with status:",
          error.response?.status
        );
      } else {
        console.error("Error changing password:", (error as Error).message);
      }
      alert("Failed to change password");
    }
  };

  return (
    <ProtectedRoute>
    <NavbarLayout>
      <div className="container max-w-sm  mx-auto px-4 pt-8 pb-20 bg-gradient-to-br from-white to-blue-400">
        <h1 className="text-2xl font-bold mb-4 text-black">Settings</h1>
        <form onSubmit={handleUpdateProfile} className="mb-8">
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-black font-bold">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-black font-bold">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Update Profile
          </button>
        </form>
        <h2 className="text-xl font-bold mb-4 text-black">Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-black font-bold">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2 text-black font-bold">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Change Password
          </button>
        </form>
      </div>
    </NavbarLayout>
    </ProtectedRoute>
  );
};

export default Setting;
