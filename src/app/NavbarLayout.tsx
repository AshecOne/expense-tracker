"use clinet";
import Navbar from "../components/Navbar";
import React from "react";
import { useAppDispatch } from "@/lib/hooks";
import { setUser } from "@/lib/features/userSlice";

export default function NavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    const loadUserFromStorage = () => {
      const storedUserData = localStorage.getItem("user");
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        dispatch(setUser(user));
      }
    };

    loadUserFromStorage();
  }, []);
  return (
    <div>
      {children}
      <Navbar />
    </div>
  );
}
