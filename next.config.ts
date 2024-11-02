import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd10gn8tykquxw1.cloudfront.net',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
