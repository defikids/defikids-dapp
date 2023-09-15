"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from "react";
import Navbar from "./Navbar";
import LoggedInNavBar from "./LoggedInNavbar";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import { useDisclosure, Box, useBreakpointValue } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

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

  const { navigationSection, isLoggedIn } = useAuthStore(
    (state) => ({
      navigationSection: state.navigationSection,
      isLoggedIn: state.isLoggedIn,
    }),
    shallow
  );

  const { onToggle } = useDisclosure();
  const pathname = usePathname();

  useEffect(() => {
    if (navigationSection === "DefiKids") {
      onToggle;
    }
  }, [navigationSection]);

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================

  const hide = () => {
    if (pathname?.startsWith("/member-invite")) return true;
    if (pathname?.startsWith("/confirm-email")) return true;
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
      p={pathname === "/parent-dashboard" ? 0 : 5}
      zIndex={5}
    >
      <Box px={!isMobileSize ? 5 : 2} zIndex={5}>
        {!isLoggedIn ? <Navbar /> : <LoggedInNavBar />}
      </Box>
    </Box>
  );
};
