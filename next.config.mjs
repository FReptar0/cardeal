/** @type {import('next').NextConfig} */
const ONE_MONTH  = 30 * 24 * 60 * 60        //  2592000 s
const ONE_YEAR   = 365 * 24 * 60 * 60       // 31536000 s
const FIVE_YEARS = 5   * 365 * 24 * 60 * 60 // 157680000 s

const nextConfig = {
  reactStrictMode: true,
  // Vercel maneja automáticamente muchos headers de cache
  async headers() {
    return [
      // Imágenes del directorio public: cache largo
      {
        source: '/(logos|icons|images-seguros|photos|Protecciones)/:path*\\.(png|jpg|jpeg|webp|avif|svg)$',
        headers: [
          {
            key: 'Cache-Control',
            value: `public, max-age=${ONE_YEAR}, s-maxage=${ONE_YEAR}, immutable`
          }
        ]
      },
      // Vídeos: cache muy largo
      {
        source: '/videos/:path*\\.(mp4|webm)$',
        headers: [
          {
            key: 'Cache-Control',
            value: `public, max-age=${FIVE_YEARS}, s-maxage=${ONE_YEAR}, immutable`
          }
        ]
      },
      // API routes: no cache (importante para funcionalidad dinámica)
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
      // Vercel maneja automáticamente _next/static y páginas HTML
    ]
  }
}

export default nextConfig
