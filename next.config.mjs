/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    const oneMonth = 30 * 24 * 60 * 60;
    const fiveYears = 5 * 365 * 24 * 60 * 60;

    return [
      {
        source: '/videos/:path*\\.(mp4|webm)$',
        headers: [
          {
            key: 'Cache-Control',
            value: `max-age=${fiveYears}, s-maxage=${fiveYears}, immutable`
          }
        ]
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: `max-age=${oneMonth}, s-maxage=${oneMonth}, immutable`
          }
        ]
      }
    ];
  }
};

export default nextConfig;
