import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'artgallery.lenishmagar.me',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'w.wallhaven.cc',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
