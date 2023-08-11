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
import Sequence from "@/services/sequence";
import { OpenWalletIntent, Settings } from "@0xsequence/provider";
import { UserType } from "@/services/contract";
import { BiSolidCopy } from "react-icons/bi";

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

  const trimAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  const blockchainNameByChainId = () => {
    const chainId = Sequence.wallet?.getChainId();
    switch (chainId) {
      case 137:
        return "Polygon";
      case 80001:
        return "Polygon Mumbai";
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
    const network = Sequence.wallet?.getChainId();
    console.log("network", network);
    const session = Sequence.wallet?.getSession();
    const url = session.networks.find((n) => n.chainId === network)
      ?.blockExplorer.rootUrl;

    return url;
  };

  const openWalletWithSettings = () => {
    const wallet = Sequence.wallet;

    const settings: Settings = {
      theme: "light",
      includedPaymentProviders: ["moonpay", "ramp", "wyre"],
      defaultFundingCurrency: "eth",
      signInOptions: [
        "email",
        "google",
        "apple",
        "discord",
        "facebook",
        "twitch",
      ],
    };

    const intent: OpenWalletIntent = {
      type: "openWithOptions",
      options: {
        app: "DefiKids",
        settings,
      },
    };

    const path = "wallet";
    wallet.openWallet(path, intent);
  };

  const handleLogoutClick = () => {
    Sequence.wallet?.disconnect();

    //update user state
    setUserType(UserType.UNREGISTERED);
    setWalletAddress("");
    setIsLoggedIn(false);
    window.location.replace("/");
  };

  const openWalletOnBlockchain = () => {
    const chain = Sequence.wallet.getChainId();
    if (chain === 137) {
      window.open(
        ` https://polygonscan.com/address//${walletAddress}`,
        "_blank"
      );
    } else if (chain === 80001) {
      window.open(
        ` https://mumbai.polygonscan.com/address/${walletAddress}`,
        "_blank"
      );
    }
  };

  return (
    <Popover placement="bottom" closeOnBlur={false}>
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
        {/* <PopoverCloseButton /> */}
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
              onClick={openWalletWithSettings}
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
