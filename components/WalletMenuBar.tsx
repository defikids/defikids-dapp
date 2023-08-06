import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import Sequence from "@/services/sequence";
import { UserType } from "@/services/contract";
import { OpenWalletIntent, Settings } from "@0xsequence/provider";
import {
  Badge,
  Flex,
  Stack,
  useColorMode,
  Text,
  Heading,
  useBreakpointValue,
  Button,
  useToast,
  Tooltip,
} from "@chakra-ui/react";

const animatedBorderBottom = {
  position: "relative",
  _before: {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "0",
    height: "1px",
    backgroundColor: "#FF0080",
    transition: "width 0.3s ease-in-out",
  },
  "&:hover:before": {
    width: "90%",
  },
};

const WalletNavbar: React.FC = () => {
  //=============================================================================
  //                               HOOKS
  //=============================================================================
  const { colorMode } = useColorMode();
  const isMobileSize = useBreakpointValue({ base: true, sm: false, md: false });
  const toast = useToast();

  const { walletAddress, setIsLoggedIn, setUserType, setWalletAddress } =
    useAuthStore(
      (state) => ({
        walletAddress: state.walletAddress,
        isLoggedIn: state.isLoggedIn,
        setIsLoggedIn: state.setIsLoggedIn,
        setUserType: state.setUserType,
        setWalletAddress: state.setWalletAddress,
      }),
      shallow
    );

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================
  const openWalletWithSettings = () => {
    const wallet = Sequence.wallet;

    const settings: Settings = {
      theme: colorMode,
      includedPaymentProviders: ["moonpay", "ramp", "wyre"],
      defaultFundingCurrency: "eth",
      signInOptions: ["email", "google", "apple", "discord", "facebook"],
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

  const handleSelectOption = (option: string) => {
    if (option === "Open Wallet" && Sequence.wallet?.isConnected) {
      openWalletWithSettings();
      return;
    }
    handleLogoutClick();
  };

  const trimAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  const blockchainNameByChainId = (chainId: number) => {
    switch (chainId) {
      case 137:
        return "Polygon";
      case 80001:
        return "Mumbai";
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

  return (
    <Stack
      direction={isMobileSize ? "column" : "row"}
      justifyContent={isMobileSize ? "flex-start" : "space-between"}
      py={2}
    >
      {/* WalletAddress */}
      <Flex alignItems="center" direction="row" mr={6}>
        <Heading
          size="sm"
          textAlign="center"
          mr={2}
          bgGradient="linear(to-l, white, #82add9)"
          bgClip="text"
        >
          Wallet Address
        </Heading>
        <Tooltip label="Copy address" fontSize="sm">
          <Text
            size="sm"
            cursor="pointer"
            onClick={() => copyAddressToClipboard(walletAddress)}
          >
            {trimAddress(walletAddress)}
          </Text>
        </Tooltip>
      </Flex>

      {/* ChaninId */}
      <Flex alignItems="center" direction="row" mr={6}>
        <Heading
          size="sm"
          textAlign="center"
          mr={2}
          bgGradient="linear(to-l, white, #82add9)"
          bgClip="text"
        >
          Blockchain
        </Heading>
        <Text size="sm">
          {blockchainNameByChainId(Sequence.wallet.getChainId())}
        </Text>
      </Flex>

      {/* Open Wallet Button */}
      <Flex
        alignItems="center"
        direction="row"
        mr={6}
        pt={isMobileSize ? 5 : 0}
        pb={isMobileSize ? 2 : 0}
        justify={isMobileSize ? "center" : "flex-start"}
      >
        <Heading
          size="xs"
          textAlign="center"
          bgGradient="linear(to-l, white, #82add9)"
          bgClip="text"
          cursor="pointer"
          onClick={() => handleSelectOption("Open Wallet")}
          sx={{
            ...animatedBorderBottom,
          }}
        >
          Open Wallet
        </Heading>
      </Flex>
    </Stack>
  );
};

export default WalletNavbar;
