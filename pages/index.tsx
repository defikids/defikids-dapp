import { MainLayout } from "@/components/main_layout";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Section } from "@/components/section";

export default function Main() {
  return (
    <>
      {/* <MainLayout> */}
      {/* Landing Section */}
      <Flex
        direction="column"
        align="center"
        // justify="center"
        height="100vh"
        width="100vw"
        // px={20}
        // py={10}
        bgImage="url('/images/main-wallpaper.jpeg')"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        style={{
          boxShadow: "inset 0 0 0 1000px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Box
          mt="20rem"
          style={{
            color: "#82add9",
          }}
        >
          <Heading size="lg">
            Earn, save, stake and invest your allowance.
          </Heading>
        </Box>
        <Text fontSize="2xl" fontWeight="bold">
          A save and secure platform that allows kids to learn about crypto.
        </Text>
      </Flex>

      <Box p={4} h="50rem" bgGradient={["linear(to-b, black, #4F1B7C)"]}></Box>
      <Box p={4} h="50rem" bgColor="white"></Box>
      <Box p={4} h="50rem" bgGradient={["linear(to-b, white, #82add9)"]}></Box>
      <Box p={4} h="50rem" bgColor="black"></Box>
    </>
  );
}
