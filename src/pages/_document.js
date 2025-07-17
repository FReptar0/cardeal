import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
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
