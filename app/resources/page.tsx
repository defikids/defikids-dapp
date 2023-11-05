"use client";

import { Center, Flex, Box } from "@chakra-ui/react";
import ResourcesModal from "@/components/modals/ResourcesModal";
import Navbar from "@/components/LandingNavbar";
import { PigLoader } from "@/components/PigLoader";
import { FaqAccordian } from "@/components/FaqAccordian";

const Resources = () => {
  return (
    <Box height="100vh" bgGradient={["linear(to-b, black,#4F1B7C)"]}>
      <Navbar />
      <Center mt="1rem">
        <Flex mt="8rem">
          {/* <ResourcesModal /> */}
          <FaqAccordian />
          {/* <PigLoader /> */}
        </Flex>
      </Center>
    </Box>
  );
};

export default Resources;
