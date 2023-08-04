import React from "react";
import {
  Box,
  Flex,
  Button,
  useDisclosure,
  useColorModeValue,
  useColorMode,
  Container,
  Heading,
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
import Head from "next/head";

type ConnectedUser = {
  success: boolean;
  userType?: number;
  accountAddress?: string;
};

export default function NavBar() {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

  const {
    isLoggedIn,
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

  const {
    isOpen: isCustomVaultOpen,
    onOpen: onCustomVaultOpen,
    onClose: onCustomVaultClose,
  } = useDisclosure();
  const {
    isOpen: isStrategyOpen,
    onOpen: onStrategyOpen,
    onClose: onStrategyClose,
  } = useDisclosure();

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

  return (
    <>
      <Box bg={useColorModeValue("grey.100", "black.900")} px={6} pt={6}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Flex align="center">
            <Image src={"/pig_logo.png"} alt="Loader" width="50" height="50" />
            <Heading size="lg" ml={5}>
              DefiKids
            </Heading>
          </Flex>
          <Flex justifyContent="flex-end">
            <Button leftIcon={<AiOutlineInfoCircle />}>About</Button>
            <Button leftIcon={<BsQuestionCircle />} mx={2}>
              FAQ
            </Button>
            <ConnectButton
              handleClick={handleConnectSequence}
              walletAddress={walletAddress}
            />
            {/* <Button mx={2} px={2} onClick={toggleColorMode}>
              {switchModeIcons()}
            </Button> */}
          </Flex>
        </Flex>
      </Box>
      {/* <RegisterVaultModal
        isOpen={isCustomVaultOpen}
        onClose={onCustomVaultClose}
        handleSubmit={handleSubmit}
      />
      <StrategyModal
        isOpen={isStrategyOpen}
        onClose={onStrategyClose}
        handleSubmit={handleSubmit}
      /> */}
    </>
  );
}
