const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["@tanstack/react-query", "zustand"],
  },
};

export default nextConfig;
