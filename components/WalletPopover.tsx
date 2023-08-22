import { useAuthStore } from "@/store/auth/authStore";
import {
  Box,
  Button,
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
import { HOST_ADDRESS } from "@/store/contract/contractStore";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const WalletPopover = () => {
  //=============================================================================
  //                               HOOKS
  //=============================================================================

  const toast = useToast();
  const { chain } = useNetwork();

  const { walletAddress, setLogout } = useAuthStore(
    (state) => ({
      walletAddress: state.walletAddress,
      setLogout: state.setLogout,
    }),
    shallow
  );

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  const blockchainNameByChainId = () => {
    switch (chain.id) {
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
    if (chain.id === 137) return "https://polygonscan.com/";
    if (chain.id === 80001) return "https://mumbai.polygonscan.com/";
    if (chain.id === 1) return "https://etherscan.io/";
    if (chain.id === 5) return "https://goerli.etherscan.io/";
  };

  const openWalletOnBlockchain = () => {
    if (chain.id === 137) {
      window.open(
        ` https://polygonscan.com/address//${walletAddress}`,
        "_blank"
      );
      return;
    }
    if (chain.id === 80001) {
      window.open(
        ` https://mumbai.polygonscan.com/address/${walletAddress}`,
        "_blank"
      );
    }
    if (chain.id === 1) {
      window.open(` https://etherscan.io/address/${walletAddress}`, "_blank");
      return;
    }
    if (chain.id === 5) {
      window.open(
        ` https://goerli.etherscan.io/address/${walletAddress}`,
        "_blank"
      );
      return;
    }
  };

  const walletIcon = () => {
    const connectWalletType = localStorage.getItem("wagmi.wallet");
    if (connectWalletType === `"metaMask"`) {
      return "/logos/metamask-logo.png";
    }

    return "/logos/Sequence-Icon.png";
  };

  const chainIcon = () => {
    if (chain.id === 137 || chain.id === 80001) {
      return "/logos/polygon-logo.png";
    }
    return "/logos/ethereum-logo.png";
  };

  return (
    <Popover placement="bottom" closeOnBlur={true}>
      <PopoverTrigger>
        <IconButton
          size="lg"
          aria-label="Wallet Icon"
          icon={
            <Image
              src={walletIcon()}
              alt="Wallet Icon"
              width="30"
              height="25"
            />
          }
          mx={4}
        />
      </PopoverTrigger>
      <PopoverContent color="black" bg="#4F1B7C">
        <PopoverBody mt={2} mx={2}>
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              // Note: If your app doesn't use authentication, you
              // can remove all 'authenticationStatus' checks
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");
              return (
                <Box
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    return (
                      <Box>
                        <Button
                          onClick={openChainModal}
                          mb={5}
                          w="100%"
                          style={{ display: "flex", alignItems: "center" }}
                          type="button"
                        >
                          {chain.hasIcon && (
                            <Box
                              style={{
                                background: chain.iconBackground,
                                width: 12,
                                height: 12,
                                borderRadius: 999,
                                overflow: "hidden",
                                marginRight: 4,
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? "Chain icon"}
                                  src={chain.iconUrl}
                                  style={{ width: 12, height: 12 }}
                                />
                              )}
                            </Box>
                          )}
                          {chain.name}
                        </Button>

                        <Button
                          onClick={openAccountModal}
                          type="button"
                          w="100%"
                          mb={5}
                        >
                          {account.displayName}
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ""}
                        </Button>
                      </Box>
                    );
                  })()}
                </Box>
              );
            }}
          </ConnectButton.Custom>
        </PopoverBody>

        <PopoverArrow bg="white" />

        <PopoverFooter
          border="0"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pb={4}
        >
          <Flex alignItems="center">
            <Icon
              as={Image}
              src={chainIcon()}
              alt="Wallet Icon"
              width="30"
              height="25"
              mr={2}
            />
            <Heading fontSize="md" color="white">
              Core Contract
            </Heading>
          </Flex>
          <Button
            size="sm"
            colorScheme="messenger"
            onClick={() =>
              window.open(
                `${getBlockchainUrl()}/address/${HOST_ADDRESS}`,
                "_blank"
              )
            }
          >
            <Heading size="xs">View</Heading>
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};
