"use client";
import Footer from "@/components/footer";
import NavBar from "@/components/nav_bar";
import { ToastContainer } from "react-toastify";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "@/context/userContext";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      <UserProvider>
        <NavBar />
        <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
        {children}
        <Footer />
      </UserProvider>
    </main>
  );
}
