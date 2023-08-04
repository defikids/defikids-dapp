// import "../styles/globals.css";
import Page from "@/components/Page";
import Auth from "@/components/Auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChakraProvider, extendTheme, useDisclosure } from "@chakra-ui/react";
import RegisterModal from "@/components/Modals/RegisterModal";

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
  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  return (
    <>
      <ChakraProvider theme={theme}>
        <Page onRegisterOpen={onRegisterOpen} />
        <ToastContainer
          position="top-right"
          autoClose={false}
          closeOnClick={true}
        />
        <Auth onRegisterOpen={onRegisterOpen} />
        <RegisterModal isOpen={isRegisterOpen} onClose={onRegisterClose} />
        <Component {...pageProps} />
        {/* </Page> */}

        {/* <NewFooter /> */}
      </ChakraProvider>
    </>
  );
}

export default MyApp;
