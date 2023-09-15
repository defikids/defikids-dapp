"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/services/chakra/theme";
import { ColorModeScript } from "@chakra-ui/react";
import { chains, wagmiConfig } from "@/services/wagmi/wagmiConfig";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { useEffect, useState } from "react";
import "@fontsource/slackey";
import "@fontsource-variable/jetbrains-mono";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <CacheProvider>
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
              {mounted && children}
            </RainbowKitProvider>
          </WagmiConfig>
        </ChakraProvider>
      </CacheProvider>
    </>
  );
}
