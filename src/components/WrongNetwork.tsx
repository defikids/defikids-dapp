import { Center, Flex, Heading } from "@chakra-ui/react";
import { CustomConnectButton } from "@/components/ConnectButton";

export const WrongNetwork = () => {
  return (
    <Center h="100vh" w="100vw">
      <Flex justifyContent="center" direction="column">
        <Heading textAlign="center">Change network</Heading>
        <Center mt={5}>
          <CustomConnectButton />
        </Center>
      </Flex>
    </Center>
  );
};
