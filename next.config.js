/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['re-meal.com'],
  },
}

module.exports = nextConfig
