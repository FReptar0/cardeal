// next.config.mjs
import JavaScriptObfuscator from 'webpack-obfuscator';

const nextConfig = {
  webpack(config, { isServer, dev }) {
    // Solo ofuscar el código del cliente en producción
    if (!dev && !isServer) {
      config.plugins.push(
        new JavaScriptObfuscator(
          {
            rotateStringArray: true,
            // Otras opciones de configuración...
          },
          ['excluded_bundle.js'] // Opcional: archivos a excluir
        )
      );
    }
    return config;
  },
};

export default nextConfig;
