import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      { source: '/', destination: '/collection', permanent: false },
    ]
  },
};

export default nextConfig;
