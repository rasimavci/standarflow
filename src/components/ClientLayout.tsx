"use client";

import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/signin" || pathname === "/signup";

  return (
    <AuthProvider>
      {!hideNavbar && <Navbar />}
      {children}
    </AuthProvider>
  );
}
