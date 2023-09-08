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
import { RegisterBanner } from "@/components/landingPage/RegisterBanner";
import "@fontsource/slackey";
import "@fontsource-variable/jetbrains-mono";
import { useRouter } from "next/router";
import { chains, wagmiConfig } from "@/services/wagmi/wagmiConfig";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";

function MyApp({ Component, pageProps }) {
  const [hasCheckedUserType, setHasCheckedUserType] = useState(false);
  const [showStartEarning, setShowStartEarning] = useState(false);

  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  const { userDetails } = useAuthStore((state) => ({
    userDetails: state.userDetails,
  }));

  const router = useRouter();

  useEffect(() => {
    userDetails?.userType === UserType.UNREGISTERED && hasCheckedUserType
      ? setShowStartEarning(true)
      : setShowStartEarning(false);
  }, [isRegisterOpen, hasCheckedUserType, userDetails?.userType]);

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
          {!router.pathname.includes("/confirm-email") && (
            <>
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
            </>
          )}

          <Component {...pageProps} />

          {router.pathname === "/" && <Footer />}

          <RegisterModal isOpen={isRegisterOpen} onClose={onRegisterClose} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
