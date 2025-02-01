import Aos from "@/components/Aos";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTopBtn from "@/components/ScrollToTopBtn";
/* import TopLoadingLine from "@/components/TopLoadingLine"; */
import { GoogleTagManager } from "@next/third-parties/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "@/styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>{/* <title>Beat MasterMind Blog</title> */}</Head>
      <Header />

      <main>
        {/* <TopLoadingLine /> */}

        <Aos>
          <Component {...pageProps} />
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER} />
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        </Aos>

        <ScrollToTopBtn />
      </main>
      <Footer />
    </>
  );
}
