/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
      {
        source: '/songs',
        destination: '/api/auth',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
