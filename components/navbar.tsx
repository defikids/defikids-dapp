import React from "react";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  Collapse,
} from "@chakra-ui/react";
import ConnectButton from "@/components/ConnectButton";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import Sequence from "@/services/sequence";
import { UserType } from "@/services/contract";
import { GiHamburgerMenu } from "react-icons/gi";
import { BiUserCircle, BiSolidLockOpen } from "react-icons/bi";
import { GrPowerShutdown } from "react-icons/gr";
import { VscArrowSwap } from "react-icons/vsc";
import { AiOutlinePoweroff } from "react-icons/ai";

type ConnectedUser = {
  success: boolean;
  userType?: number;
  accountAddress?: string;
};

export default function NavBar({
  onFaqOpen,
  onAboutOpen,
  onRegisterOpen,
  onWalletOpen,
}: {
  onFaqOpen: () => void;
  onAboutOpen: () => void;
  onRegisterOpen: () => void;
  onWalletOpen: () => void;
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
    walletAddress,
    navigationSection,
    setUserType,
    setIsLoggedIn,
    setWalletAddress,
  } = useAuthStore(
    (state) => ({
      isLoggedIn: state.isLoggedIn,
      walletAddress: state.walletAddress,
      navigationSection: state.navigationSection,
      setUserType: state.setUserType,
      setIsLoggedIn: state.setIsLoggedIn,
      setWalletAddress: state.setWalletAddress,
    }),
    shallow
  );

  //=============================================================================
  //                             FUNCTIONS
  //=============================================================================

  const handleConnectSequence = async () => {
    if (Sequence.wallet?.isConnected()) return;

    const { success, userType, accountAddress } = (await Sequence.connectWallet(
      true
    )) as ConnectedUser;

    if (!Boolean(isLoggedIn)) {
      router.push("/");
    }

    if (success) {
      setUserType(userType);
      setIsLoggedIn(true);
      setWalletAddress(accountAddress);
    }
  };

  const handleLogoutClick = () => {
    Sequence.wallet?.disconnect();

    //update user state
    setUserType(UserType.UNREGISTERED);
    setWalletAddress("");
    setIsLoggedIn(false);
    window.location.replace("/");
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
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          {/* DefiKids Logo */}
          <Flex align="center">
            {!isMobileSize && (
              <Image
                src={"/pig_logo.png"}
                alt="Loader"
                width="50"
                height="50"
              />
            )}

            <Heading size="lg" ml={isMobileSize ? 0 : 5}>
              Defikids
            </Heading>
          </Flex>

          <Flex justifyContent="flex-end">
            {/* Connect Button */}
            {!isLoggedIn && (
              <ConnectButton
                handleClick={handleConnectSequence}
                walletAddress={walletAddress}
              />
            )}

            {isLoggedIn && (
              <IconButton
                size="lg"
                aria-label="Wallet Icon"
                icon={
                  <Image
                    src={"/logos/Sequence-Icon.png"}
                    alt="Wallet Icon"
                    width="30"
                    height="25"
                  />
                }
                mx={4}
                onClick={onWalletOpen}
              />
            )}

            {/* Mobile Menu */}
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<GiHamburgerMenu />}
                variant="outline"
                size="lg"
              />

              <MenuList>
                {isLoggedIn && (
                  <>
                    <MenuGroup title="Profile">
                      <MenuItem>My Account</MenuItem>
                    </MenuGroup>
                    <MenuDivider />
                  </>
                )}
                <MenuGroup title="Help">
                  <MenuItem>Docs</MenuItem>
                  <MenuItem onClick={onAboutOpen}>About</MenuItem>
                  <MenuItem onClick={onFaqOpen}>FAQ</MenuItem>
                  <MenuItem onClick={onWalletOpen}>Wallet</MenuItem>
                </MenuGroup>
                {isLoggedIn && (
                  <>
                    {" "}
                    <MenuDivider />
                    <MenuItem onClick={handleLogoutClick}>Log Out</MenuItem>
                  </>
                )}
              </MenuList>
            </Menu>
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
