import { useAuthStore } from "@/store/auth/authStore";
import { shallow } from "zustand/shallow";
import Sequence from "@/services/sequence";
import { Flex, Stack, Text, Heading, useToast } from "@chakra-ui/react";
import { BiSolidCopy } from "react-icons/bi";
import { BsBoxArrowUpRight } from "react-icons/bs";

export const WalletDetails: React.FC = () => {
  //=============================================================================
  //                               HOOKS
  //=============================================================================

  const toast = useToast();

  const { walletAddress } = useAuthStore(
    (state) => ({
      walletAddress: state.walletAddress,
    }),
    shallow
  );

  //=============================================================================
  //                               FUNCTIONS
  //=============================================================================

  const trimAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  const blockchainNameByChainId = (chainId: number) => {
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

  return (
    <Stack direction="column" justifyContent="center" py={2} w="100%">
      {/* WalletAddress */}
      <Heading size="xs" textAlign="left" mr={2} color="#82add9">
        Wallet Address
      </Heading>

      <Flex direction="row" justify="center" align="center">
        <Text color="black" align="center" fontSize="xl">
          {trimAddress(walletAddress)}
        </Text>
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

      {/* ChaninId */}
      <Heading size="xs" textAlign="left" color="#82add9" mr={2} mt={2}>
        Blockchain
      </Heading>
      <Flex direction="row" justify="center" align="center">
        <Text fontSize="xl" color="black" align="center">
          {blockchainNameByChainId(Sequence.wallet.getChainId())}
        </Text>
        <BsBoxArrowUpRight
          size={10}
          color="black"
          style={{
            marginBottom: "0.5rem",
            marginLeft: "1rem",
            cursor: "pointer",
          }}
          onClick={() => window.open(getBlockchainUrl(), "_blank")}
        />
      </Flex>
    </Stack>
  );
};
