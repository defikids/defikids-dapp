"use client";

import Auth from "@/components/auth";
import "react-toastify/dist/ReactToastify.css";
import {
  ChakraProvider,
  useDisclosure,
  Text,
  Badge,
  Flex,
  extendTheme,
} from "@chakra-ui/react";
import { modalTheme } from "@/components/theme/modalTheme";
import { useAuthStore } from "@/store/auth/authStore";
import { UserType } from "@/services/contract";
import { MainLayout } from "@/components/main_layout";
import RegisterModal from "@/components/Modals/RegisterModal";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import { RegisterBanner } from "@/components/landingPage/RegisterBanner";
import "@fontsource/slackey";
import "@fontsource-variable/jetbrains-mono";

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

  const { userType, isLoggedIn } = useAuthStore((state) => ({
    userType: state.userType,
    isLoggedIn: state.isLoggedIn,
  }));

  const [showStartEarning, setShowStartEarning] = useState(false);

  useEffect(() => {
    if (isLoggedIn && userType === UserType.UNREGISTERED) {
      setShowStartEarning(true);
    }
  }, [isRegisterOpen, isLoggedIn, userType]);

  return (
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

      {showStartEarning && !isRegisterOpen && (
        <RegisterBanner onRegisterOpen={onRegisterOpen} />
      )}

      <MainLayout
        showStartEarning={showStartEarning}
        isRegisterOpen={isRegisterOpen}
      />
      <Component {...pageProps} />
      <Footer />
      <RegisterModal isOpen={isRegisterOpen} onClose={onRegisterClose} />
    </ChakraProvider>
  );
}

export default MyApp;
