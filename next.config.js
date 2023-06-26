/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns : [
      {
        protocol: 'https',
        hostname: 're-meal.com',
      },
    ],
  },
}

module.exports = nextConfig
