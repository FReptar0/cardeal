/** @type {import('next').NextConfig} */
const ONE_MONTH = 30 * 24 * 60 * 60       //  2592000 s
const ONE_YEAR = 365 * 24 * 60 * 60      // 31536000 s
const FIVE_YEARS = 5 * 365 * 24 * 60 * 60 // 157680000 s

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/videos/:path*\\.(mp4|webm)$',
        headers: [
          {
            key: 'Cache-Control',
            value: `public, max-age=${FIVE_YEARS}, s-maxage=${ONE_YEAR}, immutable`
          }
        ]
      },
      {
        source: '/:path*\\.(js|css|png|jpg|jpeg|webp|avif)$',
        headers: [
          {
            key: 'Cache-Control',
            value: `public, max-age=${ONE_MONTH}, s-maxage=${ONE_MONTH}, immutable`
          }
        ]
      },
      {
        source: '/:path*',
        has: [
          { type: 'header', key: 'accept', value: 'text/html' }
        ],
        headers: [
          {
            key: 'Cache-Control',
            value: `public, max-age=${ONE_MONTH}, s-maxage=${ONE_MONTH}, immutable`
          }
        ]
      }
    ]
  }
}

export default nextConfig;
