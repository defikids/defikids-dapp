import React, { FC, PropsWithChildren, useState } from "react";
import Navbar from "./navbar";
import WalletMenuBar from "./WalletMenuBar";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import { useDisclosure, Box, useBreakpointValue } from "@chakra-ui/react";
import FaqModal from "./Modals/FaqModal";
import AboutModal from "./Modals/AboutModal";
import RegisterModal from "@/components/Modals/RegisterModal";

export const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const isMobileSize = useBreakpointValue({ base: true, sm: false, md: false });

  const { isLoggedIn } = useAuthStore(
    (state) => ({
      isLoggedIn: state.isLoggedIn,
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

  //=============================================================================
  //                               STATE
  //=============================================================================

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================

  const handleWalletMenuToggle = () => setIsMenuOpen(!isMenuOpen);

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
          handleWalletMenuToggle={handleWalletMenuToggle}
        />

        {isLoggedIn && isMenuOpen ? <WalletMenuBar /> : <></>}
      </Box>

      <Box maxW="1380px" mx="auto" flexGrow={1} px={4}>
        {children}
      </Box>

      <FaqModal isOpen={isFaqOpen} onClose={onFaqClose} />
      <AboutModal isOpen={isAboutOpen} onClose={onAboutClose} />
      <RegisterModal isOpen={isRegisterOpen} onClose={onRegisterClose} />
    </Box>
  );
};
