"use client";

import Auth from "@/components/auth";
import { ChakraProvider, useDisclosure, extendTheme } from "@chakra-ui/react";
import { modalTheme } from "@/components/theme/modalTheme";
import { switchTheme } from "@/components/theme/switchTheme";
import { menuTheme } from "@/components/theme/menuTheme";
import { drawerTheme } from "@/components/theme/drawerTheme";
import { useAuthStore } from "@/store/auth/authStore";
import { UserType } from "@/services/contract";
import { MainLayout } from "@/components/main_layout";
import RegisterModal from "@/components/Modals/RegisterModal";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import { RegisterBanner } from "@/components/landingPage/RegisterBanner";
import "@fontsource/slackey";
import "@fontsource-variable/jetbrains-mono";
import { useRouter } from "next/router";
import { chains, wagmiConfig } from "@/services/wagmi/wagmiConfig";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";

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

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const components = {
  Modal: modalTheme,
  Switch: switchTheme,
  Menu: menuTheme,
  Drawer: drawerTheme,
};

export const theme = extendTheme({
  config,
  colors,
  fonts,
  components,
  breakpoints,
});

function MyApp({ Component, pageProps }) {
  const [hasCheckedUserType, setHasCheckedUserType] = useState(false);
  const [showStartEarning, setShowStartEarning] = useState(false);

  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  const { userType } = useAuthStore((state) => ({
    userType: state.userType,
  }));

  const router = useRouter();

  useEffect(() => {
    userType === UserType.UNREGISTERED && hasCheckedUserType
      ? setShowStartEarning(true)
      : setShowStartEarning(false);
  }, [isRegisterOpen, hasCheckedUserType, userType]);

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
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} modalSize="compact">
          <Auth
            onRegisterOpen={onRegisterOpen}
            setHasCheckedUserType={setHasCheckedUserType}
            hasCheckedUserType={hasCheckedUserType}
          />

          {showStartEarning && !isRegisterOpen && (
            <RegisterBanner onRegisterOpen={onRegisterOpen} />
          )}

          <MainLayout
            showStartEarning={showStartEarning}
            isRegisterOpen={isRegisterOpen}
          />
          <Component {...pageProps} />

          {router.pathname === "/" && <Footer />}

          <RegisterModal isOpen={isRegisterOpen} onClose={onRegisterClose} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
