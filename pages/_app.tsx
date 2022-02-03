import "../styles/globals.css";
import Page from "../components/page";
import { StoreProvider } from "../services/store";

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Page>
        <Component {...pageProps} />
      </Page>
    </StoreProvider>
  );
}

export default MyApp;
