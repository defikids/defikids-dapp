// import "../styles/globals.css";
import Page from "../components/page";
import NewFooter from "@/components/NewFooter";
import Auth from "../components/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

export const theme = extendTheme({ config, colors });

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ChakraProvider theme={theme}>
        <Page />
        <ToastContainer
          position="top-right"
          autoClose={false}
          closeOnClick={true}
        />
        <Auth />
        <Component {...pageProps} />
        {/* </Page> */}

        {/* <NewFooter /> */}
      </ChakraProvider>
    </>
  );
}

export default MyApp;
