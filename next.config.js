/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['dev.re-meal.com'],
  },
}

module.exports = nextConfig
