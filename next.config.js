/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['llehcuskrowlknlesxhc.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'llehcuskrowlknlesxhc.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig 