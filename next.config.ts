import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // TODO: Fix ESLint issues before production deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TODO: Fix TypeScript issues before production deployment
    ignoreBuildErrors: true,
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
