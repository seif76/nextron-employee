/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',
  env: {
    MONGO_URI: process.env.MONGO_URI,
  },
  distDir: process.env.NODE_ENV === 'production' ? '../app' : '.next',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    return config
  },
}
