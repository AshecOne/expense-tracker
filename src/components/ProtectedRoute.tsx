import React from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state: any) => state.user.isLoggedIn);

  if (!isLoggedIn) {
    router.push("/");
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;