/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: false,
  images: {
    domains: ['raw.githubusercontent.com', 'fonts.gstatic.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'llehcuskrowlknlesxhc.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  output: 'standalone',
  excludeDefaultMomentLocales: true,
  trailingSlash: false,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configurer les routes pour que MapView soit toujours rendu côté client
  async rewrites() {
    return [
      {
        source: '/pages/MapView',
        destination: '/pages/MapView',
        has: [
          {
            type: 'header',
            key: 'x-nextjs-data',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig 