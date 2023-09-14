import { Metadata } from "next";
import Auth from "@/components/auth";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { theme } from "@/services/chakra/theme";
import { MainLayout } from "@/components/main_layout";
import RegisterModal from "@/components/Modals/RegisterModal";
import Footer from "@/components/footer";
import { useState } from "react";
import "@fontsource/slackey";
import "@fontsource-variable/jetbrains-mono";
import { useRouter } from "next/router";
import { chains, wagmiConfig } from "@/services/wagmi/wagmiConfig";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { ColorModeScript } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasCheckedUserType, setHasCheckedUserType] = useState(false);

  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  const router = useRouter();

  return (
    <html lang="en">
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
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
                  isRegisterOpen={isRegisterOpen}
                  onRegisterOpen={onRegisterOpen}
                />
              </>
              {children}

              {router.pathname === "/" && <Footer />}

              <RegisterModal
                isOpen={isRegisterOpen}
                onClose={onRegisterClose}
              />
            </RainbowKitProvider>
          </WagmiConfig>
        </ChakraProvider>
      </body>
    </html>
  );
}
