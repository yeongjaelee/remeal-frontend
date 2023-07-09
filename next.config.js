/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dev.re-meal.com',
        port: '',
        pathname: '/media',
      },
    ],
  },
}

module.exports = nextConfig
