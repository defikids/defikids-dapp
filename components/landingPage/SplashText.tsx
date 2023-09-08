import { Box, Flex, Heading, Text, useBreakpointValue } from "@chakra-ui/react";

const SplashText = () => {
  const isMobileSize = useBreakpointValue({
    base: true,
    sm: false,
    md: false,
    lg: false,
  });

  return (
    <Flex
      as="section"
      id="DefiKids"
      direction="column"
      align="center"
      height="100vh"
      bgImage="url('/images/Chains_Wallpaper.jpeg')"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
      style={{
        boxShadow: "inset 0 0 0 1000px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box
        mt={isMobileSize ? "12rem" : "20rem"}
        style={{
          color: "#82add9",
        }}
      >
        <Heading size={isMobileSize ? "3xl" : "4xl"} textAlign="center" pb={3}>
          Earn, save,
        </Heading>
        <Heading size={isMobileSize ? "3xl" : "4xl"} textAlign="center" pb={3}>
          stake and invest
        </Heading>
        <Flex
          align="center"
          justify="center"
          direction={isMobileSize ? "column" : "row"}
        >
          <Heading
            size={isMobileSize ? "3xl" : "4xl"}
            textAlign="center"
            pb={3}
            pr={6}
          >
            your
          </Heading>
          <Heading
            size={isMobileSize ? "3xl" : "4xl"}
            textAlign="center"
            pb={3}
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            bgClip="text"
          >
            allowance
          </Heading>
        </Flex>
      </Box>
      <Text fontSize={isMobileSize ? "xl" : "2xl"} fontWeight="bold" mt={5}>
        A safe and secure platform
      </Text>
      <Text fontSize={isMobileSize ? "xl" : "2xl"} fontWeight="bold">
        for kids to learn crypto.
      </Text>
    </Flex>
  );
};

export default SplashText;
