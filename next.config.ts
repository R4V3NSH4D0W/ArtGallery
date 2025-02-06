import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,  
  },
  images: {
    domains: ['w.wallhaven.cc', 'artgallery.lenishmagar.me'], 
  },
};

export default nextConfig;
