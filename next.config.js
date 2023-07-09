/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    loader: 'imgix',
    path: 'https://dev.re-meal.com/media/',
  },
}

module.exports = nextConfig
