/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        has: [
          { type: 'header', key: 'accept', value: 'text/html' }
        ],
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=59'
          }
        ]
      },
      {
        source: '/:path*\\.(js|css|png|jpg|jpeg|webp|avif|mp4|webm)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
