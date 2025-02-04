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
    <main>
      <AuthProvider>
        <NavBar />
        <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
        {children}
        <Footer />
      </AuthProvider>
    </main>
  );
}
