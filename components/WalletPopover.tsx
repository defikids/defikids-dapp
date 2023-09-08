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
  Heading,
  Text,
  Divider,
} from "@chakra-ui/react";
import { HOST_ADDRESS } from "@/store/contract/contractStore";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNetwork } from "wagmi";
import { getEtherscanUrl } from "@/utils/web3";
import { EtherscanContext } from "@/dataSchema/enums";

export const WalletPopover = () => {
  //=============================================================================
  //                               HOOKS
  //=============================================================================

  const { chain } = useNetwork();

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  const walletIcon = () => {
    const connectWalletType = localStorage.getItem("wagmi.wallet");
    if (connectWalletType === `"metaMask"`) {
      return "/logos/metamask-logo.png";
    }

    return "/logos/Sequence-Icon.png";
  };

  const chainIcon = () => {
    if (chain.id === null) return;

    if (chain.id === 137 || chain.id === 80001) {
      return "/logos/polygon-logo.png";
    }
    return "/logos/ethereum-logo.png";
  };

  return chain?.id ? (
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
      <PopoverContent
        color="black"
        // bg="white"
        style={{
          // opacity white background.
          opacity: 0.9,
          background: "white",
        }}
      >
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
                          colorScheme="blue"
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
                                // eslint-disable-next-line @next/next/no-img-element
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
                          mb={2}
                          colorScheme="blue"
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
          alignItems="center"
          justifyContent="space-between"
          pb={4}
        >
          <Text fontSize="sm" color="black">
            Contracts
          </Text>

          <Divider my={2} />

          <Flex alignItems="center" justify="space-between">
            <Heading fontSize="md" color="black">
              Core Contract
            </Heading>
            <Button
              size="sm"
              colorScheme="messenger"
              onClick={() =>
                window.open(
                  getEtherscanUrl(
                    chain.id,
                    EtherscanContext.ADDRESS,
                    HOST_ADDRESS
                  ),
                  "_blank"
                )
              }
            >
              <Heading size="xs">View</Heading>
            </Button>
          </Flex>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  ) : (
    <></>
  );
};
