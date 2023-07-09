/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['https://dev.re-meal.com/media/'],
  },
}

module.exports = nextConfig
