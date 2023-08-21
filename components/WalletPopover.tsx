import { useAuthStore } from "@/store/auth/authStore";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Image,
  Flex,
  Icon,
  useToast,
  Heading,
} from "@chakra-ui/react";
import shallow from "zustand/shallow";
import Web3auth from "@/services/web3auth";
import { OpenWalletIntent, Settings } from "@0xsequence/provider";
import { UserType } from "@/services/contract";
import { BiSolidCopy } from "react-icons/bi";
import { trimAddress } from "@/lib/web3";

export const WalletPopover = () => {
  //=============================================================================
  //                               HOOKS
  //=============================================================================

  const toast = useToast();

  const { walletAddress, setUserType, setWalletAddress, setIsLoggedIn } =
    useAuthStore(
      (state) => ({
        walletAddress: state.walletAddress,
        setUserType: state.setUserType,
        setWalletAddress: state.setWalletAddress,
        setIsLoggedIn: state.setIsLoggedIn,
      }),
      shallow
    );

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  const blockchainNameByChainId = () => {
    const chainId = 5 as number;
    switch (chainId) {
      case 137:
        return "Polygon";
      case 80001:
        return "Polygon Mumbai Testnet";
      case 1:
        return "Ethereum";
      case 5:
        return "Goerli Testnet";
      default:
        return "Unknown";
    }
  };

  const copyAddressToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Copied to clipboard",
      status: "success",
    });
  };

  const getBlockchainUrl = () => {
    // const network = Sequence.wallet?.getChainId();
    // const session = Sequence.wallet?.getSession();
    // const url = session.networks.find((n) => n.chainId === network)
    //   ?.blockExplorer.rootUrl;

    // return url;
    // return goerli
    return "https://goerli.etherscan.io/";
  };

  const handleLogoutClick = () => {
    Web3auth.logout();

    //update user state
    setUserType(UserType.UNREGISTERED);
    setWalletAddress("");
    setIsLoggedIn(false);
    localStorage.removeItem("defi-kids.family-id");
    window.location.replace("/");
  };

  const openWalletOnBlockchain = () => {
    // const chain = web3auth.getChainId();
    const chain = 5 as number;
    if (chain === 137) {
      window.open(
        ` https://polygonscan.com/address//${walletAddress}`,
        "_blank"
      );
      return;
    }
    if (chain === 80001) {
      window.open(
        ` https://mumbai.polygonscan.com/address/${walletAddress}`,
        "_blank"
      );
    }
    if (chain === 1) {
      window.open(` https://etherscan.io/address/${walletAddress}`, "_blank");
      return;
    }
    if (chain === 5) {
      window.open(
        ` https://goerli.etherscan.io/address/${walletAddress}`,
        "_blank"
      );
      return;
    }
  };

  return (
    <Popover placement="bottom" closeOnBlur={true}>
      <PopoverTrigger>
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
        />
      </PopoverTrigger>
      <PopoverContent color="black" bg="white" borderColor="blue.800">
        <PopoverBody mt={2} mx={2}>
          <Flex direction="row" justify="space-between" align="center">
            {trimAddress(walletAddress)}
            <BiSolidCopy
              size={15}
              color="black"
              style={{
                marginBottom: "0.5rem",
                marginLeft: "1.5rem",
                cursor: "pointer",
              }}
              onClick={() => copyAddressToClipboard(walletAddress)}
            />
          </Flex>
        </PopoverBody>

        <PopoverArrow bg="white" />

        <PopoverFooter
          border="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
          pb={4}
        >
          <ButtonGroup size="sm" variant="solid">
            <Button
              size="sm"
              colorScheme="messenger"
              // onClick={openWalletWithSettings}
            >
              <Heading size="xs">Open</Heading>
            </Button>

            <Button
              size="sm"
              colorScheme="messenger"
              onClick={openWalletOnBlockchain}
            >
              <Heading size="xs">History</Heading>
            </Button>
            <Button
              size="sm"
              colorScheme="messenger"
              onClick={handleLogoutClick}
            >
              <Heading size="xs">Disconnect</Heading>
            </Button>
          </ButtonGroup>
        </PopoverFooter>

        <PopoverFooter
          border="0"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pb={4}
        >
          <Flex>
            <Icon
              as={Image}
              src={"/logos/polygon-logo.png"}
              alt="Wallet Icon"
              width="30"
              height="25"
              mr={2}
            />
            <Box fontSize="sm">{blockchainNameByChainId()}</Box>
          </Flex>
          <Button
            size="sm"
            colorScheme="messenger"
            onClick={() => window.open(getBlockchainUrl(), "_blank")}
          >
            <Heading size="xs">View</Heading>
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};
