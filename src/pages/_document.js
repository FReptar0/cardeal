import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Google Tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17260472755"
        ></script>
        <script
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
      </Head>
      <Main />
      <NextScript />
    </Html>
  );
}
