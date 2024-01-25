"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  useBreakpointValue,
  Collapse,
  Button,
  useDisclosure,
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
import { getSignerAddress, isWalletConnected } from "@/blockchain/utils";
import { getUserByWalletAddress } from "@/services/mongo/routes/user";
import { User } from "@/data-schema/types";

export default function LandingNavbar() {
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

  const { navigationSection } = useAuthStore(
    (state) => ({
      navigationSection: state.navigationSection,
    }),
    shallow
  );

  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  useEffect(() => {
    const init = async () => {
      const isConnected = await isWalletConnected();
      const user = await getUserByWalletAddress(await getSignerAddress());

      if (user.error) {
        onRegisterOpen();
        return;
      }
      setIsConnected(isConnected);
      setUser(user);
    };
    init();
  }, []);

  //=============================================================================
  //                             STATE
  //=============================================================================
  const [menuOpen, setMenuOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState({} as User);

  const iconToShow = menuOpen ? (
    <IoMdClose size={30} />
  ) : (
    <AiFillAppstore size={30} />
  );

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================

  const navigateUser = () => {
    switch (user.userType) {
      case UserType.UNREGISTERED:
        onRegisterOpen();
        break;
      case UserType.PARENT:
        router.push(`/parent-dashboard/${user.wallet}`);
        break;
      case UserType.MEMBER:
        router.push(`/member-dashboard/${user.wallet}`);
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
            {!isConnected ? (
              <CustomConnectButton />
            ) : (
              <Button mr={5} size="lg" onClick={navigateUser}>
                <Heading size="sm">Dashboard</Heading>
              </Button>
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
