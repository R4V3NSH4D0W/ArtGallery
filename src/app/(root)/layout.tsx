import React from "react";
import Navbar from "../../components/nav_bar";
import Footer from "../../components/footer";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
