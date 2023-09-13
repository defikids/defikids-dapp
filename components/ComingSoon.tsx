import { Box, Flex, Heading, Text, Image } from "@chakra-ui/react";

const ComingSoon = () => {
  const Logo = () => {
    return (
      <Flex align="center" ml={5} mt={5}>
        <Image src={"/pig_logo.png"} alt="Loader" width="50" height="50" />
        <Heading size="lg" ml={5}>
          Defikids
        </Heading>
      </Flex>
    );
  };

  return (
    <Box h="100vh">
      {Logo()}
      <Flex direction="column" align="center" justify="center" h="90vh">
        <Heading size={"lg"}>Coming Soon</Heading>
        <Text my={5} color="gray" fontSize="lg">
          We are working hard to bring you the best experience.
        </Text>
      </Flex>
    </Box>
  );
};

export default ComingSoon;
