import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable modern build optimizations
  experimental: {
    optimizePackageImports: ['@radix-ui/react-dropdown-menu', '@radix-ui/react-scroll-area', '@radix-ui/react-separator', '@radix-ui/react-slot', '@radix-ui/react-switch', 'lucide-react'],
    turbo: {
      resolveAlias: {
        // Optimize imports for better tree-shaking
        '@radix-ui/react-dropdown-menu': '@radix-ui/react-dropdown-menu/dist/index.mjs',
        '@radix-ui/react-scroll-area': '@radix-ui/react-scroll-area/dist/index.mjs',
        '@radix-ui/react-separator': '@radix-ui/react-separator/dist/index.mjs',
        '@radix-ui/react-slot': '@radix-ui/react-slot/dist/index.mjs',
        '@radix-ui/react-switch': '@radix-ui/react-switch/dist/index.mjs',
      },
    },
  },
  
  // Improve performance
  poweredByHeader: false,
  compress: true,
  
  // Enable modern JavaScript features
  swcMinify: true,
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
  },
  
  // Headers for better security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Bundle analyzer support
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
