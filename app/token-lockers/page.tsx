"use client";

import { Center, Box } from "@chakra-ui/react";
import Navbar from "@/components/LandingNavbar";

const TokenLockers = () => {
  return (
    <Box height="100vh" bgGradient={["linear(to-b, black,#4F1B7C)"]}>
      <Navbar />
      <Center mt="1rem" height="100%">
        Token Lockers - All
      </Center>
    </Box>
  );
};

export default TokenLockers;
