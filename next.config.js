/** @type {import('next').NextConfig} */
const nextConfig = {

  env: {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REDIRECT_URI: process.env.REDIRECT_URI,
    OPENAI_API_KEY:process.env.OPENAI_API_KEY
  },


  async redirects() {
    return [
      {
        source: '/',
        destination: '/api/auth',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
