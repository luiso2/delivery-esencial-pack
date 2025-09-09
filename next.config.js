/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',  // Habilitado para generar archivos estáticos
  trailingSlash: false,
  // distDir: 'out',  // Por defecto Next.js usa 'out' cuando output es 'export'
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  // PWA configuration
  headers: async () => {
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
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig