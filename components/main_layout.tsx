/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from "react";
import Navbar from "./navbar";
import LoggedInNavBar from "./LoggedInNavbar";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import { useDisclosure, Box, useBreakpointValue } from "@chakra-ui/react";
import { useRouter } from "next/router";

export const MainLayout = ({
  showStartEarning,
  isRegisterOpen,
  onRegisterOpen,
}: {
  showStartEarning: boolean;
  isRegisterOpen: boolean;
  onRegisterOpen: () => void;
}) => {
  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });

  const { navigationSection, isLoggedIn } = useAuthStore(
    (state) => ({
      navigationSection: state.navigationSection,
      isLoggedIn: state.isLoggedIn,
    }),
    shallow
  );

  const { onToggle } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    if (navigationSection === "DefiKids") {
      onToggle;
    }
  }, [navigationSection]);

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================

  const hide = () => {
    if (router.pathname.startsWith("/member-invite")) return true;
    if (router.pathname.startsWith("/confirm-email")) return true;
    return false;
  };

  return hide() ? (
    <></>
  ) : (
    <Box
      bgGradient={["linear(to-b, black,#4F1B7C)"]}
      position="fixed"
      top="0"
      left="0"
      width="100%"
      p={router.pathname === "/parent" ? 0 : 5}
      zIndex={5}
    >
      <Box px={!isMobileSize ? 5 : 2} zIndex={5}>
        {!isLoggedIn ? <Navbar /> : <LoggedInNavBar />}
      </Box>
    </Box>
  );
};
