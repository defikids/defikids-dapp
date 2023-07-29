import Head from "next/head";
import "../styles/globals.css";
import Page from "../components/page";
import { StoreProvider } from "../services/store";
import Footer from "../components/footer";
import Auth from "../components/auth";

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
