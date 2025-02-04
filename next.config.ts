import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  /* config options here */
  images: {
    domains: ['w.wallhaven.cc'],
  },
  
};

export default nextConfig;
