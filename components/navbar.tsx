import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  useBreakpointValue,
  Collapse,
  Button,
} from "@chakra-ui/react";
import { CustomConnectButton } from "@/components/ConnectButton";
import { useRouter } from "next/router";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import { WalletPopover } from "@/components/WalletPopover";
import { MenuPopover } from "@/components/MenuPopover";
import { AiFillAppstore } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { UserType } from "@/dataSchema/enums";
import { BiSolidUserRectangle } from "react-icons/bi";
import DefiKidsLogo from "@/components/logos/DefiKidsLogo";
import { useAccount } from "wagmi";
import { BiLogOut } from "react-icons/bi";

export default function NavBar({
  showStartEarning,
  isRegisterOpen,
  onRegisterOpen,
}: {
  showStartEarning: boolean;
  isRegisterOpen: boolean;
  onRegisterOpen: () => void;
}) {
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
    isLoggedIn,
    walletConnected,
    navigationSection,
    userDetails,
    setIsLoggedIn,
    setLogout,
  } = useAuthStore(
    (state) => ({
      isLoggedIn: state.isLoggedIn,
      walletConnected: state.walletConnected,
      navigationSection: state.navigationSection,
      userDetails: state.userDetails,
      setIsLoggedIn: state.setIsLoggedIn,
      setLogout: state.setLogout,
    }),
    shallow
  );

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
        router.push("/parent");
        break;
      case UserType.CHILD:
        setIsLoggedIn(true);
        router.push("/child");
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
        // top={`${isLoggedIn ? 8 : 0}`}
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
            ) : (
              <Button mr={5} size="lg" onClick={navigateUser}>
                <Heading size="md">Enter</Heading>
              </Button>
            )}

            {/* {userDetails?.userType === UserType.PARENT &&
              router.pathname !== "/parent" && (
                <IconButton
                  size="lg"
                  aria-label="Parent Icon"
                  icon={<BiSolidUserRectangle size={30} />}
                  onClick={() => router.push("/parent")}
                />
              )} */}

            {/* Wallet Menu */}
            {/* {isLoggedIn && <WalletPopover />} */}

            {/* Main Menu */}
            {isLoggedIn && (
              <IconButton
                size="lg"
                aria-label="Menu Icon"
                icon={<BiLogOut size={30} />}
                onClick={setLogout}
                mr={5}
                pr={2}
              />
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
      </Box>
    </>
  );
}
