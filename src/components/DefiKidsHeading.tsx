"use client";

import { Text, Flex, Heading, Box } from "@chakra-ui/react";
import * as React from "react";
import { useWindowSize } from "usehooks-ts";

export const DefiKidsHeading = () => {
  const { width } = useWindowSize();

  const isMobileSize = width < 768;

  return (
    <Flex justify="flex-end" alignItems="center">
      <Box>
        <Heading size="4xl" color="white" mt={isMobileSize ? 0 : 6} pr={4}>
          DefiKids
        </Heading>
        <Text align="center">Earn. Save. Stake. Invest.</Text>
      </Box>
    </Flex>
  );
};
