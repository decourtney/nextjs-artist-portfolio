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
  },
};

export default nextConfig;
