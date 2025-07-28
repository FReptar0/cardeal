/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    // 1 mes = 30d → 2592000 s  
    // 5 años = 5 × 365d → 157680000 s  
    const ONE_MONTH  = 30 * 24 * 60 * 60;
    const FIVE_YEARS = 5 * 365 * 24 * 60 * 60;

    return [
      {
        source: '/videos/:path*\\.(mp4|webm)',
        headers: [
          {
            key: 'Cache-Control',
            value: `public, max-age=${FIVE_YEARS}, immutable`
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: `max-age=31536000`
          }
        ]
      },

      {
        source: '/:path*\\.(js|css|png|jpg|jpeg|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: `public, max-age=${ONE_MONTH}, immutable`
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: `max-age=${ONE_MONTH}`
          }
        ]
      },

      {
        source: '/:path*',
        has: [{ type: 'header', key: 'accept', value: 'text/html' }],
        headers: [
          {
            key: 'Cache-Control',
            value: `public, max-age=${ONE_MONTH}, immutable`
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: `max-age=${ONE_MONTH}`
          }
        ]
      }
    ]
  }
}

export default nextConfig
