/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com",
        port: "",
        pathname: "/genacourtney/images/**",
      },
    ],
    domains: ["images.unsplash.com", "source.unsplash.com"],
  },
  experimental: {
    optimizePackageImports: ["@headlessui/react"],
  },
  // Increase timeout for chunk loading
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      aggregateTimeout: 300,
      poll: 1000,
    };
    return config;
  },
  // Improve performance
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
