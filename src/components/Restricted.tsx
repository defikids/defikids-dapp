import { Text, Flex, Heading } from "@chakra-ui/react";

export const Restricted = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justify="center"
      w="100vw"
      h="100vh"
    >
      <Heading fontSize={"6xl"}>Restricted</Heading>
      <Text fontSize={"2xl"}>Parent Access Only</Text>
    </Flex>
  );
};
