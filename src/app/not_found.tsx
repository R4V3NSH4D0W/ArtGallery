"use client";
import React from "react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        textAlign: "center",
        padding: "50px",
        flexDirection: "column",
      }}
    >
      <h1 style={{ fontSize: "2rem" }}>404 - Page Not Found</h1>
      <Link
        href="/"
        style={{
          color: "blue",
          textDecoration: "underline",
          marginTop: "20px",
        }}
      >
        Go back to the homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
