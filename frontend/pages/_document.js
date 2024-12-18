import { Html, Head, Main, NextScript } from "next/document";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Start cookieyes banner */}
        <Script
          id="cookieyes"
          type="text/javascript"
          src={`https://cdn-cookieyes.com/client_data/${process.env.NEXT_PUBLIC_COOKIE_YES}/script.js`}
          strategy="beforeInteractive"
        ></Script>
        {/* End cookieyes banner */}

        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER}');`}
        </Script>
        {/* End Google Tag Manager */}

        <Script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                  page_path: window.location.pathname,});
              `
          }}
        />

        {/* Character, robots, and OG image */}
        <meta charSet="UTF-8" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta property="og:locale" content="en_US" />
        <meta name="author" content="Beat MasterMind" />
        <meta property="og:image:width" content="920" />
        <meta property="og:image:height" content="470" />
        <meta name="title" content="Beat MasterMind Blog" />
        <meta
          name="description"
          content="Beat MasterMind - Blog about electronic drums and accessories. Your guide to the world of rhythm, in silence!"
        />

        {/* Site name and keywords */}
        <meta
          property="og:site_name"
          content="Beat MasterMind - Blog about Electronic drums, accessories and information - Electronic drums - Drums - Drumsticks - Pads"
        />
        <meta
          name="keywords"
          content="Electronic drums, Accessories for Electronic drums, Information about Electronic drums"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.png" />

        {/* <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} /> */}
      </Head>

      <body>
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER} />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
