"use client";
import * as React from "react";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setUser } from "@/lib/features/userSlice";
import Link from "next/link";
import NavbarLayout from "../NavbarLayout";
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute";

interface IProfilProps {}

const Profil: React.FunctionComponent<IProfilProps> = (props) => {
  const user = useAppSelector((state: any) => state.user);
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log("Checking for user data...");
    const fetchData = async () => {
      console.log(`Fetching user data for user ID: ${user.id}`);
      try {
        const response = await axios.get(
          `http://localhost:3400/users/?userId=${user.id}`
        );
        console.log("Response from server:", response.data);
        const { id_user, name, email } = response.data[0];
        dispatch(setUser({ id: id_user, name, email, isLoggedIn: true }));
        localStorage.setItem(
          "user",
          JSON.stringify({ id: id_user, name, email, isLoggedIn: true })
        );
        console.log("Data saved to local storage:", {
          id: id_user,
          name,
          email,
          isLoggedIn: true,
        });
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error fetching profile data with response:",
            error.response?.data
          );
          console.error(
            "Error fetching profile data with status:",
            error.response?.status
          );
        } else {
          console.error(
            "Error fetching profile data:",
            (error as Error).message
          );
        }
      }
    };
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      dispatch(setUser(parsedUser));
      console.log("User data from local storage:", parsedUser);
    } else {
      fetchData();
    }
  }, [dispatch, user.id]);

  return (
    <ProtectedRoute>
    <NavbarLayout>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center justify-center mb-6">
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-4xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-purple-600 mb-2">
              {user.name}
            </h2>
            <p className="text-gray-600 mb-6">{user.email}</p>
            <Link href="/setting">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">
                Settings
              </button>
            </Link>
          </div>
        </div>
      </div>
    </NavbarLayout>
    </ProtectedRoute>
  );
};

export default Profil;
