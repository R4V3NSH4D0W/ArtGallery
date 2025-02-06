import React from "react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1 style={{ fontSize: "2rem" }}>404 - Page Not Found</h1>
      <Link href="/" passHref>
        <a style={{ color: "blue" }}>Go back to the homepage</a>
      </Link>
    </div>
  );
};

export default NotFoundPage;
