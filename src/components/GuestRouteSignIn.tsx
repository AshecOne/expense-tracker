"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";

const GuestRouteSignIn = ({
  children,
  isNavigating,
  setIsNavigating,
}: {
  children: React.ReactNode;
  isNavigating: boolean;
  setIsNavigating: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state: any) => state.user.isLoggedIn);

  React.useEffect(() => {
    if (isLoggedIn && !isNavigating) {
      console.log("Setting isNavigating to true");
      setIsNavigating(true);
    } else if (isLoggedIn && isNavigating) {
      console.log("Navigating to dashboard");
      router.push("/dashboard");
    }
  }, [isLoggedIn, isNavigating, router, setIsNavigating]);

  if (isLoggedIn && isNavigating) {
    return null;
  }

  return <>{children}</>;
};

export default GuestRouteSignIn;
