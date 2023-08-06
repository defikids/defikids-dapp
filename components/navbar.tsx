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
} from "@chakra-ui/react";
import ConnectButton from "@/components/ConnectButton";
import Image from "next/image";
import { BsQuestionCircle } from "react-icons/bs";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useRouter } from "next/router";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import Sequence from "@/services/sequence";
import { UserType } from "@/services/contract";
import { GiHamburgerMenu } from "react-icons/gi";

type ConnectedUser = {
  success: boolean;
  userType?: number;
  accountAddress?: string;
};

export default function NavBar({
  onFaqOpen,
  onAboutOpen,
  onRegisterOpen,
  handleWalletMenuToggle,
}: {
  onFaqOpen: () => void;
  onAboutOpen: () => void;
  onRegisterOpen: () => void;
  handleWalletMenuToggle: () => void;
}) {
  //=============================================================================
  //                               HOOKS
  //============================================================================
  const router = useRouter();
  const isMobileSize = useBreakpointValue({ base: true, sm: false, md: false });

  const {
    isLoggedIn,
    userType,
    walletAddress,
    navigationSection,
    setUserType,
    setIsLoggedIn,
    setWalletAddress,
  } = useAuthStore(
    (state) => ({
      isLoggedIn: state.isLoggedIn,
      userType: state.userType,
      walletAddress: state.walletAddress,
      navigationSection: state.navigationSection,

      setUserType: state.setUserType,
      setIsLoggedIn: state.setIsLoggedIn,
      setWalletAddress: state.setWalletAddress,
    }),
    shallow
  );

  //=============================================================================
  //                               STATE
  //=============================================================================

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
    <Box zIndex={5}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Flex align="center">
          {!isMobileSize && (
            <Image src={"/pig_logo.png"} alt="Loader" width="50" height="50" />
          )}

          {/* Navigation Section */}
          <Heading size="lg" ml={isMobileSize ? 0 : 5}>
            {navigationSection}
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

          {/* Wallet Icon */}
          {isLoggedIn && (
            <IconButton
              as="a"
              href="#"
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
              onClick={handleWalletMenuToggle}
            />
          )}

          {/* Mobile Menu */}
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<GiHamburgerMenu />}
              variant="outline"
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
    </Box>
  );
}
