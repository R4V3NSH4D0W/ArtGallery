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
        port: '4000', 
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'w.wallhaven.cc',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',  
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
