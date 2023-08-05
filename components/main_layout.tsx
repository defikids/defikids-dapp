import React, { FC, PropsWithChildren } from "react";
import Navbar from "./navbar";
import WalletMenuBar from "./WalletMenuBar";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import Footer from "./footer";
import { useDisclosure, Flex, Box, Stack } from "@chakra-ui/react";
import FaqModal from "./Modals/FaqModal";
import AboutModal from "./Modals/AboutModal";
import RegisterModal from "@/components/Modals/RegisterModal";

import { Section } from "@/components/section";

export const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  //=============================================================================
  //                               HOOKS
  //=============================================================================
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

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================

  const handleWalletMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  // #4ECAFF
  // #7A49FF
  // #161D2B
  // #3D5CFD

  // #12c2e9
  // #1D2671
  // 82ADD9

  // blue-waves-wallpaper

  return (
    <Box
      // bgGradient="linear(to-r, #4F1B7C, #2a0845)"
      bgGradient={[
        // "linear(to-tr, #4F1B7C, #2a0845)",
        // "linear(to-t, #1A202C, #282C34)",
        "linear(to-b, #4F1B7C, black)",
      ]}
      px={5}
      py={1}
      position="fixed" // Position the footer at the bottom
      w="100%"
    >
      <Box
        h="82px"
        // position="fixed" // Position the footer at the bottom
      >
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

      {/* <Footer /> */}
    </Box>
  );
};
