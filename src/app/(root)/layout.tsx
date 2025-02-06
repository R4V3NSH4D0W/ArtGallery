"use client";
import Footer from "@/components/footer";
import NavBar from "@/components/nav_bar";
import { ToastContainer } from "react-toastify";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex flex-col min-h-screen">
      <AuthProvider>
        <NavBar />
        <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
        <div className="flex-grow">{children}</div>
        <Footer />
      </AuthProvider>
    </main>
  );
}
