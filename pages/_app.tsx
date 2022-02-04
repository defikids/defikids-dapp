import Head from "next/head";
import "../styles/globals.css";
import Page from "../components/page";
import { StoreProvider } from "../services/store";
import dynamic from "next/dynamic";

const Auth = dynamic(() => import("../components/auth"), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Head>
        <title>Allocate</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Page>
        <Auth />
        <Component {...pageProps} />
      </Page>
    </StoreProvider>
  );
}

export default MyApp;
