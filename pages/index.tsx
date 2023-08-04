import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export default function Main() {
  return (
    <Flex
      direction="column"
      align="center"
      // justify="center"
      height="80vh"
      width="100vw"
      px={20}
      py={10}
    >
      <Box
        style={{
          color: "#7B3FE4",
          backgroundColor: "black",
        }}
      >
        <Heading size="2xl">
          Earn, save, stake and invest your allowance.
        </Heading>
      </Box>
      <Text fontSize="2xl" fontWeight="bold">
        A save and secure platform that allows kids to learn about crypto.
      </Text>
    </Flex>
  );
}
