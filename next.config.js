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
}

module.exports = nextConfig 