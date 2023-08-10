import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import Navbar from "./navbar";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import { useDisclosure, Box, useBreakpointValue } from "@chakra-ui/react";
import FaqModal from "./Modals/FaqModal";
import AboutModal from "./Modals/AboutModal";
import WalletModal from "./Modals/WalletModal";
import RegisterModal from "@/components/Modals/RegisterModal";

export const MainLayout = () => {
  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });

  const { navigationSection } = useAuthStore(
    (state) => ({
      navigationSection: state.navigationSection,
    }),
    shallow
  );

  const {
    isOpen: isFaqOpen,
    onOpen: onFaqOpen,
    onClose: onFaqClose,
  } = useDisclosure();

  const {
    isOpen: isAboutOpen,
    onOpen: onAboutOpen,
    onClose: onAboutClose,
  } = useDisclosure();

  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();
  const {
    isOpen: isWalletOpen,
    onOpen: onWalletOpen,
    onClose: onWalletClose,
  } = useDisclosure();

  const { onToggle } = useDisclosure();

  useEffect(() => {
    console.log("navigationSection - useEffect", navigationSection);
    if (navigationSection === "DefiKids") {
      onToggle;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigationSection]);

  //=============================================================================
  //                               STATE
  //=============================================================================

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================
  const handleWalletMenuToggle = () => onWalletOpen();

  return (
    <Box
      bgGradient={["linear(to-b, black,#4F1B7C)"]}
      position="fixed"
      top="0"
      left="0"
      width="100%"
      p={1}
      zIndex={5}
    >
      <Box px={!isMobileSize ? 5 : 2} zIndex={5}>
        <Navbar
          onFaqOpen={onFaqOpen}
          onAboutOpen={onAboutOpen}
          onRegisterOpen={onRegisterOpen}
          onWalletOpen={onWalletOpen}
        />
      </Box>

      <FaqModal isOpen={isFaqOpen} onClose={onFaqClose} />
      <AboutModal isOpen={isAboutOpen} onClose={onAboutClose} />
      <RegisterModal isOpen={isRegisterOpen} onClose={onRegisterClose} />
      <WalletModal isOpen={isWalletOpen} onClose={onWalletClose} />
    </Box>
  );
};
