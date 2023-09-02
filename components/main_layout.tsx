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
}: {
  showStartEarning: boolean;
  isRegisterOpen: boolean;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigationSection]);

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================

  // const showNavbar = () => {
  //   if (router.pathname === "/") {
  //     return true;
  //   }

  //   if (isMobileSize) {
  //     return true;
  //   }
  // };

  return (
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
        {!isLoggedIn ? (
          <Navbar
            showStartEarning={showStartEarning}
            isRegisterOpen={isRegisterOpen}
          />
        ) : (
          <LoggedInNavBar />
        )}
      </Box>
    </Box>
  );
};
