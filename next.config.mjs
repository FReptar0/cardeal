/** @type {import('next').NextConfig} */
const ONE_YEAR   = 365 * 24 * 60 * 60
const FIVE_YEARS = 5   * 365 * 24 * 60 * 60

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(logos|icons|images-seguros|photos|Protecciones)/:path*\\.(png|jpg|jpeg|webp|avif|svg)$',
        headers: [
          {
            key: 'Cache-Control',
            value: `public, max-age=${ONE_YEAR}, s-maxage=${ONE_YEAR}, immutable`
          }
        ]
      },
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
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          }
        ]
      }
    ]
  }
}

export default nextConfig
