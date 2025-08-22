import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Meta tags SEO y Open Graph */}
        <meta name="description" content="Renta de autos en CDMX con seguro incluido, entrega en aeropuerto y a domicilio. Reserva tu coche en línea al mejor precio." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Renta de autos en CDMX" />
        <meta property="og:description" content="Renta rápida y segura con entrega en aeropuerto o a domicilio." />
        <meta property="og:image" content="https://www.qardeal.com/og-qardeal.jpg" />
        <meta property="og:url" content="https://www.qardeal.com/" />
        <meta property="og:site_name" content="Qardeal" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Renta de autos en CDMX" />
        <meta name="twitter:description" content="Renta rápida y segura con entrega en aeropuerto o a domicilio." />
        <meta name="twitter:image" content="https://www.qardeal.com/og-qardeal.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://www.qardeal.com/" />
        
        {/* Carga gtag.js con next/script correctamente */}
        {/* GTAG for AW-17260472755 using next/script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17260472755"
          strategy="afterInteractive"
        />
        <Script
          id="google-ads-conversion"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17260472755');

              function gtag_report_conversion(url) {
                var callback = function () {
                  if (typeof(url) != 'undefined') {
                    window.location = url;
                  }
                };
                gtag('event', 'conversion', {
                  'send_to': 'AW-17260472755/PGelCIzbruEaELPTt6ZA',
                  'event_callback': callback
                });
                return false;
              }
            `,
          }}
        />
        {/* Google Analytics tag using next/script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N4YZE7NF7W"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-N4YZE7NF7W');
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
