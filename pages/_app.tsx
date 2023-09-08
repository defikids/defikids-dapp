"use client";

import Auth from "@/components/auth";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { theme } from "@/services/chakra/theme";
import { useAuthStore } from "@/store/auth/authStore";
import { UserType } from "@/dataSchema/enums";
import { MainLayout } from "@/components/main_layout";
import RegisterModal from "@/components/Modals/RegisterModal";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import "@fontsource/slackey";
import "@fontsource-variable/jetbrains-mono";
import { useRouter } from "next/router";
import { chains, wagmiConfig } from "@/services/wagmi/wagmiConfig";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import ComingSoon from "../components/ComingSoon";

function MyApp({ Component, pageProps }) {
  const [hasCheckedUserType, setHasCheckedUserType] = useState(false);
  const [showStartEarning, setShowStartEarning] = useState(false);

  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  const { userDetails, isLoggedIn } = useAuthStore((state) => ({
    userDetails: state.userDetails,
    isLoggedIn: state.isLoggedIn,
  }));

  const router = useRouter();

  useEffect(() => {
    userDetails?.userType === UserType.UNREGISTERED && hasCheckedUserType
      ? setShowStartEarning(true)
      : setShowStartEarning(false);
  }, [isRegisterOpen, hasCheckedUserType, userDetails?.userType]);

  const hide = () => {
    if (router.pathname.startsWith("/member-invite")) return false;
    if (!isLoggedIn) return false;
    return true;
  };

  if (true) {
    return (
      <ChakraProvider
        theme={theme}
        toastOptions={{
          defaultOptions: {
            position: "bottom",
            isClosable: true,
            duration: 4000,
          },
        }}
      >
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains} modalSize="compact">
            {/* <Component {...pageProps} /> */}
            <ComingSoon />
          </RainbowKitProvider>
        </WagmiConfig>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider
      theme={theme}
      toastOptions={{
        defaultOptions: {
          position: "bottom",
          isClosable: true,
          duration: 4000,
        },
      }}
    >
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} modalSize="compact">
          <>
            <Auth
              setHasCheckedUserType={setHasCheckedUserType}
              hasCheckedUserType={hasCheckedUserType}
            />

            <MainLayout
              showStartEarning={showStartEarning}
              isRegisterOpen={isRegisterOpen}
              onRegisterOpen={onRegisterOpen}
            />
          </>

          <Component {...pageProps} />

          {router.pathname === "/" && <Footer />}

          <RegisterModal isOpen={isRegisterOpen} onClose={onRegisterClose} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
