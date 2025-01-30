"use client";
import Footer from "@/components/footer";
import NavBar from "@/components/nav_bar";

import React from "react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      <NavBar />
      {children}
      <Footer />
    </main>
  );
}
