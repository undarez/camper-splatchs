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
  output: 'export',
  distDir: 'out',
  excludeDefaultMomentLocales: true,
  trailingSlash: false,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Exclure les API routes lors de l'export statique
  exportPathMap: async function (defaultPathMap) {
    const pathMap = { ...defaultPathMap };
    // Supprimer les routes API dynamiques qui ne sont pas compatibles avec l'export statique
    delete pathMap['/api/AdminStation/[id]'];
    return pathMap;
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