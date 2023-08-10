import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";

const SequenceLogin = () => {
  return (
    <>
      <Box
        position="absolute"
        zIndex={1}
        w="80%"
        left="50%"
        transform="translate(-50%, -50%)"
        style={{
          border: "1px solid #82add9",
          borderRadius: "20px",
          backgroundColor: "white",
        }}
      >
        <Center pt={3}>
          <Heading size="lg" color="#82add9">
            Seamless web3 onboarding
          </Heading>
        </Center>
        <Center px={6}>
          <Text fontSize="md" fontWeight="bold" p={6} color="black">
            With Sequence you use your social login to create a non-custodial,
            multi-chain wallet in two clicks without needing to download
            anything or worry about seed phrases.
          </Text>
        </Center>
      </Box>

      <Box
        as="section"
        id="Social Login"
        bgGradient={["linear(to-b, black, #4F1B7C)"]}
      >
        <Flex
          direction="column"
          align="center"
          height="100vh"
          width="100vw"
          bgImage="url('/images/Sequence_Wallet_Login_Art.jpeg')"
          bgPosition="center"
          bgRepeat="no-repeat"
          bgSize="cover"
          px="5rem"
        ></Flex>
      </Box>
    </>
  );
};

export default SequenceLogin;
