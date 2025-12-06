import type { NextConfig } from "next";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "greenyellow-lion-623632.hostingersite.com",
      },
      {
        protocol: "https",
        hostname: "media.lordicon.com",
      },
    ],
  },

  turbopack: {},

  webpack(config: any) {
    config.optimization.minimize = false;
    return config;
  },
};

export default nextConfig;
