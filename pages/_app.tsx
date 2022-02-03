import "../styles/globals.css";
import Page from "../components/page";
import { StoreProvider } from "../services/store";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Head>
        <title>Allocate</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Page>
        <Component {...pageProps} />
      </Page>
    </StoreProvider>
  );
}

export default MyApp;
