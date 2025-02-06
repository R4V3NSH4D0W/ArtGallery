
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  images: {
    domains: ['artgallery.lenishmagar.me','w.wallhaven.cc'],
  },
};

export default nextConfig;
