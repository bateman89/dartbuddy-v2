/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Wichtig für Azure Static Web Apps
  assetPrefix: process.env.NODE_ENV === 'production' ? './' : '',
}

module.exports = nextConfig