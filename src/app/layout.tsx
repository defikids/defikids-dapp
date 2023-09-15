import { Metadata } from "next";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import RegisterModal from "@/components/Modals/RegisterModal";
import Footer from "@/components/footer";
import { useState } from "react";

import { usePathname } from "next/navigation";

import { Providers } from "./providers";
import "@rainbow-me/rainbowkit/styles.css";

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
  // const {
  //   isOpen: isRegisterOpen,
  //   onOpen: onRegisterOpen,
  //   onClose: onRegisterClose,
  // } = useDisclosure();

  // const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
