import { Flex, Heading } from "@chakra-ui/react";
import { CustomConnectButton } from "@/components/ConnectButton";

export const WalletNotFound = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justify="center"
      w="100vw"
      h="100vh"
    >
      <Heading fontSize={"6xl"} mb={5}>
        Wallet Not Found
      </Heading>
      <CustomConnectButton />
    </Flex>
  );
};
