import { Text, Flex, Heading } from "@chakra-ui/react";

export default function Page() {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justify="center"
      w="100vw"
      h="100vh"
    >
      <Heading fontSize={"6xl"}>404</Heading>
      <Text fontSize={"2xl"}>Page not found</Text>
    </Flex>
  );
}
