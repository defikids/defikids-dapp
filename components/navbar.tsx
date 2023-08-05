import React from "react";
import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  useColorMode,
  Container,
  Heading,
  IconButton,
  Text,
} from "@chakra-ui/react";
import ConnectButton from "@/components/ConnectButton";
import Image from "next/image";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import { BsQuestionCircle } from "react-icons/bs";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useRouter } from "next/router";
import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import Sequence from "@/services/sequence";
import { UserType } from "@/services/contract";

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
  const { colorMode, toggleColorMode } = useColorMode();

  const {
    isLoggedIn,
    userType,
    walletAddress,
    setUserType,
    setIsLoggedIn,
    setWalletAddress,
  } = useAuthStore(
    (state) => ({
      isLoggedIn: state.isLoggedIn,
      userType: state.userType,
      walletAddress: state.walletAddress,
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

  const switchModeIcons = () => {
    if (colorMode === "light") {
      return (
        <Container>
          <BsFillMoonFill />
        </Container>
      );
    } else {
      return (
        <Container>
          <BsFillSunFill />
        </Container>
      );
    }
  };

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

  const trimAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  return (
    <Box>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <Flex align="center">
          <Image src={"/pig_logo.png"} alt="Loader" width="50" height="50" />
          <Heading size="lg" ml={5}>
            DefiKids
          </Heading>
        </Flex>
        <Flex justifyContent="flex-end">
          {/* About Button */}
          <Button onClick={onAboutOpen} leftIcon={<AiOutlineInfoCircle />}>
            About
          </Button>

          {/* FAQ Button */}
          <Button onClick={onFaqOpen} leftIcon={<BsQuestionCircle />} mx={2}>
            FAQ
          </Button>

          {/* Register Button */}
          {isLoggedIn && userType === UserType.UNREGISTERED && (
            <Button onClick={onRegisterOpen} mr={6}>
              Register
            </Button>
          )}

          {/* Connect Button */}
          {!isLoggedIn ? (
            <ConnectButton
              handleClick={handleConnectSequence}
              walletAddress={walletAddress}
            />
          ) : (
            <Flex alignItems="center">
              <Text size="sm">{trimAddress(walletAddress)}</Text>
            </Flex>
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
              ml={4}
              onClick={handleWalletMenuToggle}
            />
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
