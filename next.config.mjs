/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { reactRoot: true, prefetch: false },
  async headers(){
    return [
      {
        source: '/:path*\\.(js|css|png|jpg|jpeg|webp|avif|mp4)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      }
    ]
  }
};

export default nextConfig;
