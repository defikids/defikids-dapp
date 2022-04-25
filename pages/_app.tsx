import Head from "next/head";
import "../styles/globals.css";
import Page from "../components/page";
import { StoreProvider } from "../services/store";
import dynamic from "next/dynamic";
import Footer from "../components/footer";

const Auth = dynamic(() => import("../components/auth"), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Head>
        <title>DefiKids</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Page>
        <Auth />
        <Component {...pageProps} />
      </Page>
      <Footer />
    </StoreProvider>
  );
}

export default MyApp;
