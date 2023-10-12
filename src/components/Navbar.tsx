"use client";

import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  useBreakpointValue,
  Collapse,
  Button,
  useDisclosure,
  Fade,
} from "@chakra-ui/react";
import { CustomConnectButton } from "@/components/ConnectButton";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import { MenuPopover } from "@/components/MenuPopover";
import { AiFillAppstore } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { UserType } from "@/data-schema/enums";
import DefiKidsLogo from "@/components/logos/DefiKidsLogo";
import RegisterModal from "@/components/modals/RegisterModal";

export default function NavBar() {
  //=============================================================================
  //                               HOOKS
  //============================================================================
  const router = useRouter();

  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });

  const {
    walletConnected,
    navigationSection,
    userDetails,
    fetchedUserDetails,
    setIsLoggedIn,
  } = useAuthStore(
    (state) => ({
      walletConnected: state.walletConnected,
      navigationSection: state.navigationSection,
      userDetails: state.userDetails,
      fetchedUserDetails: state.fetchedUserDetails,
      setIsLoggedIn: state.setIsLoggedIn,
    }),
    shallow
  );

  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  //=============================================================================
  //                             STATE
  //=============================================================================
  const [menuOpen, setMenuOpen] = useState(false);
  const iconToShow = menuOpen ? (
    <IoMdClose size={30} />
  ) : (
    <AiFillAppstore size={30} />
  );

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================

  const navigateUser = () => {
    switch (userDetails?.userType) {
      case UserType.UNREGISTERED:
        setIsLoggedIn(false);
        onRegisterOpen();
        break;
      case UserType.PARENT:
        setIsLoggedIn(true);
        router.push("/parent-dashboard");
        break;
      case UserType.MEMBER:
        setIsLoggedIn(true);
        router.push("/member-dashboard");
        break;
      default:
        router.push("/");
        return;
    }
  };

  return (
    <>
      <Box
        zIndex={5}
        bgGradient={["linear(to-b, black,#4F1B7C)"]}
        position="fixed"
        top={0}
        left={0}
        right={0}
        p={!isMobileSize ? 5 : 2}
        id="main-navbar"
      >
        <Flex
          h={16}
          alignItems={"center"}
          justifyContent={"space-between"}
          mx={2}
        >
          <DefiKidsLogo />

          <Flex justifyContent="flex-end">
            {!walletConnected ? (
              <CustomConnectButton />
            ) : fetchedUserDetails ? (
              <Button mr={5} size="lg" onClick={navigateUser}>
                <Fade in={fetchedUserDetails}>
                  <Heading size="sm">
                    {userDetails?.userType != UserType.UNREGISTERED
                      ? "Dashboard"
                      : "Register"}
                  </Heading>
                </Fade>
              </Button>
            ) : (
              <></>
            )}

            <IconButton
              size="lg"
              aria-label="Menu Icon"
              icon={iconToShow}
              onClick={() => setMenuOpen(!menuOpen)}
            />
            <MenuPopover menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          </Flex>
        </Flex>

        {/* Titles */}
        <Collapse in={navigationSection !== "DefiKids"} animateOpacity>
          <Box zIndex={5} w="100%">
            <Flex direction="column" align="center" justify="center">
              <Heading size="2xl" color="#82add9">
                {navigationSection === "DefiKids" ? "" : navigationSection}
              </Heading>
            </Flex>
          </Box>
        </Collapse>

        {/* Modals */}
        <RegisterModal isOpen={isRegisterOpen} onClose={onRegisterClose} />
      </Box>
    </>
  );
}
