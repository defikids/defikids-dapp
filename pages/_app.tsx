import Head from "next/head";
import "../styles/globals.css";
import Page from "../components/page";
import Footer from "../components/footer";
import Auth from "../components/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>DefiKids</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Page>
        <ToastContainer
          position="top-right"
          autoClose={false}
          closeOnClick={true}
        />
        <Auth />
        <Component {...pageProps} />
      </Page>
      <Footer />
    </>
  );
}

export default MyApp;
