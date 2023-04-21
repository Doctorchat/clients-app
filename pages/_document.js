import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ro">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
            rel="stylesheet"
          />
          <GTMScript />
        </Head>
        <body>
          <GTMIframe />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

const GTMIframe = () => {
  const gtmKey = process.env.NEXT_PUBLIC_GTM_KEY;
  const enableGtm = process.env.NODE_ENV === "production" && gtmKey;

  return (
    enableGtm && (
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmKey}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    )
  );
};

const GTMScript = () => {
  const gtmKey = process.env.NEXT_PUBLIC_GTM_KEY;
  const enableGtm = process.env.NODE_ENV === "production" && gtmKey;

  return (
    enableGtm && (
      <Script id="google-tag" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer',${gtmKey});`}
      </Script>
    )
  );
};
