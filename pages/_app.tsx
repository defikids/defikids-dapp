import Auth from "@/components/auth";
import "react-toastify/dist/ReactToastify.css";
import { ChakraProvider, extendTheme, useDisclosure } from "@chakra-ui/react";
import RegisterModal from "@/components/Modals/RegisterModal";
import Footer from "@/components/footer";
import { MainLayout } from "@/components/main_layout";
import "@fontsource/slackey";
import "@fontsource-variable/jetbrains-mono";
import { modalTheme } from "@/components/theme/modalTheme";

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

const fonts = {
  heading: `'Slackey', sans-serif`,
  body: `'JetBrains Mono', monospace`,
};

const breakpoints = {
  sm: "48em",
  md: "62em",
  lg: "80em",
  xl: "96em",
  "2xl": "120em",
};

const components = { Modal: modalTheme };

export const theme = extendTheme({
  config,
  colors,
  fonts,
  components,
  breakpoints,
});

function MyApp({ Component, pageProps }) {
  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  return (
    <>
      <ChakraProvider
        theme={theme}
        toastOptions={{
          defaultOptions: {
            position: "bottom",
            isClosable: true,
            duration: 9000,
          },
        }}
      >
        <Auth onRegisterOpen={onRegisterOpen} />
        <MainLayout />
        <Component {...pageProps} />
        <Footer />
        {/* <RegisterModal isOpen={isRegisterOpen} onClose={onRegisterClose} /> */}
      </ChakraProvider>
    </>
  );
}

export default MyApp;
